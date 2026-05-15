import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { siteConfig } from '../config/site';
import { TelegramService } from '../lib/crm/telegram';

// ⚔️ TURAN TACTIC 3: "SAHTE ORDU" (CTR MANIPULATION BOT)
// This script simulates real human search traffic to trick Google's RankBrain algorithm.

puppeteer.use(StealthPlugin());

const TARGET_DOMAIN = siteConfig.domain;
const KEYWORDS = [
  "istanbul vip escort",
  "kaporasız escort istanbul",
  "beşiktaş elit escort",
  "şişli escort ajansı",
  "istanbul güvenilir escort"
];

async function randomDelay(min: number, max: number) {
  const ms = Math.floor(Math.random() * (max - min + 1) + min);
  await new Promise(r => setTimeout(r, ms));
}

async function runCtrAttack() {
  console.log("🐺 [SAHTE_ORDU] CTR Manipülasyon Botu Başlatılıyor...");
  
  while (true) {
    const keyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
    console.log(`🔍 Hedef Kelime: "${keyword}"`);

    const browser = await puppeteer.launch({
      headless: "new", // Run in background
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        // In a real environment, you MUST use a residential proxy here
        // '--proxy-server=http://TR_RESIDENTIAL_PROXY_IP:PORT'
      ]
    });

    try {
      const page = await browser.newPage();
      
      // Set a realistic Turkey user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // 1. Go to Google Turkey
      await page.goto('https://www.google.com.tr', { waitUntil: 'networkidle2' });
      await randomDelay(2000, 4000);

      // Accept cookies if prompt appears (simplified)
      try {
        const acceptButton = await page.$('button#L2AGLb');
        if (acceptButton) {
          await acceptButton.click();
          await randomDelay(1000, 2000);
        }
      } catch (e) {}

      // 2. Type keyword like a human
      await page.type('textarea[name="q"]', keyword, { delay: 150 });
      await page.keyboard.press('Enter');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      console.log("👀 Arama sonuçları taraması yapılıyor...");
      
      // 3. Scroll down slowly to simulate reading
      await page.evaluate(() => window.scrollBy(0, 500));
      await randomDelay(1500, 3000);
      await page.evaluate(() => window.scrollBy(0, 500));
      await randomDelay(2000, 4000);

      // 4. Look for our target domain in the results
      const targetFound = await page.evaluate((targetDomain) => {
        const links = Array.from(document.querySelectorAll('a'));
        const targetLink = links.find(a => a.href.includes(targetDomain));
        if (targetLink) {
          targetLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetLink.click();
          return true;
        }
        return false;
      }, TARGET_DOMAIN);

      if (targetFound) {
        console.log(`🎯 Hedef VURULDU! [${TARGET_DOMAIN}] linkine tıklandı.`);
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        
        // 5. Simulate reading the target site (Dwell Time Manipulation)
        console.log("⏳ Sitede vakit geçiriliyor (Dwell Time: 2-3 dk)...");
        for (let i = 0; i < 6; i++) {
          await page.evaluate(() => window.scrollBy(0, Math.random() * 400 + 200));
          await randomDelay(20000, 30000); // Wait 20-30 seconds between scrolls
        }
        console.log("✅ Görev tamamlandı. Çıkış yapılıyor.");
      } else {
        console.log(`❌ Hedef ilk sayfada bulunamadı. (Sinyal zayıf)`);
        // We could click "Next Page" here, but for safety, we just retry later.
      }

    } catch (error) {
      console.error("⚠️ Bot çalışma hatası:", error);
    } finally {
      await browser.close();
      
      // Wait 10-30 minutes before the next attack to look natural
      const cooldownMs = Math.floor(Math.random() * (1800000 - 600000) + 600000);
      console.log(`💤 Bot uykuya geçti. Sonraki saldırı ${Math.floor(cooldownMs/60000)} dakika sonra...`);
      await new Promise(r => setTimeout(r, cooldownMs));
    }
  }
}

// Bot is running silently
runCtrAttack();
