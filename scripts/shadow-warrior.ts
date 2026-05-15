
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
puppeteer.use(StealthPlugin());

/**
 * 🧛‍♂️ SHADOW WARRIOR v2.1 - TELEGRAM REPORTING
 * DeepSeek-Powered CTR & Conversion Simulation
 */

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "6337841577:AAEUw6_M1F6VshX-G67j6hS6hZ6H9H6H9H6"; // Mevcut tokendan alacak
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1001944514751";
const TARGET_DOMAINS = ['vipescorthizmeti.com', 'dorukcanay.digital'];
const USER_AGENTS = [
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.40 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
];

async function sendTelegramReport(msg: string) {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: msg,
      parse_mode: 'HTML'
    });
  } catch (err) {
    console.error("Telegram Report Error");
  }
}

async function runGodModeSession(keyword: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  await page.setUserAgent(ua);
  
  try {
    console.log(`⚔️ [SHADOW] Mission Started: ${keyword}`);

    await page.goto('https://www.google.com.tr/search?q=' + encodeURIComponent(keyword), { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 4000));

    const targetLink = await page.$(`a[href*="${TARGET_DOMAINS[0]}"]`);
    let actionType = "DIRECT HIT";

    if (targetLink) {
      actionType = "ORGANIC CLICK";
      await targetLink.click();
    } else {
      await page.goto(`https://${TARGET_DOMAINS[0]}`, { waitUntil: 'networkidle2' });
    }

    // Scroll simulation
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 5000));

    // WhatsApp Signal
    const waButton = await page.$('a[href*="wa.me"], a[href*="/wa"]');
    let conversion = "NO";
    if (waButton) {
      await waButton.click();
      conversion = "YES (WhatsApp Triggered)";
    }

    // 🛰️ SEND REPORT
    await sendTelegramReport(`
⚔️ <b>SHADOW WARRIOR: OPERASYON BAŞARILI!</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🔍 <b>Kelime:</b> <code>${keyword}</code>
🎯 <b>Yöntem:</b> <code>${actionType}</code>
📱 <b>Cihaz:</b> <code>${ua.includes('iPhone') ? 'iPhone' : 'Android/PC'}</code>
🔥 <b>Dönüşüm:</b> <code>${conversion}</code>
🌐 <b>Hedef:</b> <code>${TARGET_DOMAINS[0]}</code>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🚀 <i>Google Radarı Manipüle Edildi.</i>
    `.trim());

  } catch (err: any) {
    console.error(`❌ Shadow Mission Error:`, err.message);
  } finally {
    await browser.close();
  }
}

async function startWar() {
  const KEYWORDS = ['istanbul escort', 'vip escort istanbul', 'rus escort beşiktaş', 'şişli escort bayan'];
  while (true) {
    const kw = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
    await runGodModeSession(kw);
    await new Promise(r => setTimeout(r, (60 + Math.random() * 120) * 1000));
  }
}

startWar().catch(console.error);
