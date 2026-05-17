
import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

async function checkMe() {
    try {
        const me = await bot.telegram.getMe();
        console.log("🤖 BOT INFO:");
        console.log(JSON.stringify(me, null, 2));
    } catch (e: any) {
        console.error("❌ Failed to get bot info:", e.message);
    }
}

checkMe();
