import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to VPS.');

    console.log('📤 Uploading temporary Parasite Watchdog script...');
    const remoteWatcherPath = '/root/esc/scripts/parasite-health-check.js';

    const watcherCode = `
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

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('213.232.235.181', 'localhost');
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramAlert(message) {
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

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const req = https.request({
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Googlebot/2.1'
        },
        timeout: 8000
      }, (res) => {
        resolve(res.statusCode);
      });
      req.on('error', () => resolve(500));
      req.on('timeout', () => {
        req.destroy();
        resolve(408);
      });
      req.end();
    } catch (e) {
      resolve(400);
    }
  });
}

async function startAudit() {
  console.log("🔍 Fetching active parasite links...");
  const links = await prisma.shortLink.findMany();
  
  if (links.length === 0) {
    console.log("No links found.");
    process.exit(0);
  }

  console.log(\`Auditing \${links.length} active parasite links...\`);
  
  const reportDetails = [];
  let deadCount = 0;

  for (const link of links) {
    // Only check Google Sites targetUrl
    if (link.targetUrl && link.targetUrl.includes('sites.google.com')) {
      const status = await checkUrl(link.targetUrl);
      console.log(\`Checked: \${link.id} -> Status: \${status}\`);
      
      if (status === 404 || status >= 500) {
        deadCount++;
        reportDetails.push(\`🔴 <b>Bölge:</b> \${link.id.split('/').pop()} (STATUS: <b>\${status}</b>)\\n🔗 <b>G-Site:</b> \${link.targetUrl}\`);
      }
    }
  }

  if (deadCount > 0) {
    const alertMessage = \`🚨 <b>[HYDRA ALARM: PARAZİT KALE DÜŞTÜ]</b>\\n\\n\` +
                         \`⚠️ Tespit Edilen Hasarlı Link Sayısı: <b>\${deadCount}</b>\\n\\n\` +
                         reportDetails.join('\\n\\n') +
                         \`\\n\\n<i>⚡ Acil Müdahale ve Hydra Siege Yeniden Dağıtımı Önerilir.</i>\`;
    await sendTelegramAlert(alertMessage);
    console.log("💥 Deficiencies found. Telegram alert triggered!");
  } else {
    console.log("✅ All fortress gates are standing strong.");
    await sendTelegramAlert(\`🛡️ <b>[HYDRA DİZİN DENETİMİ: GÜVENLİ]</b>\\n\\n✅ Veritabanında kayıtlı tüm Google Sites parazit linkleri aktiftir. Dizin kapıları sapasağlam ayakta!\\n\\n<i>#SovereignHydra #Watchdog</i>\`);
  }

  await prisma.$disconnect();
  process.exit(0);
}

startAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
`;

    // Write watcher code using base64 echo approach to avoid formatting issues
    const base64Code = Buffer.from(watcherCode).toString('base64');
    await ssh.execCommand(`mkdir -p /root/esc/scripts`);
    await ssh.execCommand(`echo "${base64Code}" | base64 -d > ${remoteWatcherPath}`);

    console.log('📡 Executing Parasite Watchdog Audit on remote VPS...');
    const execRes = await ssh.execCommand(`node ${remoteWatcherPath}`);

    console.log('STDOUT:', execRes.stdout);
    console.log('STDERR:', execRes.stderr);

    // Cleanup
    await ssh.execCommand(`rm -f ${remoteWatcherPath}`);
    console.log('🧹 Remote script cleaned up.');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
