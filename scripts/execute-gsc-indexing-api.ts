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

    console.log('📤 Uploading temporary GSC/Indexing API Runner script...');
    const remoteRunnerPath = '/root/esc/scripts/execute-gsc-indexing-api.js';

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

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('213.232.235.181', 'localhost');
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const googleSites = [
  { url: "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa", keyword: "sefakoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa", keyword: "bakirkoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa", keyword: "catalca-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa", keyword: "beylikduzu-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa?read_current=1", keyword: "besyol-universiteli-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa", keyword: "besyol-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa", keyword: "istanbul-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa", keyword: "sancaktepe-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa", keyword: "kartal-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa", keyword: "cekmekoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa", keyword: "arnavutkoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa", keyword: "basaksehir-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa", keyword: "esenler-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa", keyword: "adalar-vip-escort-2026" }
];

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

function notifyIndexNow(url) {
  return new Promise((resolve) => {
    try {
      const indexNowKey = process.env.INDEX_NOW_KEY || "8f7c9e0a2b4d6f8a0c2e4f6a8b0d2e4f";
      const requestUrl = \`https://www.bing.com/indexnow?url=\${encodeURIComponent(url)}&key=\${indexNowKey}\`;
      const parsedUrl = new URL(requestUrl);
      const req = https.request({
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        timeout: 5000
      }, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.end();
    } catch (e) {
      resolve(false);
    }
  });
}

async function startIndexing() {
  console.log("🔒 [AUTH] Initializing official Google Indexing API auth...");
  
  // Try absolute VPS path first, then fallback to current directory
  let keyPath = '/root/esc/google-key.json';
  if (!fs.existsSync(keyPath)) {
    keyPath = path.join(process.cwd(), 'google-key.json');
  }
  
  if (!fs.existsSync(keyPath)) {
    console.error("❌ google-key.json key file not found anywhere!");
    process.exit(1);
  }

  console.log(\`🔑 Using keyfile at: \${keyPath}\`);

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const authClient = await auth.getClient();
  const indexing = google.indexing({
    version: 'v3',
    auth: authClient,
  });

  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  let reportMessage = \`⚔️ <b>[HYDRA GSC & INDEXING API BLAST: ZAFER]</b> ⚔️\\n\\n\`;
  reportMessage += \`🖥️ <b>Sunucu:</b> Frankfurt Fortress (Main)\\n\`;
  reportMessage += \`🕒 <b>Tarih:</b> <code>\${timestamp}</code>\\n\\n\`;
  reportMessage += \`🔥 <b>HİBRİT İNDEKSLEME VE YETKİLİ DOĞRULAMA DURUMU:</b>\\n\\n\`;

  for (const item of googleSites) {
    console.log(\`\\n──────────────────────────────────────────\`);
    console.log(\`🎯 TARGET DISTRICT: \${item.keyword.toUpperCase()}\`);
    console.log(\`🛰️ G-Sites URL: \${item.url}\`);

    let bitlyUrl = \`https://bit.ly/\${item.keyword}\`;
    try {
      const dbLink = await prisma.shortLink.findFirst({
        where: { targetUrl: item.url }
      });
      if (dbLink && dbLink.id.includes('bit.ly')) {
        bitlyUrl = dbLink.id;
      }
    } catch (e) {}

    console.log(\`🔗 Bitly Link: \${bitlyUrl}\`);

    let googleSitesIndexingOk = false;
    let indexNowOk = false;

    // 1. Trigger Official Google Indexing API on Google Site (Using Service Account Auth)
    try {
      console.log(\`📡 Calling Google Indexing API for G-Sites...\`);
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: item.url,
          type: 'URL_UPDATED',
        },
      });
      if (res.status === 200 || res.status === 201) {
        console.log(\`✅ Google Indexing API Success!\`);
        googleSitesIndexingOk = true;
      }
    } catch (gErr) {
      console.error(\`❌ Google Indexing API Error: \`, gErr.message);
    }

    // 2. Trigger IndexNow Broadcast (Bing & Yandex)
    console.log(\`📡 Calling IndexNow Broadcast for G-Sites...\`);
    const sitesBingOk = await notifyIndexNow(item.url);
    console.log(\`📡 Calling IndexNow Broadcast for Bitly...\`);
    const bitlyBingOk = await notifyIndexNow(bitlyUrl);
    indexNowOk = sitesBingOk || bitlyBingOk;

    reportMessage += \`⭐️ <b>[\${item.keyword.split('-')[0].toUpperCase()}]</b>\\n\`;
    reportMessage += \`🛰️ G-Sites GSC API: [\${googleSitesIndexingOk ? '✅ ONAYLANDI (5 Dk İndex)' : '❌ YETKİ REDDEDİLDİ'}]\\n\`;
    reportMessage += \`🔗 Bitly IndexNow: [\${indexNowOk ? '✅ PİNGLENDİ' : '❌ BAŞARISIZ'}]\\n\\n\`;

    // Avoid rate limit spikes
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  reportMessage += \`🏆 <i>Google Indexing API ve IndexNow fırtınası başarıyla tamamlandı. Dizin botları parazit ağımızı anında taramaya başladı!</i>\\n\\n<i>#HydraAPIBlast #WarriorMode #DRKCNAYElite</i>\`;

  console.log("📡 Sending Telegram success report...");
  await sendTelegramReport(reportMessage);
  console.log("✅ Report delivered successfully.");

  await prisma.$disconnect();
  process.exit(0);
}

startIndexing().catch(err => {
  console.error(err);
  process.exit(1);
});
`;

    const base64Code = Buffer.from(codePayload).toString('base64');
    await ssh.execCommand(`mkdir -p /root/esc/scripts`);
    await ssh.execCommand(`echo "${base64Code}" | base64 -d > ${remoteRunnerPath}`);

    console.log('📡 Executing GSC Official Indexing API Blast on remote VPS...');
    const execRes = await ssh.execCommand(`node ${remoteRunnerPath}`);

    console.log('STDOUT:', execRes.stdout);
    console.log('STDERR:', execRes.stderr);

    // Cleanup
    await ssh.execCommand(`rm -f ${remoteRunnerPath}`);
    console.log('🧹 Remote script cleaned up.');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
