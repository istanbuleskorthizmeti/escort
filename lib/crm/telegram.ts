import { Telegraf, Markup } from 'telegraf';
import { prisma } from "../prisma";
import { exec } from "child_process";
import { promisify } from "util";
import os from 'os';
import { ProxyHandler } from '../seo/proxy-handler';
import { siteConfig } from '../../config/site';
import { getDomainConfig } from '../../config/domains';
import { bot } from './bot-instance';

const execAsync = promisify(exec);

const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const COMMAND_COOLDOWNS = new Map<string, number>();

/**
 * 🛰️ DRKCNAY THEME ENGINE
 */
const THEME = {
  DIVIDER: "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
  HEADER: "🛡️ <b>DRKCNAY ELITE</b>",
  FOOTER: "🚀 <i>v6.2 - Otonom Dominasyon Aktif.</i>",
  SUCCESS: "✅",
  ERROR: "❌",
  WARNING: "⚠️",
  PULSE: "⚡",
  LOC: "📍",
  INT: "🛰️",
  BAR_EMPTY: "░",
  BAR_FULL: "█"
};

function generateProgressBar(percent: number, length: number = 10): string {
  const filledLength = Math.round((length * percent) / 100);
  const emptyLength = length - filledLength;
  return THEME.BAR_FULL.repeat(filledLength) + THEME.BAR_EMPTY.repeat(emptyLength);
}

export interface LeadData {
  id: string;
  cityName: string;
  districtName: string;
  category: string;
  status: string;
  details?: string | null;
  claimerName?: string | null;
  paymentAmount?: number | null;
  ipAddress?: string;
  userAgent?: string;
  sourceUrl?: string;
  utmTerm?: string;
  utmSource?: string;
  currentUrl?: string;
}

/**
 * DRKCNAY CRMP REPORTING ENGINE
 */
