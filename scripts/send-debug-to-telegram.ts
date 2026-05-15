import { sendTelegramPhoto, sendTelegramReport } from '../lib/telegram';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function sendScreenshot() {
    const screenshotPath = '/opt/hydra/error_attempt_1.png';
    console.log(`📤 Sending ${screenshotPath} to Telegram...`);
    
    try {
        if (fs.existsSync(screenshotPath)) {
            await sendTelegramPhoto(screenshotPath, "🚨 [DEBUG] Google Sites Creation Failure Screenshot");
            console.log("✅ Photo sent to Telegram.");
        } else {
            console.log("❌ Screenshot file not found on server. Sending text report instead.");
            await sendTelegramReport("🚨 [DEBUG] Google Sites creation failed, but screenshot was not found.");
        }
    } catch (err: any) {
        console.error("❌ Failed to send to Telegram:", err.message);
    }
}

sendScreenshot();
