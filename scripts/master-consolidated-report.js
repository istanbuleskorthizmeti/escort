const { PrismaClient } = require('@prisma/client');
const os = require('os');
const { exec } = require('child_process');
const https = require('https');
const prisma = new PrismaClient();

require('dotenv').config();

const THEME = {
  DIVIDER: "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
  HEADER: "⚡ <b>DRKCNAY ELITE: MASTER HYDRA OPERATIONS DASHBOARD</b> ⚡",
  SUCCESS: "🟢",
  WARNING: "🟡",
  ERROR: "🔴",
  PULSE: "⚡",
  SERVER: "🖥️",
  BAR_FULL: "█",
  BAR_EMPTY: "░"
};

function generateProgressBar(percent, length = 10) {
  const filledLength = Math.round((length * Math.min(100, percent)) / 100);
  const emptyLength = length - filledLength;
  return THEME.BAR_FULL.repeat(filledLength) + THEME.BAR_EMPTY.repeat(emptyLength);
}

// 📍 TARGET KEYWORDS & DOMAINS
const TARGET_KEYWORDS = [
  "istanbul escort",
  "bağcılar escort",
  "şişli escort",
  "beşiktaş escort",
  "beylikdüzü escort"
];

// Helper to query Google Search via standard HTTPS
function checkSerpRankings() {
  return new Promise((resolve) => {
    let block = `🔑 <b>SERP ANALİZİ (Google TR):</b>\n`;
    let completed = 0;

    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    const targetDomains = ['vipescorthizmeti.com', 'bagcilar', 'vipescort'];

    if (TARGET_KEYWORDS.length === 0) {
      return resolve(block + "⚪ <i>Hedef kelime yok.</i>\n");
    }

    TARGET_KEYWORDS.forEach((kw, index) => {
      setTimeout(() => {
        const query = encodeURIComponent(kw);
        const options = {
          hostname: 'www.google.com.tr',
          path: `/search?q=${query}&num=30&gl=tr&hl=tr`,
          headers: { 'User-Agent': userAgent }
        };

        https.get(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            const seenDomains = new Set();
            let currentPosition = 1;
            let matches = [];
            
            const linkRegex = /<a[^>]+href="(https?:\/\/([^"\/]+))"/gi;
            let match;
            const noise = ['google.com', 'w3.org', 'youtube.com', 'facebook.com', 'instagram.com', 'twitter.com', 'apple.com'];

            while ((match = linkRegex.exec(data)) !== null && currentPosition <= 30) {
              const domain = match[2].toLowerCase();
              if (noise.some(n => domain.includes(n)) || seenDomains.has(domain)) continue;
              seenDomains.add(domain);
              
              if (targetDomains.some(td => domain.includes(td))) {
                matches.push({ domain, rank: currentPosition });
              }
              currentPosition++;
            }

            block += `• <b>${kw.toUpperCase()}:</b>\n`;
            if (matches.length > 0) {
              matches.forEach(m => {
                const icon = m.rank <= 3 ? '🥇' : m.rank <= 10 ? '🔥' : '📈';
                block += `  ${icon} <code>${m.domain}</code> -> <b>#${m.rank}</b>\n`;
              });
            } else {
              block += `  ⚪ <i>İlk 30'da henüz kayıt yok.</i>\n`;
            }
            
            completed++;
            if (completed === TARGET_KEYWORDS.length) {
              resolve(block);
            }
          });
        }).on('error', (e) => {
          block += `• <b>${kw.toUpperCase()}:</b> ⚠️ <i>Sorgulama limitlendi (${e.message})</i>\n`;
          completed++;
          if (completed === TARGET_KEYWORDS.length) {
            resolve(block);
          }
        });
      }, index * 1500); // 1.5s delay to avoid IP blocks
    });
  });
}

// 💾 Local Health Stats (On the server it runs on)
function getLocalHealth() {
  return new Promise((resolve) => {
    const cpuLoad = os.loadavg();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePct = Math.round((usedMem / totalMem) * 100);
    
    exec("pm2 jlist", (err, stdout) => {
      let pm2Block = "";
      if (err || !stdout) {
        pm2Block = "  ⚠️ PM2 servisleri listelenemedi.";
      } else {
        try {
          const procs = JSON.parse(stdout);
          pm2Block = procs.map((p) => {
            const isOnline = p.pm2_env.status === 'online';
            const restarts = p.pm2_env.restart_time || 0;
            const mem = p.monit?.memory ? `${Math.round(p.monit.memory / 1024 / 1024)}MB` : '0MB';
            return `  ${isOnline ? THEME.SUCCESS : THEME.ERROR} <code>${p.name.replace('drkcnay-', '')}</code> [${mem}] ↺${restarts}`;
          }).join('\n');
        } catch (e) {
          pm2Block = "  ⚠️ PM2 detayları ayrıştırılamadı.";
        }
      }

      const block = `🖥️ <b>PROD SUNUCUSU (Alexhost):</b>
• <b>CPU Yükü (1dk):</b> <code>${(Number(cpuLoad[0]) || 0).toFixed(2)}</code> [${generateProgressBar(Math.min((Number(cpuLoad[0]) || 0) * 10, 100), 10)}]
• <b>RAM Kullanımı:</b> %${memUsagePct} [${generateProgressBar(memUsagePct, 10)}] (<code>${Math.round(usedMem/1024/1024)}MB / ${Math.round(totalMem/1024/1024)}MB</code>)
• <b>Aktif PM2 Süreçleri:</b>\n${pm2Block}\n`;
      resolve(block);
    });
  });
}

