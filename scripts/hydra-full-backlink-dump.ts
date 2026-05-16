
import { prisma } from "../lib/prisma";
import { TelegramService } from "../lib/crm/telegram";
import fs from "fs";
import path from "path";
import { bot } from "../lib/crm/bot-instance";

async function dumpAllBacklinks() {
    console.log("📂 [BACKLINK-DUMP] Extracting all generated links...");
    
    try {
        const links = await prisma.pageContent.findMany({
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

        if (links.length === 0) {
            console.log("⚠️ No links found in database.");
            await TelegramService.sendMessage("⚠️ <b>DİKKAT:</b> Veritabanında henüz yayınlanmış backlink bulunamadı.");
            return;
        }

        let content = `HYDRA NETWORK - FULL BACKLINK AUDIT REPORT\n`;
        content += `Generated At: ${new Date().toLocaleString('tr-TR')}\n`;
        content += `Total Links: ${links.length}\n`;
        content += `====================================================\n\n`;

        links.forEach((l, i) => {
            content += `[${i + 1}] ${l.slug.toUpperCase()}\n`;
            if (l.bloggerPostUrl) content += `   - Blogger: ${l.bloggerPostUrl}\n`;
            if (l.telegraphPostUrl) content += `   - Telegraph: ${l.telegraphPostUrl}\n`;
            if (l.githubPostUrl) content += `   - GitHub: ${l.githubPostUrl}\n`;
            if (l.tumblrPostUrl) content += `   - Tumblr: ${l.tumblrPostUrl}\n`;
            if (l.wordPressPostUrl) content += `   - WordPress: ${l.wordPressPostUrl}\n`;
            content += `   Updated: ${l.updatedAt.toLocaleString('tr-TR')}\n\n`;
        });

        const filePath = path.join(process.cwd(), 'backlink_full_dump.txt');
        fs.writeFileSync(filePath, content);

        console.log(`✅ [SUCCESS] Dump created: ${links.length} links.`);

        // Send to Telegram using bot instance directly since service doesn't have sendDocument yet
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        if (bot && CHAT_ID) {
            await bot.telegram.sendDocument(CHAT_ID, { source: filePath }, {
                caption: `📂 <b>HYDRA: TAM BACKLINK LİSTESİ</b>\n${"▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"}\n📊 <b>Toplam Link:</b> <code>${links.length}</code>\n🛡️ <i>Tüm platformlar (WP, Blogger, GH, TG) mühürlendi.</i>`,
                parse_mode: 'HTML'
            });
            console.log("📤 [TELEGRAM] Document sent successfully.");
        } else {
            console.error("❌ Telegram bot or CHAT_ID not configured.");
        }

        // Clean up
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    } catch (err: any) {
        console.error("❌ [DUMP-ERROR]:", err.message);
        await TelegramService.reportError("Backlink Dump Failed", err.message);
    }
}

dumpAllBacklinks().then(() => process.exit(0)).catch(() => process.exit(1));