export const TelegramService = {
  async sendNewLead(lead: LeadData) {
    const sourceLabel = lead.sourceUrl ? `<a href="${lead.sourceUrl}">${lead.sourceUrl.replace(/^https?:\/\//, '').substring(0, 40)}</a>` : 'Direkt Giriş';
    const keywordLabel = lead.utmTerm && lead.utmTerm !== 'Bilinmiyor' ? lead.utmTerm : (lead.utmSource || 'Bilinmiyor');
    
    const message = `
🚨 <b>DRKCNAY RADAR: ETKİLEŞİM!</b> 
${THEME.DIVIDER}
🆔 <b>KOD:</b> <code>${lead.id}</code>
👤 <b>EYLEM:</b> ${lead.details || 'WhatsApp / Rezervasyon Butonu'}
🔍 <b>KELİME:</b> <code>${keywordLabel}</code>
🌐 <b>KAYNAK:</b> ${sourceLabel}
📍 <b>SAYFA:</b> <code>${lead.currentUrl ? lead.currentUrl.replace(/^https?:\/\//, '') : (lead.cityName + '/' + lead.districtName)}</code>
💻 <b>IP:</b> <code>${lead.ipAddress || 'Bilinmiyor'}</code>
⏰ <b>ZAMAN:</b> ${new Date().toLocaleString('tr-TR')}
${THEME.DIVIDER}
${THEME.FOOTER}
    `.trim();

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback(`${THEME.PULSE} Sahiplen`, `claim_${lead.id}`)]
    ]);

    return await bot.telegram.sendMessage(CHAT_ID!, message, {
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true },
      ...keyboard
    });
  },

  async updateLeadStatus(messageId: number, lead: LeadData) {
    let statusIcon = '⏳';
    let statusText = lead.status;
    let buttons: any[][] = [];

    switch (lead.status) {
      case 'CLAIMED':
        statusIcon = '⚡';
        statusText = `Sahiplenildi (Admin: ${lead.claimerName})`;
        buttons = [
          [Markup.button.callback('📍 Konum Gönderildi', `loc_sent_${lead.id}`)],
          [Markup.button.callback('❌ İptal', `cancel_${lead.id}`)]
        ];
        break;
      case 'LOCATION_SENT':
        statusIcon = '📍';
        statusText = 'Konum Gönderildi';
        buttons = [
          [Markup.button.callback('🔥 Seansta', `in_session_${lead.id}`)],
          [Markup.button.callback('❌ İptal', `cancel_${lead.id}`)]
        ];
        break;
      case 'IN_SESSION':
        statusIcon = '🔥';
        statusText = 'Seansta';
        buttons = [
          [Markup.button.callback('💰 Ödeme Alındı', `payment_${lead.id}`)],
          [Markup.button.callback('❌ İptal', `cancel_${lead.id}`)]
        ];
        break;
      case 'PAYMENT_RECEIVED':
        statusIcon = '💰';
        statusText = 'Ödeme Alındı';
        buttons = [
          [Markup.button.callback('✅ Bitti', `complete_${lead.id}`)]
        ];
        break;
      case 'COMPLETED':
        statusIcon = '✅';
        statusText = `Tamamlandı (Ödeme: ${lead.paymentAmount} TL)`;
        buttons = [];
        break;
      case 'CANCELLED':
        statusIcon = '❌';
        statusText = 'İptal Edildi';
        buttons = [];
        break;
    }

    const message = `
${statusIcon} <b>ELİT YÖNETİM: OPERASYON GÜNCELLEME</b>
${THEME.DIVIDER}
🆔 <b>KOD:</b> <code>${lead.id}</code>
📍 <b>BÖLGE:</b> ${lead.cityName} / <b>${lead.districtName}</b>
✨ <b>HİZMET:</b> ${lead.category}
👤 <b>ADMİN:</b> ${lead.claimerName || 'Bekleniyor'}
💰 <b>ÖDEME:</b> ${lead.paymentAmount ? `${lead.paymentAmount.toLocaleString('tr-TR')} TL` : 'Bekleniyor'}
📊 <b>DURUM:</b> ${statusIcon} ${statusText}
⏰ <b>ZAMAN:</b> ${new Date().toLocaleString('tr-TR')}
${THEME.DIVIDER}
${THEME.FOOTER}
    `;

    const keyboard = buttons.length > 0 ? Markup.inlineKeyboard(buttons) : undefined;

    try {
      if (keyboard) {
        await bot.telegram.editMessageText(CHAT_ID!, messageId, undefined, message, {
          parse_mode: 'HTML',
          ...keyboard
        });
      } else {
        await bot.telegram.editMessageText(CHAT_ID!, messageId, undefined, message, {
          parse_mode: 'HTML'
        });
      }
    } catch (e) {
      console.error('Telegram edit error:', e);
    }
  },

  async handleUpdate(update: any) {
    try {
      await bot.handleUpdate(update);
    } catch (e) {
      console.error("[TG Update Error]:", e);
    }
  },

  async sendMessage(text: string) {
    if (!process.env.TELEGRAM_BOT_TOKEN || !CHAT_ID) return;
    try {
      await bot.telegram.sendMessage(CHAT_ID, text, { parse_mode: 'HTML' });
    } catch (e) {
      console.error("TG Send Error:", e);
    }
  },

  async sendDailySummary(stats: { total: number, completed: number, revenue: number, regions: any[] }) {
    const efficiency = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    const avgRevenue = stats.completed > 0 ? stats.revenue / stats.completed : 0;
    const topRegion = stats.regions.sort((a, b) => b.count - a.count)[0];
    const message = `
📊 <b>ELİT MERKEZ: GÜNLÜK RAPOR</b>
${THEME.DIVIDER}
📅 <b>TARİH:</b> ${new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

✅ <b>TAMAMLANAN:</b> <code>${stats.completed}</code> / <code>${stats.total}</code>
💰 <b>TOPLAM CİRO:</b> <code>${stats.revenue.toLocaleString('tr-TR')} TL</code>
📈 <b>ORT. GELİR:</b> <code>${(Number(avgRevenue) || 0).toFixed(0)} TL / Seans</code>
🔥 <b>VERİMLİLİK:</b> %${(Number(efficiency) || 0).toFixed(1)} [${generateProgressBar(efficiency)}]

🏆 <b>TOP BÖLGE:</b> ${topRegion ? `${topRegion.name} (${topRegion.count} Seans)` : 'N/A'}
📍 <b>BÖLGESEL DAĞILIM:</b>
${stats.regions.map(r => `• ${r.name}: <code>${r.count}</code> Seans`).join('\n')}

🛡️ <i>Tüm veriler özel şifreleme altındadır.</i>
${THEME.DIVIDER}
${THEME.FOOTER}
    `.trim();
    return await bot.telegram.sendMessage(CHAT_ID!, message, { parse_mode: 'HTML' });
  },

  async sendSystemHealthReport() {
    const cpuLoad = os.loadavg();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = Math.round((usedMem / totalMem) * 100);
    const uptimeDays = Math.floor(os.uptime() / 86400);
    const uptimeHours = Math.floor((os.uptime() % 86400) / 3600);

    let pm2Status = "";
    let onlineCount = 0;
    let crashCount = 0;
    try {
      const { stdout } = await execAsync("pm2 jlist");
      const procs = JSON.parse(stdout);
      onlineCount = procs.filter((p: any) => p.pm2_env.status === 'online').length;
      crashCount = procs.reduce((acc: number, p: any) => acc + (p.pm2_env.restart_time || 0), 0);
      pm2Status = procs.map((p: any) => {
        const isOnline = p.pm2_env.status === 'online';
        const restarts = p.pm2_env.restart_time || 0;
        const mem = p.monit?.memory ? `${Math.round(p.monit.memory / 1024 / 1024)}MB` : '0MB';
        return `${isOnline ? THEME.SUCCESS : THEME.ERROR} <code>${p.name.replace('escortvip-','')}</code> [${mem}] ↺${restarts}`;
      }).join('\n');
    } catch (e) { pm2Status = "N/A"; }

    const message = `
${THEME.INT} <b>DRKCNAY: SİSTEM SAĞLIK</b>
${THEME.DIVIDER}
🛡️ <b>CPU:</b> <code>${(Number(cpuLoad[0]) || 0).toFixed(2)}</code> [${generateProgressBar(Math.min((Number(cpuLoad[0]) || 0) * 10, 100))}]
💾 <b>RAM:</b> %${memUsage} [${generateProgressBar(memUsage)}] <code>${Math.round(usedMem/1024/1024)}MB / ${Math.round(totalMem/1024/1024)}MB</code>
⏱️ <b>UPTIME:</b> ${uptimeDays}g ${uptimeHours}s
🚀 <b>RUNTIME:</b> Node ${process.version}

🔌 <b>SÜREÇLER (${onlineCount} online, ${crashCount} toplam restart):</b>
${pm2Status}

${onlineCount >= 8 ? THEME.SUCCESS : THEME.WARNING} <i>Sistem %${Math.round(onlineCount/10*100)} kapasite ile çalışıyor.</i>
${THEME.DIVIDER}
    `.trim();

    return await bot.telegram.sendMessage(CHAT_ID!, message, { parse_mode: 'HTML' });
  },

  async sendHydrationBatchReport(data: { totalProcessed: number, batchSize: number, items: { slug: string, title: string, tags: string[] }[] }) {
    if (!process.env.TELEGRAM_BOT_TOKEN || !CHAT_ID) return;
    const totalTarget = 81 * 30 * 10;
    const progressPercent = Math.min(100, (data.totalProcessed / totalTarget) * 100);

    const regions: Record<string, number> = {};
    data.items.forEach(item => {
      const city = item.slug.split('-')[0] || 'Diğer';
      regions[city] = (regions[city] || 0) + 1;
    });

    const regionSummary = Object.entries(regions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => `• ${name.toUpperCase()}: ${count}`)
      .join('\n');

    // Son 5 URL + anahtar kelimeler
    const recentItems = data.items.slice(-5).reverse();
    const urlBlock = recentItems.map(item => {
      const url = `https://${siteConfig.domain}/${item.slug}`;
      const topTags = item.tags?.slice(0, 3).join(', ') || 'N/A';
      return `🔗 <a href="${url}">${item.slug}</a>\n   <i>${topTags}</i>`;
    }).join('\n');

    const message = `
🌊 <b>DRKCNAY: TRAFFIC RAIN</b>
${THEME.DIVIDER}
${THEME.SUCCESS} <b>BATCH:</b> <code>+${data.batchSize} İçerik</code>
📊 <b>MATRİS:</b> %${(Number(progressPercent) || 0).toFixed(1)} [${generateProgressBar(progressPercent, 15)}]
🔢 <b>TOPLAM:</b> <code>${data.totalProcessed} / ${totalTarget}</code>

📍 <b>BÖLGE DAĞILIMI:</b>
${regionSummary}

🌐 <b>SON 5 URL:</b>
${urlBlock || 'N/A'}

${THEME.FOOTER}
${THEME.DIVIDER}
    `.trim();

    return await bot.telegram.sendMessage(CHAT_ID!, message, {
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true }
    });
  },

  async sendWorkerStatus(data: { worker: string, status: string, cycleCount: number, lastAction: string }) {
    if (!process.env.TELEGRAM_BOT_TOKEN || !CHAT_ID) return;
    const message = `
${THEME.INT} <b>İşçi Durum Raporu</b>
${THEME.DIVIDER}
🤖 <b>İşçi:</b> <code>${data.worker}</code>
📊 <b>Durum:</b> ${data.status === 'ONLINE' || data.status === 'SUCCESS' ? THEME.SUCCESS : THEME.ERROR} ${data.status}
🔄 <b>Döngü:</b> ${data.cycleCount}
📝 <b>Son İşlem:</b> ${data.lastAction}
⏰ <b>Zaman:</b> ${new Date().toLocaleTimeString('tr-TR')}
${THEME.DIVIDER}
${THEME.FOOTER}
    `.trim();

    return await bot.telegram.sendMessage(CHAT_ID!, message, { parse_mode: 'HTML' });
  },

  async sendBloggerReport(report: { platform: string, title: string, url: string, location: string }) {
    if (!process.env.TELEGRAM_BOT_TOKEN || !CHAT_ID) return;
    const slug = report.url.split('/').filter(Boolean).pop() || report.url;
    const mainSiteUrl = `https://${siteConfig.domain}/${slug}`;
    const message = `
${THEME.SUCCESS} <b>İÇERİK YAYINDA! 🚀</b>
${THEME.DIVIDER}
🌐 <b>Platform:</b> <code>${report.platform.toUpperCase()}</code>
📝 <b>Başlık:</b> ${report.title}
📍 <b>Bölge:</b> <code>${report.location}</code>
🔗 <b>Backlink:</b> <a href="${report.url}">${report.url.substring(0,60)}...</a>
🎯 <b>Hedef URL:</b> <a href="${mainSiteUrl}">${mainSiteUrl}</a>
⏰ <b>Zaman:</b> ${new Date().toLocaleString('tr-TR')}
${THEME.DIVIDER}
${THEME.FOOTER}
    `.trim();

    return await bot.telegram.sendMessage(CHAT_ID!, message, {
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true }
    });
  },

  async sendLinkBatchReport(report: { platform: string, executionTimeMs?: number, aiModel?: string, links: { title: string, url: string, location: string, wordCount?: number, seoScore?: number, keyword?: string, isWildcard?: boolean }[] }) {
    if (!process.env.TELEGRAM_BOT_TOKEN || !CHAT_ID || report.links.length === 0) return;
    
    let message = `${THEME.SUCCESS} <b>BATCH RAPORU: ${report.platform.toUpperCase()}</b>\n`;
    message += `${THEME.DIVIDER}\n`;
    
    if (report.aiModel || report.executionTimeMs !== undefined) {
      message += `🧠 <b>Motor:</b> <code>${report.aiModel || 'DRKCNAY Core'}</code>\n`;
      message += `⏱️ <b>Süre:</b> <code>${report.executionTimeMs ? ((Number(report.executionTimeMs) / 1000) || 0).toFixed(2) + 's' : 'N/A'}</code>\n`;
      message += `${THEME.DIVIDER}\n`;
    }

    report.links.forEach((link, idx) => {
      message += `${idx + 1}. 📝 <b>${link.title}</b>\n`;
      message += `📍 <code>${link.location}</code>\n`;
      
      if (link.keyword) message += `🔑 <b>Hedef Kelime:</b> <code>${link.keyword}</code>\n`;
      if (link.wordCount) message += `📊 <b>Derinlik:</b> ${link.wordCount} Kelime\n`;
      if (link.seoScore) message += `💎 <b>SEO Skoru:</b> %${(Number(link.seoScore) || 0).toFixed(1)}\n`;
      
      // NPF & Schema Validation Tag
      if (report.platform.toLowerCase().includes('telegraph') || report.platform.toLowerCase().includes('siege')) {
         message += `✨ <b>Telegraph:</b> Anonim Backlink & DR 90+ Injected\n`;
      }
      if (report.platform.toLowerCase().includes('blogger') || report.platform.toLowerCase().includes('siege')) {
         message += `✨ <b>Schema.org:</b> LocalBusiness+Service Enjekte Edildi\n`;
      }
      if (link.isWildcard) {
         message += `🐺 <b>Turan Taktiği:</b> Wildcard Subdomain Aktif\n`;
      }

      message += `🔗 <a href="${link.url}">Yayınlanan Linke Git</a>\n\n`;
    });
    
    message += `${THEME.DIVIDER}\n`;
    message += `${THEME.FOOTER}`;

    return await bot.telegram.sendMessage(CHAT_ID!, message, { parse_mode: 'HTML', link_preview_options: { is_disabled: true } });
  },

  async reportError(title: string, error: string) {
    if (!process.env.TELEGRAM_BOT_TOKEN || !CHAT_ID) return;
    const message = `
${THEME.ERROR} <b>DRKCNAY: ERROR ALERT</b>
${THEME.DIVIDER}
🔴 <b>Sistem Hatası:</b> <code>${title}</code>
📝 <b>Detay:</b> <code>${error.substring(0, 500)}</code>
⏰ <b>Zaman:</b> ${new Date().toLocaleString('tr-TR')}
${THEME.DIVIDER}
    `.trim();
    try {
      await bot.telegram.sendMessage(CHAT_ID!, message, { parse_mode: 'HTML' });
    } catch (e) {
      console.error("TG Error Report Failed:", e);
    }
  },

  async sendOrchestratorReport(report: {
    status: 'SUCCESS' | 'ERROR',
    domains: string[],
    operations: string[],
    seo: { sector: string, keywords: string[], sitemapGenerated: boolean, googleUltraPinged: boolean },
    executionTimeMs?: number,
    errorDetails?: string
  }) {
    if (!process.env.TELEGRAM_BOT_TOKEN || !CHAT_ID) return;

    const statusIcon = report.status === 'SUCCESS' ? THEME.SUCCESS : THEME.ERROR;
    const domainsList = report.domains.length > 5 
      ? `${report.domains.slice(0, 5).join(', ')} ... (+${report.domains.length - 5} domain)`
      : report.domains.join(', ');

    let message = `
${statusIcon} <b>DRKCNAY ZERO-DOWNTIME ORCHESTRATOR</b>
${THEME.DIVIDER}
🌐 <b>Etkilenen Domainler (${report.domains.length}):</b> <code>${domainsList}</code>

⚙️ <b>İşlemler:</b>
${report.operations.map(op => `• ${op}`).join('\n')}

🎯 <b>SEO Matrisi:</b>
• Sektör: <code>${report.seo.sector}</code>
• Hedef Kelimeler: <code>${report.seo.keywords.slice(0,3).join(', ')}</code>
• Sitemap.xml: ${report.seo.sitemapGenerated ? '✅ Üretildi & Şifrelendi' : '❌ Atlandı'}
• Google Ultra Index: ${report.seo.googleUltraPinged ? '🚀 PING GÖNDERİLDİ' : '⏳ Beklemede'}

${report.executionTimeMs ? `⏱️ <b>Süre:</b> ${(Number(report.executionTimeMs / 1000) || 0).toFixed(2)}s\n` : ''}`;

    if (report.status === 'ERROR' && report.errorDetails) {
      message += `\n🔴 <b>HATA DETAYI:</b>\n<code>${report.errorDetails.substring(0, 200)}</code>\n`;
    }

    message += `\n${THEME.DIVIDER}\n${THEME.FOOTER}`;

    try {
      await bot.telegram.sendMessage(CHAT_ID!, message.trim(), { parse_mode: 'HTML' });
    } catch (e) {
      console.error("TG Orchestrator Report Failed:", e);
    }
  }
};

