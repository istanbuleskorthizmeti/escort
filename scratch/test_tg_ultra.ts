
import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chat_id = process.env.TELEGRAM_CHAT_ID;

console.log("Token exists:", !!token);
console.log("Chat ID exists:", !!chat_id);
console.log("Chat ID:", chat_id);

if (!token || !chat_id) {
    process.exit(1);
}

const bot = new Telegraf(token);

async function run() {
    try {
        await bot.telegram.sendMessage(chat_id, "🧛‍♂️ <b>GOD MODE TEST (ULTRA):</b> Eğer bu mesaj gelirse bağlantı kesinleşmiş demektir.");
        console.log("✅ SUCCESS");
    } catch (e: any) {
        console.error("❌ FAILED:", e.message);
    }
}

run();