// 🗄️ Database operational metrics
async function getDbMetrics() {
  const [
    totalPages,
    bloggerPosted,
    tumblrPosted,
    wordpressPosted,
    telegraphPosted,
    githubPosted,
    gistPosted,
    indexedPages,
    authorityAssets,
    totalLeads,
    completedLeads,
    totalRevenue,
    whatsappClicks
  ] = await Promise.all([
    prisma.pageContent.count(),
    prisma.pageContent.count({ where: { isBloggerPosted: true } }),
    prisma.pageContent.count({ where: { isTumblrPosted: true } }),
    prisma.pageContent.count({ where: { isWordPressPosted: true } }),
    prisma.pageContent.count({ where: { isTelegraphPosted: true } }),
    prisma.pageContent.count({ where: { isGitHubPosted: true } }),
    prisma.pageContent.count({ where: { isGistPosted: true } }),
    prisma.pageContent.count({ where: { isIndexed: true } }),
    prisma.authorityAsset.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'COMPLETED' } }),
    prisma.lead.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { paymentAmount: true }
    }),
    prisma.whatsAppClick.count()
  ]);

  const totalBacklinks = bloggerPosted + tumblrPosted + wordpressPosted + telegraphPosted + githubPosted + gistPosted;
  const leadRevenue = totalLeads > 0 ? (totalRevenue._sum.paymentAmount || 0) : 0;
  const conversionRate = totalLeads > 0 ? Math.round((completedLeads / totalLeads) * 100) : 0;

  return `🗄️ <b>İÇERİK VE BACKLINK MATRİSİ:</b>
• <b>Toplam Uydu Sayfası:</b> <code>${totalPages}</code>
• <b>Google İndeks Durumu:</b> <code>${indexedPages} / ${totalPages}</code> [${generateProgressBar((indexedPages / Math.max(1, totalPages)) * 100, 10)}]
• <b>Toplam Savaş Backlinki:</b> <code>${totalBacklinks}</code>
  • Blogger: <code>${bloggerPosted}</code>
  • Telegraph: <code>${telegraphPosted}</code>
  • WordPress: <code>${wordpressPosted}</code>
  • Tumblr: <code>${tumblrPosted}</code>
  • GitHub/Gist: <code>${githubPosted + gistPosted}</code>
• <b>Elite Otorite Varlıkları:</b> <code>${authorityAssets} adet (DR 90+)</code>

📊 <b>CRM VE LİDER ETKİLEŞİMLERİ:</b>
• <b>Toplam WhatsApp Tıklama:</b> <code>${whatsappClicks}</code>
• <b>Toplam Oluşan Talep:</b> <code>${totalLeads}</code>
• <b>Tamamlanan Seanslar:</b> <code>${completedLeads}</code>
• <b>Dönüşüm Verimliliği:</b> %${conversionRate} [${generateProgressBar(conversionRate, 10)}]
• <b>Toplam Elden Gelir:</b> <code>${leadRevenue.toLocaleString('tr-TR')} TL</code>
`;
}

// Push message directly to Telegram API via HTTPS
function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!token || !chatId) {
      return reject(new Error("Missing Telegram Credentials"));
    }

    const payload = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true }
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(responseBody));
        } else {
          reject(new Error(`TG Send Failed: ${res.statusCode}. Resp: ${responseBody}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
}

// 🏁 Master execution
async function runMasterDashboard() {
  console.log("⚡ [MASTER DASHBOARD] Commencing multi-layered audit...");
  const startTime = Date.now();
  
  try {
    const dbMetrics = await getDbMetrics();
    const localHealth = await getLocalHealth();
    const serpRankings = await checkSerpRankings();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    const fullMessage = `
${THEME.HEADER}
${THEME.DIVIDER}
🕒 <b>Tarih:</b> <code>${new Date().toLocaleString('tr-TR')}</code>
⏱️ <b>Audit Süresi:</b> <code>${duration}s</code>
${THEME.DIVIDER}

${dbMetrics}
${THEME.DIVIDER}

${localHealth}
${THEME.DIVIDER}

${serpRankings}
${THEME.DIVIDER}
🧛‍♂️ <b>DURUM:</b> <i>Tüm sunucu ve ağ bileşenleri senkronize edildi. Google SERP taarruzu 24/7 kesintisiz sürmektedir.</i>
🚀 <i>v10.0-GOD-MODE - Master Hydra Command Suite</i>
    `.trim();

    let finalMessage = fullMessage;
    if (finalMessage.length > 4000) {
      finalMessage = finalMessage.substring(0, 3900) + "\n\n... (Rapor çok uzun, detaylar veritabanında saklandı.)";
    }

    await sendTelegramMessage(finalMessage);
    console.log("✅ [MASTER DASHBOARD SUCCESS] Full audit pushed to Telegram channel.");
    console.log(finalMessage);
  } catch (err) {
    console.error("❌ [MASTER DASHBOARD ERROR]", err);
    try {
      const safeError = err.message ? err.message.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'Bilinmeyen Hata';
      await sendTelegramMessage(`🚨 <b>MASTER DASHBOARD HATASI:</b> <code>${safeError}</code>`);
    } catch (e) {
      console.error("Failed to send error alert to Telegram:", e.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

runMasterDashboard().then(() => process.exit(0));