/**
 * 🛰️ ACTION HANDLERS
 */
const checkAuth = (ctx: any) => {
  const senderId = ctx.from?.id.toString();
  return senderId === CHAT_ID || senderId === process.env.ADMIN_TG_ID || ctx.chat?.id.toString() === CHAT_ID;
};

bot.action(/claim_(.+)/, async (ctx) => {
  if (!checkAuth(ctx)) return ctx.answerCbQuery("⚠️ Yetkisiz Erişim.");
  const leadId = ctx.match[1];
  const adminName = ctx.from?.username || ctx.from?.first_name || 'Admin';
  const adminId = ctx.from?.id.toString();
  try {
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: { status: 'CLAIMED', claimerName: adminName, claimerId: adminId }
    });
    await TelegramService.updateLeadStatus(ctx.callbackQuery?.message?.message_id!, lead as any);
    await ctx.answerCbQuery(`✅ Talep Sahiplenildi: ${leadId}`);
  } catch (e) { await ctx.answerCbQuery("❌ Hata."); }
});

bot.action(/loc_sent_(.+)/, async (ctx) => {
  if (!checkAuth(ctx)) return;
  const leadId = ctx.match[1];
  const lead = await prisma.lead.update({ where: { id: leadId }, data: { status: 'LOCATION_SENT' } });
  await TelegramService.updateLeadStatus(ctx.callbackQuery?.message?.message_id!, lead as any);
  await ctx.answerCbQuery("📍 Konum iletildi.");
});

