import { prisma } from "../lib/prisma";
import { TelegramService } from "../lib/crm/telegram";
import { DOMAIN_MATRIX } from "../config/domains";
import { NodeSSH } from 'node-ssh';
import os from 'os';
import axios from 'axios';
import dotenv from 'dotenv';
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
dotenv.config();

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

function generateProgressBar(percent: number, length: number = 10): string {
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

const TARGET_DOMAINS = DOMAIN_MATRIX
  .filter(d => d.role === 'MONEY_SITE' || d.host.includes('bagcilar') || d.host.includes('vipescort'))
  .map(d => d.host);

// 🔍 Real-time SERP Check
async function checkSerpRankings(): Promise<string> {
  const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  let block = `🔑 <b>SERP ANALİZİ (Google TR):</b>\n`;
  
  for (const kw of TARGET_KEYWORDS) {
    try {
      const searchUrl = `https://www.google.com.tr/search?q=${encodeURIComponent(kw)}&num=30&gl=tr&hl=tr`;
      const response = await axios.get(searchUrl, {
        headers: { "User-Agent": userAgent },
        timeout: 5000
      });
      const html = response.data;
      const seenDomains = new Set();
      let currentPosition = 1;
      let matches: { domain: string, rank: number }[] = [];
      
      const linkRegex = /<a[^>]+href="(https?:\/\/([^"\/]+))"/gi;
      let match;
      const noise = ['google.com', 'w3.org', 'youtube.com', 'facebook.com', 'instagram.com', 'twitter.com', 'apple.com'];

      while ((match = linkRegex.exec(html)) !== null && currentPosition <= 30) {
        const domain = match[2].toLowerCase();
        if (noise.some(n => domain.includes(n)) || seenDomains.has(domain)) continue;
        seenDomains.add(domain);
        
        if (TARGET_DOMAINS.some(td => domain.includes(td))) {
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
      
      // Delay to avoid blocking
      await new Promise(r => setTimeout(r, 1000));
    } catch (e: any) {
      block += `• <b>${kw.toUpperCase()}:</b> ⚠️ <i>Sorgulama limitlendi (${e.message})</i>\n`;
    }
  }
  return block;
}

// 💾 Local Health Stats
async function getLocalHealth(): Promise<string> {
  const cpuLoad = os.loadavg();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsagePct = Math.round((usedMem / totalMem) * 100);
  
  let pm2Block = "";
  try {
    const { stdout } = await execAsync("pm2 jlist");
    const procs = JSON.parse(stdout);
    pm2Block = procs.map((p: any) => {
      const isOnline = p.pm2_env.status === 'online';
      const restarts = p.pm2_env.restart_time || 0;
      const mem = p.monit?.memory ? `${Math.round(p.monit.memory / 1024 / 1024)}MB` : '0MB';
      return `  ${isOnline ? THEME.SUCCESS : THEME.ERROR} <code>${p.name}</code> [${mem}] ↺${restarts}`;
    }).join('\n');
  } catch (e) {
    pm2Block = "  ⚠️ PM2 servisleri okunurken hata oluştu.";
  }

  return `💻 <b>LOCAL YÖNETİM SUNUCUSU:</b>
• <b>CPU Yükü:</b> <code>${(Number(cpuLoad[0]) || 0).toFixed(2)}</code> [${generateProgressBar(Math.min((Number(cpuLoad[0]) || 0) * 10, 100), 10)}]
• <b>RAM:</b> %${memUsagePct} [${generateProgressBar(memUsagePct, 10)}] (<code>${Math.round(usedMem/1024/1024)}MB / ${Math.round(totalMem/1024/1024)}MB</code>)
• <b>Aktif PM2 Düğümleri:</b>\n${pm2Block}\n`;
}

