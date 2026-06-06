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

    const remoteRunnerPath = '/var/www/escortvip/scripts/broadcast-cache-updates.js';

    const codePayload = `
const fs = require('fs');
const path = require('path');
const https = require('https');

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
const indexNowKey = process.env.INDEX_NOW_KEY || "8771e07e4e31024024720e4a348e10f0";

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

function httpGet(url) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const req = https.request({
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 8000
      }, (res) => {
        resolve(res.statusCode === 200 || res.statusCode === 202);
      });
      req.on('error', () => resolve(false));
      req.end();
    } catch (e) {
      resolve(false);
    }
  });
}

function httpPost(url, body) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const postData = JSON.stringify(body);
      const req = https.request({
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 8000
      }, (res) => {
        resolve(res.statusCode === 200 || res.statusCode === 202);
      });
      req.on('error', () => resolve(false));
      req.write(postData);
      req.end();
    } catch (e) {
      resolve(false);
    }
  });
}

async function start() {
  console.log("📂 Querying active domains...");
  const sites = await prisma.site.findMany({
    where: { status: 'ACTIVE' }
  });

  console.log(\`Found \${sites.length} active domains.\`);

  let googleSuccessCount = 0;
  let indexNowSuccessCount = 0;

  for (const site of sites) {
    const sitemapUrl = \`https://\${site.domain}/sitemap.xml\`;
    console.log(\`\\n──────────────────────────────────────────\`);
    console.log(\`🌐 processing: \${site.domain}\`);

    // 1. Google Sitemap Ping
    console.log(\`   📡 Pinging Google Sitemap...\`);
    const googleRes = await httpGet(\`https://www.google.com/ping?sitemap=\${encodeURIComponent(sitemapUrl)}\`);
    if (googleRes) {
      console.log(\`   ✅ Google Ping Success!\`);
      googleSuccessCount++;
    } else {
      console.log(\`   ❌ Google Ping Failed\`);
    }

    // 2. Fetch pages to notify IndexNow
    const pages = await prisma.pageContent.findMany({
      where: { siteId: site.id },
      orderBy: { updatedAt: 'desc' },
      take: 10
    });

    const urlList = [\`https://\${site.domain}/amp\`];
    for (const page of pages) {
      if (page.slug) {
        urlList.push(\`https://\${site.domain}/amp?loc=\${page.slug}\`);
        urlList.push(\`https://\${site.domain}/\${page.slug}\`);
      }
    }

    console.log(\`   📡 Sending IndexNow broadcast for \${urlList.length} URLs...\`);
    const indexNowPayload = {
      host: site.domain,
      key: indexNowKey,
      keyLocation: \`https://\${site.domain}/\${indexNowKey}.txt\`,
      urlList: urlList
    };

    const indexNowRes = await httpPost('https://www.bing.com/indexnow', indexNowPayload);
    if (indexNowRes) {
      console.log(\`   ✅ IndexNow Broadcast Success!\`);
      indexNowSuccessCount++;
    } else {
      console.log(\`   ❌ IndexNow Broadcast Failed\`);
    }

    // Avoid rate-limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  let reportMessage = \`🔄 <b>[HYDRA GOOGLE & BING CACHE UPDATER]</b> 🔄\\n\\n\`;
  reportMessage += \`🕒 <b>Tarih:</b> <code>\${timestamp}</code>\\n\`;
  reportMessage += \`🌐 <b>Toplam Domain:</b> <code>\${sites.length}</code>\\n\`;
  reportMessage += \`✅ <b>Google Sitemap Pings:</b> <code>\${googleSuccessCount} / \${sites.length}</code>\\n\`;
  reportMessage += \`✅ <b>IndexNow Broadcasts:</b> <code>\${indexNowSuccessCount} / \${sites.length}</code>\\n\\n\`;
  reportMessage += \`🚀 <i>Tüm alan adlarının sitemleri Google'a bildirilerek botların taze AMP sürümlerini çekmesi sağlandı. IndexNow ile Bing/Yandex önbelleği de anında güncellendi!</i>\\n\\n<i>#HydraCacheUpdater #WarriorMode</i>\`;

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
    const cleanPayload = codePayload.replace(/&/g, '$');

    const base64Code = Buffer.from(cleanPayload).toString('base64');
    await ssh.execCommand(`mkdir -p /var/www/escortvip/scripts`);
    await ssh.execCommand(`echo "${base64Code}" | base64 -d > ${remoteRunnerPath}`);

    console.log('Executing Google Sitemap and IndexNow cache updates on Server 2...');
    const execRes = await ssh.execCommand(`node ${remoteRunnerPath}`, {
      cwd: '/var/www/escortvip'
    });

    console.log('STDOUT:\n', execRes.stdout);
    if (execRes.stderr) {
      console.warn('STDERR:\n', execRes.stderr);
    }

    // Cleanup
    await ssh.execCommand(`rm -f ${remoteRunnerPath}`);
    console.log('Cleaned up remote files.');

    ssh.dispose();
  } catch (err) {
    console.error('Execution failed:', err);
    ssh.dispose();
  }
}

run();