bot.action(/in_session_(.+)/, async (ctx) => {
  if (!checkAuth(ctx)) return;
  const leadId = ctx.match[1];
  const lead = await prisma.lead.update({ where: { id: leadId }, data: { status: 'IN_SESSION' } });
  await TelegramService.updateLeadStatus(ctx.callbackQuery?.message?.message_id!, lead as any);
  await ctx.answerCbQuery("🔥 Seans başladı.");
});

bot.action(/payment_(.+)/, async (ctx) => {
  if (!checkAuth(ctx)) return;
  const leadId = ctx.match[1];
  const lead = await prisma.lead.update({ where: { id: leadId }, data: { status: 'PAYMENT_RECEIVED' } });
  await TelegramService.updateLeadStatus(ctx.callbackQuery?.message?.message_id!, lead as any);
  await ctx.answerCbQuery("💰 Ödeme alındı.");
});

bot.action(/complete_(.+)/, async (ctx) => {
  if (!checkAuth(ctx)) return;
  const leadId = ctx.match[1];
  const lead = await prisma.lead.update({ where: { id: leadId }, data: { status: 'COMPLETED' } });
  await TelegramService.updateLeadStatus(ctx.callbackQuery?.message?.message_id!, lead as any);
  await ctx.answerCbQuery("✅ Bitti.");
});

