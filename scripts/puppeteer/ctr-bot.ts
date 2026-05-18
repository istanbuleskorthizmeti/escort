import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { siteConfig } from '../../config/site';
import { TelegramService } from '../../lib/crm/telegram';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config();

// ⚔️ TURAN TACTIC 3: "SAHTE ORDU" (CTR MANIPULATION BOT v2.0 - GOLDEN EDITION)
// Simulates real Turkey residential human traffic to trick Google's RankBrain algorithm.

puppeteer.use(StealthPlugin());

const TARGET_DOMAIN = process.env.SITE_DOMAIN || siteConfig.domain;
const PREMIUM_PROXY = process.env.PREMIUM_PROXY_URL || '';

const KEYWORDS = [
  "istanbul vip escort",
  "kaporasız escort istanbul",
  "beşiktaş elit escort",
  "şişli escort ajansı",
  "istanbul güvenilir escort",
  "şişli vip escort",
  "kadıköy escort",
  "beylikdüzü escort",
  "bakırköy escort"
];

async function randomDelay(min: number, max: number) {
  const ms = Math.floor(Math.random() * (max - min + 1) + min);
  await new Promise(r => setTimeout(r, ms));
}

async function runCtrAttack() {
  console.log("🐺 [SAHTE_ORDU] CTR Manipülasyon Botu v2.0 Başlatılıyor...");
  
  if (PREMIUM_PROXY) {
    console.log("🛰️ [PROXY] Istanbul Residential Proxy Entegrasyonu Aktif!");
  } else {
    console.warn("⚠️ [PROXY] Herhangi bir proxy bulunamadı! Yerel IP kullanılacak.");
  }

  while (true) {
    const keyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
    console.log(`\n🔍 Hedef Kelime: "${keyword}"`);

    const launchArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-blink-features=AutomationControlled'
    ];

    let proxyUsername = '';
    let proxyPassword = '';

    // Proxy adresi parsing
    if (PREMIUM_PROXY) {
      try {
        // Format: http://user:pass@host:port
        const cleanProxy = PREMIUM_PROXY.replace('http://', '');
        const [auth, server] = cleanProxy.split('@');
        const [user, pass] = auth.split(':');
        
        launchArgs.push(`--proxy-server=http://${server}`);
        proxyUsername = user;
        proxyPassword = pass;
        console.log(`🛰️ [PROXY] Bağlanılıyor -> http://${server}`);
      } catch (err: any) {
        console.error("❌ Proxy parse hatası:", err.message);
      }
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: launchArgs
    });

    try {
      const page = await browser.newPage();

      // Proxy Authentication
      if (proxyUsername && proxyPassword) {
        await page.authenticate({
          username: proxyUsername,
          password: proxyPassword
        });
      }
      
      // Real Turkey User Agents
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0'
      ];
      await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
      
      // Set viewport like standard screen
      await page.setViewport({ width: 1366, height: 768 });

      // 1. Google Türkiye'ye git
      console.log("🌐 Google Türkiye açılıyor...");
      await page.goto('https://www.google.com.tr', { waitUntil: 'networkidle2', timeout: 60000 });
      await randomDelay(3000, 6000);

      // Çerez uyarısı kontrolü
      try {
        const acceptButton = await page.$('button#L2AGLb');
        if (acceptButton) {
          await acceptButton.click();
          await randomDelay(1500, 3000);
        }
      } catch (e) {}

      // 2. Arama çubuğuna insani bir şekilde yaz
      console.log(`✍️ Arama terimi yazılıyor: "${keyword}"`);
      await page.type('textarea[name="q"]', keyword, { delay: Math.floor(Math.random() * 100) + 100 });
      await randomDelay(1000, 2000);
      await page.keyboard.press('Enter');
      
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
      console.log("👀 Sonuçlar taramaya hazır.");

      // Yavaşça aşağı kaydır (insan taklidi)
      await page.evaluate(() => window.scrollBy(0, 400));
      await randomDelay(2000, 4000);

      // 3. Sonuçlarda bizim sitemizi (veya cloaked uydularımızı) ara
      const clickSuccess = await page.evaluate((targetDomain) => {
        const links = Array.from(document.querySelectorAll('a'));
        const targetLink = links.find(a => a.href && a.href.includes(targetDomain));
        if (targetLink) {
          targetLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return { found: true, text: targetLink.innerText, href: targetLink.href };
        }
        return { found: false };
      }, TARGET_DOMAIN);

      if (clickSuccess.found && clickSuccess.href) {
        console.log(`🎯 [TARGET HIT] Bulundu! Tıklanıyor -> ${clickSuccess.href}`);
        
        // Tıkla ve git
        await page.evaluate((targetDomain) => {
          const links = Array.from(document.querySelectorAll('a'));
          const targetLink = links.find(a => a.href && a.href.includes(targetDomain));
          if (targetLink) targetLink.click();
        }, TARGET_DOMAIN);

        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});
        
        // 4. Sitede gezin (Dwell Time manipülasyonu)
        const visitDurationSeconds = Math.floor(Math.random() * (120 - 60) + 60); // 1-2 dakika arası gezinme
        console.log(`⏳ Sitede gezinme simülasyonu başlatıldı... Süre: ${visitDurationSeconds}s`);
        
        // Telegram zafer raporu
        await TelegramService.sendMessage(
          `🐺 <b>SAHTE ORDU: HEDEF VURULDU</b>\n` +
          `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n` +
          `🔍 <b>Arama:</b> <code>${keyword}</code>\n` +
          `🎯 <b>Hedef Site:</b> <code>${TARGET_DOMAIN}</code>\n` +
          `🛰️ <b>Proxy IP:</b> İstanbul Ev İnterneti (Residential)\n` +
          `⏳ <b>Ziyaret Süresi:</b> <code>${visitDurationSeconds} saniye</code>\n` +
          `📈 <b>Algoritma:</b> RankBrain CTR Manipülasyonu Aktif!`
        ).catch(() => {});

        const intervals = Math.floor(visitDurationSeconds / 15);
        for (let i = 0; i < intervals; i++) {
          await page.evaluate(() => window.scrollBy(0, Math.random() * 300 - 100));
          await randomDelay(10000, 15000);
        }
        
        console.log("✅ Ziyaret tamamlandı. Oturum güvenle sonlandırıldı.");
      } else {
        console.log(`❌ Hedef [${TARGET_DOMAIN}] Google ilk sayfasında bulunamadı. Sıralama tırmanışta bekleniyor.`);
      }

    } catch (error: any) {
      console.error("⚠️ Bot çalışma hatası:", error.message || error);
    } finally {
      await browser.close();
      
      // Cooldown: 5 ila 10 dakika arası akıllı uyku (Google filtrelerine takılmamak için)
      const cooldownMinutes = Math.floor(Math.random() * (10 - 5) + 5);
      console.log(`💤 [COOLDOWN] Bot uyku moduna geçiyor. Sonraki operasyon ${cooldownMinutes} dakika sonra...`);
      await new Promise(r => setTimeout(r, cooldownMinutes * 60 * 1000));
    }
  }
}

runCtrAttack();
