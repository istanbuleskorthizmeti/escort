
import { prisma } from "../lib/prisma";
import { TelegramService } from "../lib/crm/telegram";
import { PerformanceReportEngine } from "../lib/seo/performance-report";
import dotenv from "dotenv";

dotenv.config();

const THEME = {
    DIVIDER: "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
    SUCCESS: "✅",
    INT: "🛰️",
    PULSE: "⚡",
    BAR_FULL: "█",
    BAR_EMPTY: "░"
};

function generateProgressBar(percent: number, length: number = 10): string {
    const filledLength = Math.round((length * Math.min(100, percent)) / 100);
    const emptyLength = length - filledLength;
    return THEME.BAR_FULL.repeat(filledLength) + THEME.BAR_EMPTY.repeat(emptyLength);
}

async function runBacklinkReport() {
    console.log("🏴‍☠️ [HYDRA-BACKLINK] Aggregating intelligence...");

    try {
        const engine = PerformanceReportEngine.getInstance();
        const report = await engine.buildFullReport();
        const { dbStats } = report;

        // Fetch latest live backlinks
        const latestLinks = await prisma.pageContent.findMany({
            where: {
                OR: [
                    { isBloggerPosted: true },
                    { isTelegraphPosted: true },
                    { isTumblrPosted: true },
                    { isWordPressPosted: true }
                ]
            },
            orderBy: { updatedAt: 'desc' },
            take: 15,
            select: {
                slug: true,
                bloggerPostUrl: true,
                telegraphPostUrl: true,
                tumblrPostUrl: true,
                wordPressPostUrl: true,
                updatedAt: true
            }
        });

        // Fetch high authority assets
        const authorityAssets = await prisma.authorityAsset.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        const totalBacklinks = dbStats.bloggerPosted + dbStats.telegraphPosted + dbStats.tumblrPosted + dbStats.wordpressPosted;
        
        let msg = `
🏴‍☠️ <b>HYDRA BACKLINK TAARRUZ RAPORU</b>
${THEME.DIVIDER}
🚀 <b>Strateji:</b> Multi-Platform Parasite SEO
📊 <b>Toplam Backlink:</b> <code>${totalBacklinks}</code>
⚡ <b>Otorite Gücü:</b> DR 90+ Injected
${THEME.DIVIDER}

📈 <b>PLATFORM DAĞILIMI:</b>
• Blogger: <code>${dbStats.bloggerPosted}</code> [${generateProgressBar((dbStats.bloggerPosted / dbStats.totalPages) * 100)}]
• Telegraph: <code>${dbStats.telegraphPosted}</code> [${generateProgressBar((dbStats.telegraphPosted / dbStats.totalPages) * 100)}]
• WordPress: <code>${dbStats.wordpressPosted}</code> [${generateProgressBar((dbStats.wordpressPosted / dbStats.totalPages) * 100)}]
• Tumblr: <code>${dbStats.tumblrPosted}</code> [${generateProgressBar((dbStats.tumblrPosted / dbStats.totalPages) * 100)}]

💎 <b>VIP OTORİTE VARLIKLARI:</b>
${authorityAssets.length > 0 ? authorityAssets.map(a => `• <a href="${a.url}">${a.title || 'Elite Asset'}</a> [DR ${a.dr}]`).join('\n') : '<i>Veri bekleniyor...</i>'}

🔗 <b>SON YAYINLANAN LİNKLER:</b>
${latestLinks.map(l => {
    const liveUrl = l.telegraphPostUrl || l.bloggerPostUrl || l.tumblrPostUrl || l.wordPressPostUrl;
    const platform = l.telegraphPostUrl ? 'TG' : l.bloggerPostUrl ? 'BL' : l.tumblrPostUrl ? 'TM' : 'WP';
    return `• [${platform}] <a href="${liveUrl}">${l.slug}</a>`;
}).join('\n')}

${THEME.DIVIDER}
🧛‍♂️ <b>DURUM:</b> <i>Backlink bombası saniyede 1 link hızıyla devam ediyor. Tüm ağlar Bitly ile mühürlendi.</i>
🚀 <i>v6.2 - Hydra Dominance Engine</i>
`.trim();

        await TelegramService.sendMessage(msg);
        console.log("✅ [SUCCESS] Backlink report sent to Telegram.");

    } catch (err: any) {
        console.error("❌ [REPORT-ERROR]", err.message);
        await TelegramService.sendMessage(`❌ <b>BACKLINK RAPOR HATASI:</b> ${err.message}`);
    }
}

runBacklinkReport();