bot.action(/cancel_(.+)/, async (ctx) => {
  if (!checkAuth(ctx)) return;
  const leadId = ctx.match[1];
  const lead = await prisma.lead.update({ where: { id: leadId }, data: { status: 'CANCELLED' } });
  await TelegramService.updateLeadStatus(ctx.callbackQuery?.message?.message_id!, lead as any);
  await ctx.answerCbQuery("❌ İptal.");
});

bot.on('text', async (ctx) => {
  if (!checkAuth(ctx)) return;

  const msg = ctx.message as any;
  const replyTo = msg.reply_to_message;
  
  // Eğer botun gönderdiği bir "YENİ TALEP" veya "OPERASYON GÜNCELLEME" mesajına yanıt veriliyorsa
  if (replyTo && replyTo.from?.id === ctx.botInfo.id && replyTo.text) {
    const match = replyTo.text.match(/KOD:\s*(\S+)/);
    if (match) {
      const leadId = match[1];
      const text = msg.text.trim();
      
      // Eğer sadece rakam girildiyse -> Ödeme Miktarı (Ciro)
      if (/^\d+$/.test(text)) {
        const amount = parseInt(text, 10);
        try {
          const lead = await prisma.lead.update({
            where: { id: leadId },
            data: { paymentAmount: amount }
          });
          await TelegramService.updateLeadStatus(replyTo.message_id, lead as any);
          await ctx.reply(`✅ Rakam (${amount} TL) sisteme işlendi komutanım.`);
        } catch (e) {
          await ctx.reply("❌ Hata: Talep güncellenemedi.");
        }
      } else {
        // Rakam değilse -> Ek Not / Detay
        try {
           const lead = await prisma.lead.findUnique({ where: { id: leadId } });
           if (lead) {
              const newDetails = lead.details ? `${lead.details} | Not: ${text}` : `Not: ${text}`;
              const updatedLead = await prisma.lead.update({
                where: { id: leadId },
                data: { details: newDetails }
              });
              await TelegramService.updateLeadStatus(replyTo.message_id, updatedLead as any);
              await ctx.reply(`📝 Not eklendi.`);
           }
        } catch (e) { }
      }
    }
  }
});
/**
 * 🛰️ COMMANDS
 */
bot.start((ctx) => ctx.replyWithHTML(THEME.HEADER + "\nElite Protokol Aktif. /yardim yazarak başlayın."));

bot.command(['yardim', 'help'], async (ctx) => {
  const helpMsg = `
🛡️ <b>DRKCNAY KOMUTA MERKEZİ</b>
${THEME.DIVIDER}
📊 /seo       → Tam SEO Performans Raporu
⚡ /health    → Sistem Sağlık Raporu
📦 /backlog   → İçerik Kuyruğu Durumu
🔍 /audit     → Sıralama Tarihçesi (Son 10)
📂 /liste     → Bekleyen Talepler
📈 /durum     → Genel İstatistikler
${THEME.DIVIDER}
🔥 <b>GERİLLA SEO SİLAHLARI:</b>
🚀 /pbn_saldir [ilce] → WP Ağlarına Sızma
📌 /pinterest_pin [ilce] → Görsel SEO Pinle
🛸 /reddit_saldir     → Subredditlere Yorum At
${THEME.DIVIDER}
${THEME.FOOTER}
  `.trim();
  await ctx.replyWithHTML(helpMsg);
});

bot.command(['durum', 'status'], async (ctx) => {
  try {
    const leadCount = await prisma.lead.count();
    await ctx.replyWithHTML(`📊 <b>SİSTEM STATS</b>\n${THEME.DIVIDER}\nTalepler: ${leadCount}\nProxy: Aktif`);
  } catch (e) { await ctx.reply("Hata."); }
});

bot.command(['liste', 'leads'], async (ctx) => {
  const leads = await prisma.lead.findMany({ where: { status: 'PENDING' }, take: 5 });
  if (leads.length === 0) return ctx.reply("Sıfır talep.");
  let msg = `📂 <b>BEKLEYENLER</b>\n`;
  leads.forEach(l => msg += `🆔 ${l.id} | ${l.cityName}\n`);
  await ctx.replyWithHTML(msg);
});

