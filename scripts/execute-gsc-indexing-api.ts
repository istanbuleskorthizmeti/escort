import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to VPS.');

    console.log('🛡️ Terminating any existing execute-gsc-indexing-api instances on VPS...');
    await ssh.execCommand('pkill -f execute-gsc-indexing-api.js || true');

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
  { url: "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa", keyword: "adalar-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026/ana-sayfa", keyword: "silivri-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v/ana-sayfa", keyword: "beyoglu-vip-escort-2026" }
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

// Key Rotator Engine for GSC Indexing API
class IndexingRotator {
  constructor() {
    this.clients = [];
    this.currentIdx = 0;
    this.initializeClients();
  }

  initializeClients() {
    const rootDir = '/root/esc';
    const files = fs.readdirSync(rootDir);
    const keyFiles = files.filter(f => 
      f.endsWith('.json') && 
      (f.startsWith('google-key') || f.startsWith('hydra-gcp-key') || f.startsWith('sovereign-spyy'))
    );

    console.log(\`🔍 Found \${keyFiles.length} key files on VPS.\`);

    for (const file of keyFiles) {
      try {
        const keyPath = path.join(rootDir, file);
        const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

        if (!keyData.private_key || !keyData.client_email) {
          continue;
        }

        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: keyData.client_email,
            private_key: keyData.private_key.replace(/\\\\n/g, '\\n'),
          },
          scopes: ['https://www.googleapis.com/auth/indexing'],
        });

        const indexingClient = google.indexing({
          version: 'v3',
          auth,
        });

        this.clients.push({
          fileName: file,
          email: keyData.client_email,
          projectId: keyData.project_id || 'unknown',
          indexingClient,
          isExhausted: false,
          unauthorizedSites: new Set()
        });

        console.log(\`🔑 Initialized key: \${file} (\${keyData.client_email})\`);
      } catch (err) {
        console.error(\`❌ Failed to load \${file}:\`, err.message);
      }
    }
  }

  async publish(url) {
    if (this.clients.length === 0) {
      throw new Error("No service accounts loaded.");
    }

    const domain = new URL(url).hostname;
    let siteId = domain;
    if (domain === 'sites.google.com') {
      const urlParts = url.split('/');
      if (urlParts.length >= 5) {
        siteId = \`\${urlParts[2]}/\${urlParts[3]}/\${urlParts[4]}\`;
      }
    }

    let attempts = 0;
    const maxAttempts = this.clients.length;

    while (attempts < maxAttempts) {
      const activeClient = this.clients[this.currentIdx];

      if (activeClient.isExhausted || activeClient.unauthorizedSites.has(siteId)) {
        this.rotate();
        attempts++;
        continue;
      }

      try {
        const res = await activeClient.indexingClient.urlNotifications.publish({
          requestBody: {
            url,
            type: 'URL_UPDATED',
          },
        });

        if (res.status === 200 || res.status === 201) {
          return {
            success: true,
            email: activeClient.email,
            projectId: activeClient.projectId
          };
        }
        throw new Error(\`GSC API responded with status \${res.status}\`);
      } catch (err) {
        const errMsg = err.message || '';
        const errCode = err.code || 500;
        const isQuota = errMsg.includes('Quota exceeded') || errMsg.includes('limitExceeded') || errCode === 429;
        const isPermission = errMsg.includes('Permission denied') || errMsg.includes('not owner') || errMsg.includes('not verified');
        const isTransient = errMsg.includes('ETIMEDOUT') || errMsg.includes('ECONNRESET') || 
                            errMsg.includes('ECONNREFUSED') || errMsg.includes('ENOTFOUND') || 
                            errMsg.includes('socket hang up') || errMsg.includes('fetch failed') || 
                            errMsg.includes('timeout');

        if (isQuota) {
          console.log(\`⚠️ Quota exceeded for \${activeClient.email}. Rotating...\`);
          activeClient.isExhausted = true;
          this.rotate();
        } else if (isPermission && errCode === 403) {
          console.log(\`⚠️ Permission denied for \${activeClient.email} on \${siteId}. Rotating...\`);
          activeClient.unauthorizedSites.add(siteId);
          this.rotate();
        } else if (!isTransient) {
          console.log(\`❌ Key \${activeClient.email} failed with critical permanent error: \`, errMsg);
          console.log(\`❌ Disabling client \${activeClient.email} to prevent infinite iteration loops.\`);
          activeClient.isExhausted = true;
          this.rotate();
        } else {
          console.log(\`⚠️ Transient network warning for \${activeClient.email}: \`, errMsg);
          this.rotate();
        }
      }
      attempts++;
    }

    return {
      success: false,
      error: 'All service account credentials in the pool have been exhausted or rejected.'
    };
  }

  rotate() {
    this.currentIdx = (this.currentIdx + 1) % this.clients.length;
  }
}

async function startIndexing() {
  console.log("🔒 [AUTH] Initializing official Google Indexing API auth with key rotation...");
  const rotator = new IndexingRotator();

  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  let reportMessage = \`⚔️ <b>[HYDRA GSC INDEXING BLAST: ZAFER]</b> ⚔️\\n\\n\`;
  reportMessage += \`🕒 <b>Tarih:</b> <code>\${timestamp}</code>\\n\\n\`;
  reportMessage += \`🔥 <b>HİBRİT İNDEKSLEME VE YETKİLİ DOĞRULAMA DURUMU:</b>\\n\\n\`;

  let sitesCount = 0;
  let moneySiteCount = 0;
  let errorCount = 0;

  // 1. Prioritized Google Sites Queue
  console.log("🚀 Starting Google Sites queue submission...");
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

    let googleSitesIndexingOk = false;
    let indexNowOk = false;

    // Trigger Rotated Indexing API
    try {
      const res = await rotator.publish(item.url);
      if (res.success) {
        googleSitesIndexingOk = true;
        sitesCount++;
        console.log(\`✅ Google Sites Indexing Success via: \${res.email}\`);
      } else {
        errorCount++;
        console.error(\`❌ Google Sites Indexing failed: \${res.error}\`);
        if (res.email === 'all_exhausted') {
          console.warn('⚠️ [ROTATOR] All service accounts in the pool are exhausted. Breaking G-Sites loop.');
          reportMessage += \`⚠️ <b>[KOTA UYARISI]</b> Tüm GSC API kotaları tükendi! İşlem yarıda kesildi.\\\\n\\\\n\`;
          break;
        }
      }
    } catch (err) {
      errorCount++;
      console.error(\`❌ Google Sites Indexing Error: \`, err.message);
    }

    // Trigger IndexNow (Bing/Yandex)
    const sitesBingOk = await notifyIndexNow(item.url);
    const bitlyBingOk = await notifyIndexNow(bitlyUrl);
    indexNowOk = sitesBingOk || bitlyBingOk;

    reportMessage += \`⭐️ <b>[\${item.keyword.split('-')[0].toUpperCase()}]</b>\\n\`;
    reportMessage += \`🛰️ G-Sites GSC API: [\${googleSitesIndexingOk ? '✅ ONAYLANDI (5 Dk İndex)' : '❌ YETKİ HATA/LİMİT'}]\\n\`;
    reportMessage += \`🔗 Bitly IndexNow: [\${indexNowOk ? '✅ PİNGLENDİ' : '❌ BAŞARISIZ'}]\\n\\n\`;

    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // 2. Money Site (istanbulescort.blog) Queue
  console.log("\\n==========================================");
  console.log("🚀 Starting money site (istanbulescort.blog) queue submission...");
  
  const moneySiteUrls = [
    "https://dorukcanay.digital/",
    "https://dorukcanay.digital/istanbul",
    "https://istanbulescort.blog/",
    "https://istanbulescort.blog/istanbul"
  ];

  // Dynamically load districts for comprehensive indexing coverage
  const istanbulDistricts = [
    'besiktas', 'sisli', 'beylikduzu', 'kadikoy', 'bakirkoy', 
    'atasehir', 'esenyurt', 'fatih', 'bagcilar', 'bahcelievler',
    'umraniye', 'pendik', 'maltepe', 'kartal', 'sariyer', 
    'uskudar', 'avcilar', 'cekmekoy', 'tuzla', 'arnavutkoy', 
    'gaziosmanpasa', 'sultanbeyli', 'güngören', 'zeytinburnu', 
    'sile', 'catalca', 'silivri', 'buyukcekmece', 'kucukcekmece', 
    'adalar', 'bayrampasa', 'sultangazi'
  ];

  // Prioritize dorukcanay.digital districts first!
  istanbulDistricts.forEach(dist => {
    moneySiteUrls.push(`https://dorukcanay.digital/istanbul/\${dist}`);
    // Subdomainler dahil
    moneySiteUrls.push(`https://\${dist}.dorukcanay.digital/`);
    moneySiteUrls.push(`https://\${dist}.istanbulescort.blog/`);
  });