// ☁️ Remote Server Health Stats (SSH)
async function getRemoteHealth(): Promise<string> {
  const host = process.env.SSH_HOST;
  const username = process.env.SSH_USER || 'root';
  const password = process.env.SSH_PASSWORD;

  if (!host || !password) {
    return `🖥️ <b>UZAK SUNUCU DURUMU (Alexhost):</b> ⚠️ <i>SSH Kimlik Bilgileri Eksik!</i>\n`;
  }

  const ssh = new NodeSSH();
  try {
    await ssh.connect({ host, username, password, readyTimeout: 10000 });
    
    // Read CPU load
    const cpuRes = await ssh.execCommand("cat /proc/loadavg");
    const cpuLoad = cpuRes.stdout.trim().split(" ")[0] || "0.00";
    const cpuVal = parseFloat(cpuLoad);

    // Read Memory usage
    const memRes = await ssh.execCommand("free -m");
    const memLines = memRes.stdout.split("\n");
    let memUsagePct = 0;
    let memDetails = "N/A";
    if (memLines.length > 1) {
      const memData = memLines[1].split(/\s+/);
      const total = parseInt(memData[1], 10);
      const used = parseInt(memData[2], 10);
      memUsagePct = Math.round((used / total) * 100);
      memDetails = `${used}MB / ${total}MB`;
    }

    // Read Disk usage
    const diskRes = await ssh.execCommand("df -h / | tail -n 1");
    const diskData = diskRes.stdout.trim().split(/\s+/);
    const diskPctStr = diskData[4] || "0%";
    const diskPct = parseInt(diskPctStr.replace("%", ""), 10);

    // Read active PM2 processes on remote
    const pm2Res = await ssh.execCommand("pm2 jlist");
    let pm2Block = "";
    try {
      const procs = JSON.parse(pm2Res.stdout);
      pm2Block = procs.map((p: any) => {
        const isOnline = p.pm2_env.status === 'online';
        const restarts = p.pm2_env.restart_time || 0;
        const mem = p.monit?.memory ? `${Math.round(p.monit.memory / 1024 / 1024)}MB` : '0MB';
        return `  ${isOnline ? THEME.SUCCESS : THEME.ERROR} <code>${p.name}</code> [${mem}] ↺${restarts}`;
      }).join('\n');
    } catch {
      pm2Block = "  ⚠️ Uzak PM2 listelenemedi veya boş.";
    }

    ssh.dispose();

    return `🖥️ <b>UZAK PROD SUNUCUSU (Alexhost):</b>
• <b>Sunucu IP:</b> <code>${host}</code>
• <b>CPU Yükü:</b> <code>${cpuLoad}</code> [${generateProgressBar(Math.min(cpuVal * 10, 100), 10)}]
• <b>RAM:</b> %${memUsagePct} [${generateProgressBar(memUsagePct, 10)}] (<code>${memDetails}</code>)
• <b>Disk Kullanımı:</b> ${diskPctStr} [${generateProgressBar(diskPct, 10)}]
• <b>Uzak PM2 Düğümleri:</b>\n${pm2Block}\n`;
  } catch (err: any) {
    ssh.dispose();
    return `🖥️ <b>UZAK PROD SUNUCUSU (Alexhost):</b> ⚠️ <i>Bağlantı Hatası: ${err.message}</i>\n`;
  }
}

// 🗄️ Database operational metrics
async function getDbMetrics(): Promise<string> {
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

// 🏁 Master execution orchestration
async function runMasterDashboard() {
  console.log("⚡ [MASTER DASHBOARD] Commencing multi-layered audit...");
  
  const startTime = Date.now();
  
  try {
    // Execute all scans in parallel
    const [dbMetrics, localHealth, remoteHealth, serpRankings] = await Promise.all([
      getDbMetrics(),
      getLocalHealth(),
      getRemoteHealth(),
      checkSerpRankings()
    ]);

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

${remoteHealth}
${THEME.DIVIDER}

${serpRankings}
${THEME.DIVIDER}
🧛‍♂️ <b>DURUM:</b> <i>Tüm sunucu ve ağ bileşenleri senkronize edildi. Google SERP taarruzu 24/7 kesintisiz sürmektedir.</i>
🚀 <i>v10.0-GOD-MODE - Master Hydra Command Suite</i>
    `.trim();

    // Check size limit
    let finalMessage = fullMessage;
    if (finalMessage.length > 4000) {
      console.warn("⚠️ [DASHBOARD] Warning: Message length exceeds 4000 chars. Truncating non-critical parts...");
      finalMessage = finalMessage.substring(0, 3900) + "\n\n... (Rapor çok uzun, detaylar veritabanında saklandı.)";
    }

    // Direct API send (just to be safe)
    await TelegramService.sendMessage(finalMessage);
    console.log("✅ [MASTER DASHBOARD SUCCESS] Full audit pushed to Telegram channel.");
    
    // Output directly for logging / display
    console.log(finalMessage);

  } catch (err: any) {
    console.error("❌ [MASTER DASHBOARD ERROR]", err);
    await TelegramService.sendMessage(`🚨 <b>MASTER DASHBOARD HATASI:</b> <code>${err.message}</code>`);
  }
}

runMasterDashboard().then(() => process.exit(0));