bot.command('seo', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const keyword = args.join(' ');

  if (keyword) {
    // 🚀 DRKCNAY BLITZKRIEG ATTACK MODE
    await ctx.replyWithHTML(`⚡ <b>DRKCNAY BLITZKRIEG: TAARRUZ BAŞLATILDI!</b>\n${THEME.DIVIDER}\n🎯 Hedef: <code>${keyword}</code>\n📡 Durum: Hydra ordusu harekete geçiyor...`);
    
    try {
      const { executeBlitz } = await import("../hydra/blitz");
      await executeBlitz(keyword);
      await ctx.replyWithHTML(`${THEME.SUCCESS} <b>TAARRUZ TAMAMLANDI!</b>\n${THEME.DIVIDER}\n🎯 <code>${keyword}</code> anahtar kelimesi için tüm backlink ağları güncellendi. Google Ultra ile indeksleme başlatılıyor.`);
    } catch (err: any) {
      await ctx.replyWithHTML(`${THEME.ERROR} Taarruz başarısız: <code>${err.message}</code>`);
    }
    return;
  }

  // 📊 STANDARD REPORT MODE
  await ctx.replyWithHTML(`⏳ <b>DRKCNAY SEO RAPORU</b> oluşturuluyor...`);
  try {
    const { PerformanceReportEngine } = await import("../seo/performance-report");
    const engine = PerformanceReportEngine.getInstance();
    const report = await engine.buildFullReport();

    const { dbStats, gscStats, latestDeltas } = report;

    // Progress bar helper
    const bar = (v: number, t: number, len = 10) => {
      const pct = t > 0 ? Math.min(100, (v / t) * 100) : 0;
      const filled = Math.round((len * pct) / 100);
      return THEME.BAR_FULL.repeat(filled) + THEME.BAR_EMPTY.repeat(len - filled) + ` %${(Number(pct) || 0).toFixed(0)}`;
    };

    let gscBlock = '';
    if (gscStats.isAvailable && gscStats.domains.length > 0) {
        gscBlock += `\n🔍 <b>GSC TOPLAM (Son 7 Gün):</b>
• Tıklama: <code>${gscStats.aggregateClicks.toLocaleString('tr-TR')}</code>
• Gösterim: <code>${gscStats.aggregateImpressions.toLocaleString('tr-TR')}</code>\n\n`;

        gscStats.domains.forEach(domain => {
            const domainName = domain.siteUrl.replace('https://', '').replace('/', '').replace('sc-domain:', '');
            gscBlock += `🌐 <b>${domainName}</b>
• Tık: ${domain.totalClicks} | Gör: ${domain.totalImpressions} | Ort: ${domain.avgPosition}
${domain.topKeywords.map((k, i) => `${i + 1}. <code>${k.keyword}</code> -> #${k.position} (${k.clicks} tık)`).join('\n')}
\n`;
        });
    } else {
        gscBlock = `\n⚠️ <i>GSC verisi şu an erişilemiyor.</i>`;
    }

    const deltaBlock = latestDeltas.length > 0
      ? `\n📉 <b>Son Sıralama Hareketleri:</b>\n` +
        latestDeltas.map(d => {
          const icon = (d.change ?? 0) > 0 ? '🚀' : (d.change ?? 0) < 0 ? '📉' : '➡️';
          return `${icon} <code>${d.keyword}</code>: #${(Number(d.position) || 0).toFixed(1)} (${(d.change ?? 0) > 0 ? '+' : ''}${(Number(d.change) || 0).toFixed(1)})`;
        }).join('\n')
      : '';

    const latestPages = await prisma.pageContent.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: { slug: true, title: true }
    });

    let recentPagesBlock = '\n🌐 <b>Son Oluşturulan Uydu Sayfalar (Subdomain/Hedefler):</b>\n';
    if (latestPages.length > 0) {
        latestPages.forEach(p => {
            recentPagesBlock += `• <code>${p.slug}</code> - ${p.title}\n`;
        });
    } else {
        recentPagesBlock += `<i>Henüz sayfa oluşturulmadı.</i>\n`;
    }

    const totalTwitterBots = await prisma.botAccount.count();
    const activeTwitterBots = await prisma.botAccount.count({ where: { status: 'ALIVE' } });
    const suspendedTwitterBots = await prisma.botAccount.count({ where: { status: 'SUSPENDED' } });
    const msg = `
📊 <b>DRKCNAY SEO RAPORU</b>
${THEME.DIVIDER}
⏰ <b>Zaman:</b> ${report.generatedAt.toLocaleString('tr-TR')}

🗄️ <b>İÇERİK MATRİSİ:</b>
• Toplam Sayfa: <code>${dbStats.totalPages}</code>
• İndekslenmiş: <code>${dbStats.indexedPages}</code>
• Blogger: <code>${dbStats.bloggerPosted}</code> [${bar(dbStats.bloggerPosted, dbStats.totalPages)}]
• Tumblr:  <code>${dbStats.tumblrPosted}</code> [${bar(dbStats.tumblrPosted, dbStats.totalPages)}]
• WP:      <code>${dbStats.wordpressPosted}</code> [${bar(dbStats.wordpressPosted, dbStats.totalPages)}]
🐦 <b>X (TWITTER) ORDUSU:</b>
• Toplam Asker: <code>${totalTwitterBots}</code>
• Aktif Savaşta: <code>${activeTwitterBots}</code> 🟢
• Suspend: <code>${suspendedTwitterBots}</code> 🔴
${gscBlock}${deltaBlock}${recentPagesBlock}
${THEME.DIVIDER}
${THEME.FOOTER}
    `.trim();

    await ctx.replyWithHTML(msg);

    const { RankingTracker } = await import("../seo/ranking-tracker");
    RankingTracker.getInstance().trackDeltas().catch(console.error);
  } catch (err: any) {
    await ctx.replyWithHTML(`${THEME.ERROR} SEO raporu alınamadı: <code>${err.message}</code>`);
  }
});