  // Then add istanbulescort.blog districts
  istanbulDistricts.forEach(dist => {
    moneySiteUrls.push(`https://istanbulescort.blog/istanbul/\${dist}`);
  });

  try {
    const dbPages = await prisma.pageContent.findMany({
      where: {
        site: {
          domain: { in: ['dorukcanay.digital', 'istanbulescort.blog'] }
        }
      },
      select: {
        slug: true,
        site: {
          select: { domain: true }
        }
      }
    });
    dbPages.forEach(p => {
      let slug = p.slug.toLowerCase().trim();
      if (!slug.includes('/') && slug.includes('-')) {
        const parts = slug.split('-');
        if (parts[0] === 'istanbul' && parts.length > 1) {
          slug = \`istanbul/\${parts.slice(1).join('/')}\`;
        }
      }
      const domain = p.site?.domain || 'istanbulescort.blog';
      const fullUrl = \`https://\${domain}/\${slug}\`;
      if (!moneySiteUrls.includes(fullUrl)) {
        if (domain === 'dorukcanay.digital') {
          // Insert after initial homepage / districts of dorukcanay.digital
          moneySiteUrls.splice(41, 0, fullUrl);
        } else {
          moneySiteUrls.push(fullUrl);
        }
      }
    });
  } catch (dbErr) {
    console.warn("⚠️ Could not load money site pages from DB:", dbErr.message);
  }

  console.log(\`📋 Loaded \${moneySiteUrls.length} money site URLs for indexing.\`);

  // Submit Money Site URLs
  for (const url of moneySiteUrls) {
    const domain = new URL(url).hostname;
    let siteId = domain;
    if (domain === 'sites.google.com') {
      const urlParts = url.split('/');
      if (urlParts.length >= 5) {
        siteId = \`\${urlParts[2]}/\${urlParts[3]}/\${urlParts[4]}\`;
      }
    }
    const allExhaustedOrUnauthorized = rotator.clients.every(c => 
      c.isExhausted || c.unauthorizedSites.has(siteId)
    );
    if (allExhaustedOrUnauthorized) {
      console.warn(\`⚠️ [ROTATOR] All service accounts in the pool are exhausted or unauthorized for \${siteId}. Breaking indexing loop.\`);
      reportMessage += \`⚠️ <b>[KOTA/YETKİ UYARISI]</b> Tüm GSC API kotaları veya yetkileri tükendi! İşlem sonlandırıldı.\\\\n\\\\n\`;
      break;
    }

    console.log(\`📡 Calling Google Indexing API for Money Site URL: \${url}\`);
    try {
      const res = await rotator.publish(url);
      if (res.success) {
        moneySiteCount++;
        console.log(\`✅ Indexing Success for \${url} via \${res.email}\`);
      } else {
        errorCount++;
        console.error(\`❌ Indexing failed for \${url}: \${res.error}\`);
      }
    } catch (err) {
      errorCount++;
      console.error(\`❌ Error indexing money site URL: \`, err.message);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Finalize Telegram report
  reportMessage += \`📊 <b>ÖZET DETAYLARI:</b>\\n\`;
  reportMessage += \`🛰️ <b>G-Sites İndexlenen:</b> <code>\${sitesCount} adet</code>\\n\`;
  reportMessage += \`💰 <b>Money Site İndexlenen:</b> <code>\${moneySiteCount} adet</code>\\n\`;
  reportMessage += \`❌ <b>Hata Alınanlar:</b> <code>\${errorCount} adet</code>\\n\\n\`;
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

    console.log('📡 Executing GSC Official Indexing API Blast on remote VPS (background mode)...');
    await ssh.execCommand('mkdir -p /root/esc/logs');
    // Run in background with nohup, redirecting output to /root/esc/logs/indexing.log
    await ssh.execCommand(`nohup node ${remoteRunnerPath} > /root/esc/logs/indexing.log 2>&1 &`);

    console.log('🚀 Indexing Blast launched in background.');
    console.log('📋 Monitor progress on VPS via: tail -f /root/esc/logs/indexing.log');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
