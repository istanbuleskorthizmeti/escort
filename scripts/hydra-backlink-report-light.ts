
import { prisma } from "../lib/prisma";
import { TelegramService } from "../lib/crm/telegram";
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

async function runLightweightBacklinkReport() {
    console.log("🏴‍☠️ [HYDRA-BACKLINK-LIGHT] Rapid Aggregation...");

    try {
        // Fetch stats directly from DB to be ultra-fast
        const [
            totalPages,
            bloggerPosted,
            tumblrPosted,
            wordpressPosted,
            telegraphPosted,
            githubPosted,
            gistPosted,
            indexedPages,
        ] = await Promise.all([
            prisma.pageContent.count(),
            prisma.pageContent.count({ where: { isBloggerPosted: true } }),
            prisma.pageContent.count({ where: { isTumblrPosted: true } }),
            prisma.pageContent.count({ where: { isWordPressPosted: true } }),
            prisma.pageContent.count({ where: { isTelegraphPosted: true } }),
            prisma.pageContent.count({ where: { isGitHubPosted: true } }),
            prisma.pageContent.count({ where: { isGistPosted: true } }),
            prisma.pageContent.count({ where: { isIndexed: true } }),
        ]);

        const latestLinks = await prisma.pageContent.findMany({
            where: {
                OR: [
                    { isBloggerPosted: true },
                    { isTelegraphPosted: true },
                    { isTumblrPosted: true },
                    { isWordPressPosted: true },
                    { isGitHubPosted: true }
                ]
            },
            orderBy: { updatedAt: 'desc' },
            take: 20,
            select: {
                slug: true,
                bloggerPostUrl: true,
                telegraphPostUrl: true,
                tumblrPostUrl: true,
                wordPressPostUrl: true,
                githubPostUrl: true,
                updatedAt: true
            }
        });

        const authorityAssets = await prisma.authorityAsset.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        const totalBacklinks = bloggerPosted + telegraphPosted + tumblrPosted + wordpressPosted + githubPosted + gistPosted;
        
        let msg = `
🏴‍☠️ <b>HYDRA TAARRUZ: PLATFORM ANALİZİ</b>
${THEME.DIVIDER}
🚀 <b>Strateji:</b> Multi-Platform Parasite SEO
📊 <b>Toplam Backlink:</b> <code>${totalBacklinks}</code>
⚡ <b>Otorite Gücü:</b> DR 90+ Injected
${THEME.DIVIDER}

📈 <b>PLATFORM DAĞILIMI:</b>
• Blogger: <code>${bloggerPosted}</code> 🅱️
• Telegraph: <code>${telegraphPosted}</code> 📪
• WordPress: <code>${wordpressPosted}</code> 🌐
• Tumblr: <code>${tumblrPosted}</code> 📓
• GitHub: <code>${githubPosted}</code> 🛡️
• Gist: <code>${gistPosted}</code> 📄

💎 <b>VIP OTORİTE VARLIKLARI (GOV/EDU/NEWS):</b>
${authorityAssets.length > 0 ? authorityAssets.map(a => `• <a href="${a.url}">${a.title || 'Elite Asset'}</a> [DR ${a.dr}]`).join('\n') : '<i>Gov.tr saldırısı aktif...</i>'}

🔗 <b>SON SIZILAN NOKTALAR:</b>
${latestLinks.map(l => {
    const liveUrl = l.githubPostUrl || l.telegraphPostUrl || l.bloggerPostUrl || l.tumblrPostUrl || l.wordPressPostUrl;
    const platform = l.githubPostUrl ? '🛡️ GH' : l.telegraphPostUrl ? '📪 TG' : l.bloggerPostUrl ? '🅱️ BL' : l.tumblrPostUrl ? '📓 TM' : '🌐 WP';
    return `• ${platform} <a href="${liveUrl}">${l.slug}</a>`;
}).join('\n')}

${THEME.DIVIDER}
🧛‍♂️ <b>DURUM:</b> <i>Backlink bombası devam ediyor. Rapor hızı artırıldı.</i>
🚀 <i>v6.6 - Hydra Dominance Engine</i>
`.trim();

        await TelegramService.sendMessage(msg);
        console.log("✅ [SUCCESS] Lightweight report sent to Telegram.");

    } catch (err: any) {
        console.error("❌ [REPORT-ERROR]", err.message);
    }
}

runLightweightBacklinkReport();
