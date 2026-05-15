import axios from 'axios';

/**
 * ☠️ DRKCNAY ELITE COMMAND CENTER (Nuclear v12.0 Reporting)
 * Sends real-time execution logs, link wheels, and errors directly to the VIP Telegram Group/User.
 */
export class TelegramReporter {
    // Dynamic fetching used in methods to prevent static initialization issues.

    /**
     * Sends an HTML formatted message to Telegram.
     */
    public static async sendMessage(message: string): Promise<boolean> {
        // Fetch dynamically at runtime to ensure ENV is loaded
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            console.warn("[TELEGRAM] Missing Bot Token or Chat ID. Reporting skipped.");
            return false;
        }

        try {
            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const payload = {
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true // Don't clutter the chat with giant link previews
            };

            await axios.post(url, payload);
            return true;
        } catch (e: any) {
            console.error("[TELEGRAM] Failed to send report:", e.message);
            return false;
        }
    }

    /**
     * Sends a successful Swarm completion report.
     */
    public static async sendSwarmReport(targetUrl: string, chainDetails: { platform: string, url: string | null, account?: string }[]) {
        const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
        
        let message = `🎯 <b>VIP Elite SWARM TAMAMLANDI</b> 🎯\n`;
        message += `🕒 Tarih: <code>${timestamp}</code>\n`;
        message += `🌐 Ana Hedef: <a href="${targetUrl}">${targetUrl}</a>\n\n`;
        
        message += `🔗 <b>Kusursuz Zincir ve Kimlik Raporu:</b>\n`;
        
        for (const node of chainDetails) {
            const accInfo = node.account ? ` (Kimlik: <code>${node.account}</code>)` : '';
            if (node.url) {
                message += `✅ <b>${node.platform}:</b> <a href="${node.url}">Yayında</a>${accInfo}\n`;
            } else {
                message += `❌ <b>${node.platform}:</b> Başarısız (Atlandı)${accInfo}\n`;
            }
        }

        message += `\n⚡ <i>Hydra Network - Auto Reporting</i>`;

        return await this.sendMessage(message);
    }

    /**
     * Sends a critical error alert.
     */
    public static async sendAlert(moduleName: string, errorMsg: string) {
        const message = `🚨 <b>HYDRA KRİTİK HATA</b> 🚨\n\n<b>Modül:</b> ${moduleName}\n<b>Hata:</b> <code>${errorMsg}</code>`;
        return await this.sendMessage(message);
    }
}