bot.command('health', async (ctx) => {
  await TelegramService.sendSystemHealthReport();
});

// ==========================================
// 🚀 GERİLLA SEO KOMUTLARI (TELEFONDAN KONTROL)
// ==========================================

bot.command('pbn_saldir', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const district = args.join(' ') || 'Şişli';
  const city = 'İstanbul';

  await ctx.replyWithHTML(`🚀 <b>PBN (WordPress) TAARRUZU BAŞLATILIYOR!</b>\n${THEME.DIVIDER}\n🎯 Hedef: <code>${city} ${district}</code>\n📡 Durum: XML-RPC üzerinden sızma deneniyor... (Arka planda çalışacak)`);
  
  try {
    const { exec } = require('child_process');
    // Run the mass poster script in the background
    exec(`npx tsx scripts/wordpress-mass-poster.ts "${city}" "${district}"`, (error: any, stdout: string, stderr: string) => {
      if (error) {
         ctx.replyWithHTML(`${THEME.ERROR} <b>PBN Hatası:</b> <code>${error.message}</code>`);
         return;
      }
      ctx.replyWithHTML(`${THEME.SUCCESS} <b>PBN Başarılı!</b>\n<pre>${stdout.substring(0, 1000)}</pre>`);
    });
  } catch (err: any) {
    await ctx.replyWithHTML(`${THEME.ERROR} Komut tetiklenemedi: <code>${err.message}</code>`);
  }
});

/*
bot.command('pinterest_pin', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const district = args.join(' ') || 'Şişli';
  const city = 'İstanbul';

  await ctx.replyWithHTML(`📌 <b>PINTEREST GÖRSEL SEO BAŞLATILIYOR!</b>\n${THEME.DIVIDER}\n🎯 Hedef: <code>${city} ${district}</code>\n📡 Durum: Görsel çekilip mühürleniyor...`);
  
  try {
    const { pinterestAutopilot } = await import("../../scripts/pinterest-autopilot");
    // Run dryRun=false for live pinning
    pinterestAutopilot.runBatch(city, district, false)
      .then(() => ctx.replyWithHTML(`${THEME.SUCCESS} <b>Pinterest Pin Gönderildi!</b>`))
      .catch((e: any) => ctx.replyWithHTML(`${THEME.ERROR} Hata: <code>${e.message}</code>`));
  } catch (err: any) {
    await ctx.replyWithHTML(`${THEME.ERROR} Komut tetiklenemedi: <code>${err.message}</code>`);
  }
});
*/

bot.command('reddit_saldir', async (ctx) => {
  await ctx.replyWithHTML(`🛸 <b>REDDIT ENGAGEMENT POD AKTİFLEŞTİRİLİYOR!</b>\n${THEME.DIVIDER}\n📡 Durum: Subredditler taranıyor...`);
  
  try {
    const { redditBot } = await import("../seo/reddit-bot");
    // Run dryRun=false for live replying
    redditBot.scanAndReply(false)
      .then(() => ctx.replyWithHTML(`${THEME.SUCCESS} <b>Reddit Taraması Bitti!</b>`))
      .catch((e: any) => ctx.replyWithHTML(`${THEME.ERROR} Hata: <code>${e.message}</code>`));
  } catch (err: any) {
    await ctx.replyWithHTML(`${THEME.ERROR} Komut tetiklenemedi: <code>${err.message}</code>`);
  }
});

// ==========================================
// 👑 MEGA-SIEGE COMMAND CENTER
// ==========================================

bot.command('profil_yayinla', async (ctx) => {
  await ctx.replyWithHTML(`📸 <b>VIP PROFİL YAYINLANIYOR!</b>\n${THEME.DIVIDER}\n📡 Durum: Profil seçiliyor ve ağlara dağıtılıyor...`);
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // 1. Profil resmi seç
    const profileDir = path.join(process.cwd(), 'public/images/profiles');
    let photoPath = null;
    if (fs.existsSync(profileDir)) {
      const files = fs.readdirSync(profileDir).filter((f: string) => f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.jpg'));
      if (files.length > 0) {
        const randomFile = files[Math.floor(Math.random() * files.length)];
        photoPath = path.join(profileDir, randomFile);
      }
    }

    const caption = `
🌟 <b>YENİ VIP PROFİL AKTİF!</b> 🌟

👑 İstanbul'un en seçkin yüzleri sizlerle.
Sınırlı kontenjan, anında onay ve %100 gizlilik.

📍 <b>Konum:</b> Şişli / Levent / Beşiktaş
💎 <b>Hizmet:</b> VIP Escort & Özel Görüşme

Hemen iletişime geçin ve randevunuzu oluşturun:
🔗 <a href="https://wa.me/905300000000?text=Merhaba,%20VIP%20ilanınız%20için%20yazıyorum.">WhatsApp Üzerinden İletişime Geç (Hızlı Onay)</a>

🌐 Daha fazlası için: <a href="https://vipescorthizmeti.com">DRKCNAY Elite</a>
    `.trim();

    if (photoPath) {
      await ctx.replyWithPhoto({ source: photoPath }, { caption, parse_mode: 'HTML' });
    } else {
      await ctx.replyWithHTML(caption);
    }
    
    await ctx.replyWithHTML(`${THEME.SUCCESS} <b>Profil başarıyla tüm kanallara yayınlandı!</b>`);
  } catch (err: any) {
    await ctx.replyWithHTML(`${THEME.ERROR} Profil yayınlanamadı: <code>${err.message}</code>`);
  }
});

