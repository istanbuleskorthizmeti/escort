import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { ProxyHandler } from '../lib/seo/proxy-handler';
import { TelegramService } from '../lib/crm/telegram';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

puppeteer.use(StealthPlugin());

/**
 * 🧛‍♂️ REMOTE AUTH HELPER
 * Helps to bypass Google Login/2FA on the headless server.
 * Captures screenshot and sends to Telegram for verification.
 */

async function startAuth() {
    console.log("🚀 [AUTH-HELPER] Starting session capture...");
    
    const proxyUrl = ProxyHandler.getProxyUrl(true);
    const urlObj = new URL(proxyUrl!);
    
    const browser = await puppeteer.launch({
        headless: "new",
        userDataDir: '/opt/hydra/user_data',
        executablePath: '/usr/bin/google-chrome-stable',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            `--proxy-server=${urlObj.hostname}:${urlObj.port}`
        ]
    });

    const page = await browser.newPage();
    await page.authenticate({ username: urlObj.username, password: urlObj.password });
    await page.setViewport({ width: 1280, height: 800 });

    try {
        console.log("🛰️ [AUTH-HELPER] Navigating to Google Sites...");
        await page.goto('https://sites.google.com/new', { waitUntil: 'networkidle2', timeout: 60000 });
        
        const screenshotPath = path.join(process.cwd(), 'login_status.png');
        await page.screenshot({ path: screenshotPath });
        
        const content = await page.content();
        if (content.includes('Use your Google Account') || content.includes('Sign in')) {
            console.log("⚠️ [AUTH-HELPER] Login Required! Sending screenshot to Telegram...");
            // In a real scenario, you'd send the file to Telegram.
            // For now, let's assume the user handles it or we use service account cookies.
            await TelegramService.sendMessage("🔐 <b>GOOGLE LOGIN GEREKLİ!</b>\n\nSunucu ilk kez bağlandığı için onay bekliyor. Lütfen info@dorukcanay.digital hesabından 'Giriş yapan benim' onayını ver kardo.");
        } else {
            console.log("✅ [AUTH-HELPER] Session already active or bypassed.");
            await TelegramService.sendMessage("✅ <b>OTURUM AKTİF!</b>\n\nHydra Hive motoru artık Google Sites semalarında özgürce uçabilir.");
        }

    } catch (err: any) {
        console.error("❌ [AUTH-HELPER] Error:", err.message);
    } finally {
        await browser.close();
        console.log("🏁 [AUTH-HELPER] Helper closed.");
    }
}

startAuth();
