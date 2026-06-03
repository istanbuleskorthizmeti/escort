
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

    // --- Natural Browsing Simulation ---
    let pagesVisited = 1;
    
    // Scroll simulation on landing page
    await page.evaluate(() => {
      window.scrollBy({ top: Math.floor(Math.random() * 600) + 300, behavior: 'smooth' });
    });
    await new Promise(r => setTimeout(r, Math.floor(Math.random() * 4000) + 3000)); // wait 3-7s

    // Extract and navigate to a random internal link for browsing
    try {
      const currentOrigin = new URL(page.url()).origin;
      const internalLinks = await page.evaluate((origin) => {
        return Array.from(document.querySelectorAll('a'))
          .map(a => a.href)
          .filter(href => {
            if (!href) return false;
            // Only internal links, ignore hashes, static resources, and external platforms
            const isInternal = href.startsWith(origin) || href.startsWith('/');
            const isNotSpecial = !href.includes('wa.me') && !href.includes('whatsapp') && !href.includes('tel:') && !href.includes('#') && !href.includes('.png') && !href.includes('.jpg');
            return isInternal && isNotSpecial;
          });
      }, currentOrigin);

      if (internalLinks.length > 0) {
        // Choose a random internal link
        const randomLink = internalLinks[Math.floor(Math.random() * internalLinks.length)];
        console.log(`🔗 [SHADOW] Browsing subpage: ${randomLink}`);
        
        // Emulate clicking/navigating to it
        await page.goto(randomLink, { waitUntil: 'networkidle2', timeout: 30000 });
        pagesVisited++;
        
        // Scroll simulation on the subpage
        await page.evaluate(() => {
          window.scrollBy({ top: Math.floor(Math.random() * 500) + 200, behavior: 'smooth' });
        });
        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 5000) + 4000)); // wait 4-9s
      }
    } catch (browseErr: any) {
      console.warn(`⚠️ [SHADOW] Browsing simulation failed:`, browseErr.message);
    }

    // WhatsApp Signal Trigger on the final browsed page
    const waButton = await page.$('a[href*="wa.me"], a[href*="/wa"], a[href*="whatsapp"]');
    let conversion = "NO";
    if (waButton) {
      console.log(`🔥 [SHADOW] WhatsApp Button Found! Triggering Conversion...`);
      // Scroll to view it if needed
      await page.evaluate((el) => {
        if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, waButton);
      await new Promise(r => setTimeout(r, 1500));
      
      await waButton.click();
      conversion = `YES (WhatsApp Triggered after visiting ${pagesVisited} pages)`;
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