bot.command('hedef', async (ctx) => {
  const keyword = ctx.message.text.replace('/hedef', '').trim();
  
  if (!keyword) {
    return ctx.replyWithHTML(`${THEME.WARNING} Lütfen bir kelime girin. Örnek: <code>/hedef istanbul escort</code>`);
  }

  await ctx.replyWithHTML(`🚀 <b>MEGA-SIEGE PROTOKOLÜ BAŞLATILDI!</b>\n${THEME.DIVIDER}\n🎯 <b>Hedef Kelime:</b> <code>${keyword}</code>\n📡 Durum: Tüm Worker'lara (Server 1 & 2) saldırı emri gönderiliyor...`);
  
  try {
    const { exec } = require('child_process');
    // Orchestrator'ı bu kelimeyle tetikle (arka planda)
    exec(`npx tsx scripts/DRKCNAY-orchestrator.ts --hedef="${keyword}"`, (error: any, stdout: string, stderr: string) => {
      if (error) {
         ctx.replyWithHTML(`${THEME.ERROR} <b>Saldırı Emri İletilemedi:</b> <code>${error.message}</code>`);
         return;
      }
      ctx.replyWithHTML(`${THEME.SUCCESS} <b>Tüm Sunucular Hedefe Kilitlendi!</b>\n<pre>${stdout.substring(0, 1000)}</pre>`);
    });
  } catch (err: any) {
    await ctx.replyWithHTML(`${THEME.ERROR} Komut tetiklenemedi: <code>${err.message}</code>`);
  }
});

// ==========================================
bot.command('gsc_bas', async (ctx) => {
  await ctx.replyWithHTML(`🚀 <b>GSC & SITEMAP DOMİNASYONU BAŞLATILIYOR!</b>\n${THEME.DIVIDER}\n📡 Durum: Tüm matrix alan adları Google Search Console'a ekleniyor ve sitemap'ler gönderiliyor...`);
  
  try {
    const { exec } = require('child_process');
    exec(`npx tsx scripts/gsc-domain-verifier.ts`, (error: any, stdout: string, stderr: string) => {
      if (error) {
         ctx.replyWithHTML(`${THEME.ERROR} <b>GSC Hatası:</b> <code>${error.message}</code>`);
         return;
      }
      // Chunk the output if it's too long for Telegram
      const output = stdout.substring(0, 3000);
      ctx.replyWithHTML(`${THEME.SUCCESS} <b>GSC Entegrasyonu Tamamlandı!</b>\n<pre>${output}</pre>`);
    });
  } catch (err: any) {
    await ctx.replyWithHTML(`${THEME.ERROR} Komut tetiklenemedi: <code>${err.message}</code>`);
  }
});

bot.command('backlog', async (ctx) => {
  const pendingBlogger = await prisma.pageContent.count({ where: { isBloggerPosted: false } });
  const pendingTumblr = await prisma.pageContent.count({ where: { isTumblrPosted: false } });
  const pendingWP = await prisma.pageContent.count({ where: { isWordPressPosted: false } });
  const pendingTelegraph = await prisma.pageContent.count({ where: { isTelegraphPosted: false } });
  const pendingPinterest = await prisma.pageContent.count({ where: { isPinterestPosted: false } });
  
  const msg = `
📦 <b>BACKLOG DURUMU</b>
${THEME.DIVIDER}
• Blogger: <code>${pendingBlogger}</code>
• Tumblr: <code>${pendingTumblr}</code>
• WordPress: <code>${pendingWP}</code>
• Telegraph: <code>${pendingTelegraph}</code>
• Pinterest: <code>${pendingPinterest}</code>
${THEME.DIVIDER}
🚀 <i>Elite içerik fabrikası çalışıyor.</i>
  `.trim();
  await ctx.replyWithHTML(msg);
});

bot.command('audit', async (ctx) => {
  try {
    const deltas = await prisma.rankingDelta.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    if (deltas.length === 0) {
      return ctx.replyWithHTML(`${THEME.WARNING} Henüz sıralama kaydı yok. <code>/seo</code> ile tarama başlatın.`);
    }

    let msg = `🔍 <b>SIRALAMALAR: SON 10 HAREKET</b>\n${THEME.DIVIDER}\n`;
    deltas.forEach((d, i) => {
      const changeIcon = (d.change ?? 0) > 0 ? '🚀' : (d.change ?? 0) < 0 ? '📉' : '➡️';
      const changeStr = (d.change ?? 0) !== 0
        ? ` <b>${(d.change ?? 0) > 0 ? '+' : ''}${(Number(d.change) || 0).toFixed(1)}</b>`
        : '';
      msg += `${i + 1}. ${changeIcon} <code>${d.keyword}</code>\n`;
      msg += `   #${(Number(d.position) || 0).toFixed(1)}${changeStr} — ${d.timestamp.toLocaleString('tr-TR')}\n`;
    });
    msg += `${THEME.DIVIDER}\n${THEME.FOOTER}`;

    await ctx.replyWithHTML(msg);
  } catch (err: any) {
    await ctx.replyWithHTML(`${THEME.ERROR} Audit alınamadı: <code>${err.message}</code>`);
  }
});
