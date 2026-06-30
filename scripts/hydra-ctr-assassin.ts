import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

puppeteer.use(StealthPlugin());

/**
 * ⚡ HYDRA CTR & DWELL-TIME ASSASSIN (GOD MODE) ⚡
 * Organik arama motoru tıklama ve oturum simülatörü.
 * Özellikler: Pagination Desteği (İlk 5 sayfayı tarar), Anti-Bounce, Human-Emulation, LSI Havuzu.
 */

const TARGET_DOMAINS = ['dorukcanay.digital', 'istanbulescort.blog', 'sites.google.com/dorukcanay'];

// 🎯 Genişletilmiş LSI Hedef Kelime Havuzu
const TARGET_KEYWORDS = [
  'istanbul vip escort',
  'kaporasız vip escort istanbul',
  'şişli üniversiteli escort dorukcanay',
  'beylikdüzü escort dorukcanay',
  'bakırköy escort dorukcanay',
  'elit rus escort istanbul',
  'kadıköy escort bayan',
  'istanbul escort'
];

// Ayarlar
const HEADLESS_MODE = true; // Sunucu ortamı için zorunlu arka plan çalışması
const DWELL_TIME_MIN = 60000; // Sayfada minimum kalma süresi (60 saniye)
const DWELL_TIME_MAX = 180000; // Sayfada maksimum kalma süresi (3 dakika)
const MAX_PAGES_TO_SEARCH = 5; // İlk 5 Google sayfasını (SERP Pagination) tara

const LOGS_DIR = path.join(process.cwd(), 'logs', 'ctr-assassin');
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

function logEvent(msg: string) {
  const timestamp = new Date().toLocaleTimeString('tr-TR');
  console.log(`[${timestamp}] ⚔️ ${msg}`);
}

async function randomDelay(min = 1000, max = 3000) {
  const delay = Math.floor(Math.random() * (max - min + 1) + min);
  await new Promise(r => setTimeout(r, delay));
}

