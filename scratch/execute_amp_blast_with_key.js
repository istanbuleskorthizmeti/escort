const fs = require('fs');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    console.log('Connecting to Server 2 (187.77.111.203)...');
    await ssh.connect(config);
    console.log('Connected.');

    const localKeyPath = 'c:\\Users\\onurk\\esc\\hydra-gcp-key.json.bak';
    const remoteKeyPath = '/var/www/escortvip/google-key-hydra.json';
    const remoteRunnerPath = '/var/www/escortvip/scripts/execute-gsc-amp-blast-v3.js';

    console.log('Uploading hydra-gcp-key.json.bak File...');
    const keyContent = fs.readFileSync(localKeyPath, 'utf8');
    const base64Key = Buffer.from(keyContent).toString('base64');
    await ssh.execCommand(`echo "${base64Key}" | base64 -d > ${remoteKeyPath}`);
    console.log('Key uploaded successfully.');

    const codePayload = `
const fs = require('fs');
const path = require('path');
const https = require('https');
const { google } = require('googleapis');

function loadEnv() {
  try {
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
          process.env[key] = val;
        }
      });
    }
  } catch (err) {}
}

loadEnv();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramReport(message) {
  if (!token || !chatId) return;
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: '/bot' + token + '/sendMessage',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const req = https.request(options, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve(true));
    });
    req.on('error', () => resolve(false));
    req.write(postData);
    req.end();
  });
}

async function start() {
  console.log("🔒 [AUTH] Initializing GSC API auth using hydra-ai-admin key...");
  const keyPath = '${remoteKeyPath}';
  if (!fs.existsSync(keyPath)) {
    console.error("❌ Key file not found!");
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const authClient = await auth.getClient();
  const indexing = google.indexing({
    version: 'v3',
    auth: authClient,
  });

  console.log("📂 Querying active domains from database...");
  const sites = await prisma.site.findMany({
    where: { status: 'ACTIVE' }
  });

  console.log(\`Found \&{sites.length} active domains.\`);

  const urlsToSubmit = [];

  for (const site of sites) {
    // 1. Add main AMP url
    urlsToSubmit.push(\`https://\&{site.domain}/amp\`);

    // 2. Query up to 5 latest pages for district loc parameter
    const pages = await prisma.pageContent.findMany({
      where: { siteId: site.id },
      orderBy: { updatedAt: 'desc' },
      take: 5
    });

    for (const page of pages) {
      if (page.slug) {
        urlsToSubmit.push(\`https://\&{site.domain}/amp?loc=\&{page.slug}\`);
      }
    }
  }

  // De-duplicate URLs
  const uniqueUrls = [...new Set(urlsToSubmit)];
  console.log(\`Generated \&{uniqueUrls.length} total AMP URLs for validation.\`);

  // Cap at 190 URLs to prevent hitting the daily 200 URL quota limit
  const finalUrls = uniqueUrls.slice(0, 190);
  console.log(\`Final submission batch size (cap 190): \&{finalUrls.length}\`);

  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < finalUrls.length; i++) {
    const url = finalUrls[i];
    console.log(\`[\&{i + 1}/\&{finalUrls.length}] Submitting to GSC API: \&{url}\`);
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      if (res.status === 200 || res.status === 201) {
        console.log("✅ Success!");
        successCount++;
      } else {
        console.warn(\`⚠️ Warning: Status \&{res.status}\`);
        failedCount++;
      }
    } catch (err) {
      console.error(\`❌ Error: \`, err.message);
      failedCount++;
    }
    // Rate limit sleep
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  let reportMessage = \`⚡ <b>[HYDRA GSC AMP VALIDATION BLAST - V3 (hydra-ai-admin)]</b> ⚡\\n\\n\`;
  reportMessage += \`🕒 <b>Tarih:</b> <code>\&{timestamp}</code>\\n\`;
  reportMessage += \`🌐 <b>Domain Sayısı:</b> <code>\&{sites.length} Active Domains</code>\\n\`;
  reportMessage += \`📈 <b>Gönderilen AMP URL Sayısı:</b> <code>\&{finalUrls.length}</code>\\n\`;
  reportMessage += \`✅ <b>Başarılı:</b> <code>\&{successCount}</code>\\n\`;
  reportMessage += \`❌ <b>Başarısız:</b> <code>\&{failedCount}</code>\\n\\n\`;
  reportMessage += \`🚀 <i>Google Indexing API üzerinden tüm alan adlarındaki AMP sayfaları Googlebot'a zorla taratıldı. AMP doğrulaması başarıyla tetiklendi!</i>\\n\\n<i>#HydraGSCBlast #AMPValidation</i>\`;

  console.log("📡 Sending Telegram success report...");
  await sendTelegramReport(reportMessage);
  console.log("✅ Telegram report sent.");

  await prisma.$disconnect();
  console.log("🏁 Completed!");
  process.exit(0);
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
`;

    // Replace escaping in the template
    const cleanPayload = codePayload
      .replace(/&/g, '$');

    const base64Code = Buffer.from(cleanPayload).toString('base64');
    await ssh.execCommand(`mkdir -p /var/www/escortvip/scripts`);
    await ssh.execCommand(`echo "${base64Code}" | base64 -d > ${remoteRunnerPath}`);

    console.log('Executing AMP validation blast on Server 2 with hydra key...');
    const execRes = await ssh.execCommand(`node ${remoteRunnerPath}`, {
      cwd: '/var/www/escortvip'
    });

    console.log('STDOUT:\n', execRes.stdout);
    if (execRes.stderr) {
      console.warn('STDERR:\n', execRes.stderr);
    }

    // Cleanup
    await ssh.execCommand(`rm -f ${remoteKeyPath}`);
    await ssh.execCommand(`rm -f ${remoteRunnerPath}`);
    console.log('Cleaned up remote files.');

    ssh.dispose();
  } catch (err) {
    console.error('Execution failed:', err);
    ssh.dispose();
  }
}

run();
