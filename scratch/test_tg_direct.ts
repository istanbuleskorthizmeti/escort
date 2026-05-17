
import { bot } from '../lib/crm/bot-instance';
import * as dotenv from 'dotenv';
dotenv.config();

const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function test() {
    console.log(`🤖 Bot Token: ${process.env.TELEGRAM_BOT_TOKEN?.substring(0, 10)}...`);
    console.log(`🎯 Chat ID: ${CHAT_ID}`);
    
    if (!bot) {
        console.error("❌ Bot instance is null!");
        return;
    }

    try {
        const result = await bot.telegram.sendMessage(CHAT_ID!, "🧛‍♂️ <b>GOD MODE TEST:</b> Rapor kontrolü yapılıyor. Bu mesajı görüyorsan bağlantı başarılı.");
        console.log("✅ Message sent successfully!");
        console.log("📝 Result:", JSON.stringify(result, null, 2));
    } catch (err: any) {
        console.error("❌ Message failed!");
        console.error("🔴 Error:", err.message);
        if (err.description) console.error("ℹ️ Description:", err.description);
    }
}

test();