async function runCTRBlast() {
  logEvent('⚡ HYDRA CTR Assassin [GOD MODE] başlatılıyor...');
  logEvent(`Görsel Kontrol Modu (Headless): ${HEADLESS_MODE ? 'AÇIK (Arkaplan)' : 'KAPALI'}`);

  const userDataDir = path.join(process.cwd(), 'data', 'hydra_ctr_chrome_session');
  
  const browser = await puppeteer.launch({
    headless: HEADLESS_MODE,
    userDataDir: userDataDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1920,1080',
      '--disable-infobars',
      '--ignore-certificate-errors'
    ],
    defaultViewport: null
  });

  try {
    for (const keyword of TARGET_KEYWORDS) {
      logEvent(`\n-----------------------------------`);
      logEvent(`🎯 Hedef Kelime: "${keyword}"`);

      const page = await browser.newPage();
      
      // 🕵️ Dinamik User-Agent Rotasyonu (İnsan Taklidi)
      const uas = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/123.0.0.0 Safari/537.36'
      ];
      await page.setUserAgent(uas[Math.floor(Math.random() * uas.length)]);

      logEvent('🌐 Google Türkiye\'ye gidiliyor...');
      await page.goto('https://www.google.com.tr', { waitUntil: 'networkidle2' });
      await randomDelay(2000, 4000);

      // Çerez uyarısı gelirse kabul et
      try {
        const acceptButton = await page.$('button#L2AGLb'); // Google çerez kabul butonu
        if (acceptButton) {
          logEvent('🍪 Çerez politikası kabul ediliyor...');
          await acceptButton.click();
          await randomDelay(1000, 2000);
        }
      } catch (e) {}

      logEvent('⌨️ Anahtar kelime yazılıyor (İnsan taklidi ile)...');
      const searchBox = await page.$('textarea[name="q"], input[name="q"]');
      if (searchBox) {
        await searchBox.type(keyword, { delay: 100 }); 
        await randomDelay(500, 1500);
        await page.keyboard.press('Enter');
        logEvent('🔎 Arama tetiklendi, sonuçlar bekleniyor...');
      } else {
        logEvent('❌ Arama kutusu bulunamadı, kelime atlanıyor.');
        await page.close();
        continue;
      }

      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      await randomDelay(2000, 4000);

      let found = false;
      let currentPage = 1;

      // 🔁 Pagination Loop (Sonraki Sayfaya Geçiş Döngüsü)
      while (!found && currentPage <= MAX_PAGES_TO_SEARCH) {
        logEvent(`👀 SERP Tarama: Sayfa ${currentPage}/${MAX_PAGES_TO_SEARCH}...`);
        
        // Scroll the SERP to simulate human reading
        await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
        await randomDelay(1500, 3000);

        const linkFound = await page.evaluate((domains) => {
          const links = Array.from(document.querySelectorAll('a'));
          for (const link of links) {
            const href = link.href || '';
            if (domains.some(d => href.includes(d)) && link.querySelector('h3')) {
              link.scrollIntoView({ behavior: 'smooth', block: 'center' });
              return { found: true, href: href, text: link.querySelector('h3')?.textContent };
            }
          }
          return { found: false };
        }, TARGET_DOMAINS);

        if (linkFound.found) {
          found = true;
          logEvent(`🎯 HEDEF VURULDU! Sayfa ${currentPage}'de link bulundu: ${linkFound.href}`);
          logEvent(`🔗 Başlık: ${linkFound.text}`);
          
          await randomDelay(2000, 5000); 
          
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => logEvent('⚠️ Sayfa tam yüklenmedi ama devam ediliyor.')),
            page.evaluate((href) => {
              const el = document.querySelector(`a[href="${href}"]`);
              if (el) (el as HTMLElement).click();
            }, linkFound.href)
          ]);

          logEvent('✅ Siteye giriş yapıldı! Dwell-Time (Oturum Süresi) kasılıyor...');
          const safeKeyword = keyword.replace(/ /g, '-');
          await page.screenshot({ path: path.join(LOGS_DIR, `landing-${safeKeyword}.png`) });

          const dwellTime = Math.floor(Math.random() * (DWELL_TIME_MAX - DWELL_TIME_MIN + 1) + DWELL_TIME_MIN);
          logEvent(`⏳ Sitede hedeflenen kalma süresi: ${(dwellTime / 1000).toFixed(1)} saniye.`);

          const scrollIntervals = 5;
          const timePerScroll = dwellTime / scrollIntervals;

          // 🖱️ Scroll ve İnsan Davranışı Simülasyonu
          for (let i = 0; i < scrollIntervals; i++) {
            logEvent(`🖱️ İçerik okunuyor... (Scroll adım ${i + 1}/${scrollIntervals})`);
            await page.evaluate(() => {
              window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
            });
            await randomDelay(timePerScroll - 1000, timePerScroll + 1000);
          }

          logEvent('🏆 Operasyon başarılı! Ziyaretçi organik olarak siteden ayrılıyor (Bounce-Rate sıfırlandı).');
        } else {
          // Bulunamazsa "Sonraki (Next)" butonuna basarak diğer sayfaya geç
          if (currentPage < MAX_PAGES_TO_SEARCH) {
            logEvent(`⏭️ Sayfa ${currentPage}'de bulunamadı. Sonraki sayfaya geçiliyor...`);
            const nextClicked = await page.evaluate(() => {
              const nextBtn = document.querySelector('a#pnnext') as HTMLElement;
              if (nextBtn) {
                nextBtn.click();
                return true;
              }
              return false;
            });

            if (nextClicked) {
              await page.waitForNavigation({ waitUntil: 'networkidle2' });
              await randomDelay(2000, 4000);
              currentPage++;
            } else {
              logEvent('❌ "Sonraki" butonu bulunamadı, arama sonlandırılıyor.');
              break;
            }
          } else {
            logEvent('❌ Hedef domain belirlenen sayfa limitinde bulunamadı.');
          }
        }
      }

      await page.close();
      logEvent(`⏳ Diğer kelimeye geçmeden önce soğuma süresi (10-15sn)...`);
      await randomDelay(10000, 15000);
    }

  } catch (error: any) {
    logEvent(`❌ KRİTİK HATA: ${error.message}`);
  } finally {
    logEvent('🚪 Tarayıcı kapatılıyor. CTR Görevi tamamlandı.');
    await browser.close();
  }
}

runCTRBlast();
