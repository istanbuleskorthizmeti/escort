import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';
import { TelegramService } from '../lib/crm/telegram';

// Anti-Bot Stealth Modülü Aktif
chromium.use(stealth());

interface SiegeConfig {
    district: string;
    city: string;
    targetUrl: string;
    round: number;
}

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');

// God Mode HTML Template
const HTML_TEMPLATE = `
<!-- KULLANICI İÇİN GÖRÜNÜR ALAN (YÜKSEK KALİTE) -->
<article style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; padding: 20px;">
    
    <!-- H1: Sadece 1 tane olmalı, Anahtar Kelime + Niyet içermeli -->
    <h1 style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
        {{DISTRICT}} VIP Escort Rehberi: Kaporasız ve Güvenilir Deneyim
    </h1>

    <section>
        <p>
            Zamanınızın değerli olduğunu biliyoruz. <strong>{{DISTRICT}} bölgesinde</strong> standartların ötesinde bir deneyim arayanlar için, gizliliğin ve lüksün ön planda tutulduğu profesyonel hizmetler sunulmaktadır.
        </p>
    </section>

    <!-- H2: Alt başlıklar NLP için yapılandırıldı -->
    <h2 style="color: #2980b9; margin-top: 30px;">Neden {{DISTRICT}} Elit Partnerlerini Seçmelisiniz?</h2>
    <ul>
        <li><strong>%100 Gerçek Profiller:</strong> Fotoğrafların tamamı teyitlidir.</li>
        <li><strong>Kaporasız İşlem:</strong> Ödemeler yalnızca görüşme esnasında elden yapılır.</li>
        <li><strong>VIP Konaklama Uyumlu:</strong> Bölgedeki 5 yıldızlı oteller ve lüks rezidanslara servis imkanı.</li>
    </ul>

    <!-- 🎯 CALL TO ACTION (Görünür ve Çekici) -->
    <div style="text-align: center; margin: 40px 0;">
        <a href="{{TARGET_URL}}" style="background-color: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            Hemen Katalogu İncele (Giriş)
        </a>
    </div>
    
    <div style="width:100%; height:800px; overflow:hidden; margin-top:20px;">
        <iframe src="{{TARGET_URL}}" width="100%" height="800px" frameborder="0"></iframe>
    </div>

    <!-- 🕵️‍♂️ GOD MODE: GİZLİ LİNK İNŞASI (Botlar için) -->
    <div style="opacity: 0.01; font-size: 1px; line-height: 1px; user-select: none; pointer-events: none; overflow: hidden; height: 1px;">
        Daha fazla bilgi için <a href="{{TARGET_URL}}">{{CITY}} elit eskort</a> ve <a href="{{TARGET_URL}}">kaporasız {{DISTRICT}} escort</a> seçeneklerine göz atabilirsiniz.
    </div>

</article>

<!-- 🧠 GOD MODE: FAQ SCHEMA -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{{DISTRICT}} VIP hizmetler kaporasız mı?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Evet, platformumuzda yer alan tüm {{DISTRICT}} escort profilleri kaporasız çalışmaktadır. Ödemeler elden yapılır."
      }
    },
    {
      "@type": "Question",
      "name": "Profillerin doğruluğu nasıl teyit ediliyor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Tüm partnerlerimizin görselleri günceldir ve VIP standartlarında teyit süreçlerinden geçmektedir."
      }
    }
  ]
}
</script>
`;

export class GoogleSitesFactory {
    private browserContext: any = null;

    async initialize() {
        console.log("🚀 [GOD MODE] Playwright Motoru Ateşleniyor...");
        if (!fs.existsSync(USER_DATA_DIR)) fs.mkdirSync(USER_DATA_DIR, { recursive: true });
        
        const chromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";
        
        this.browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
            headless: false,
            executablePath: chromePath,
            viewport: { width: 1366, height: 768 },
            args: [
                '--start-maximized',
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
    }

    async constructSite(config: SiegeConfig) {
        if (!this.browserContext) throw new Error("Motor başlatılmadı!");
        
        const page = await this.browserContext.newPage();
        const publishSlug = `${config.district.toLowerCase()}-vip-drk${config.round}-${Math.floor(Math.random()*999)}`;
        const siteTitle = `${config.district.charAt(0).toUpperCase() + config.district.slice(1)} VIP Rehberi`;
        
        try {
            console.log(`🎯 [TARGET] ${siteTitle} hedefleniyor...`);
            
            // 1. Yeni Site Oluştur
            await page.goto('https://sites.google.com/new', { waitUntil: 'load', timeout: 120000 });
            
            if (page.url().includes('signin')) {
                 console.log("⚠️ [ACTION] Lutfen GIRIS YAP.");
                 await page.waitForFunction(() => !window.location.href.includes('signin'), { timeout: 0 });
                 await page.goto('https://sites.google.com/new', { waitUntil: 'load', timeout: 120000 });
            }

            console.log("🖱️ '+' (Yeni site) butonuna tiklaniyor...");
            const createSelectors = [
                '[aria-label="Create new site"]', '[aria-label="Yeni site oluştur"]', '[aria-label="Boş"]',
                '.docs-homescreen-templates-templateview-preview', '[data-tooltip="Create new site"]'
            ];
            
            await page.waitForSelector(createSelectors.join(','));
            const clicked = await page.evaluate((selList: string[]) => {
                for (const sel of selList) {
                    const el = document.querySelector(sel) as HTMLElement;
                    if (el) { el.click(); return true; }
                }
                return false;
            }, createSelectors);

            if (!clicked) throw new Error("COULD_NOT_FIND_CREATE_BUTTON");
            
            // Handle potential new tab
            await page.waitForTimeout(5000);
            const pages = await this.browserContext.pages();
            let editorPage = pages[pages.length - 1];
            await editorPage.bringToFront();

            console.log("⏳ Editorun yuklenmesi bekleniyor...");
            const nameSelector = 'input[aria-label="Document name"], input[aria-label="Doküman adı"]';
            await editorPage.waitForSelector(nameSelector, { timeout: 60000 });
            
            // 2. Başlığı Gir
            console.log(`✍️ Baslik yaziliyor: ${siteTitle}`);
            await editorPage.fill(nameSelector, siteTitle);
            await editorPage.keyboard.press('Enter');
            await editorPage.waitForTimeout(4000);

            // 3. Embed Menüsü
            console.log("🔗 Yerlestirme (Embed) menusu aciliyor...");
            await editorPage.evaluate(() => {
                const selectors = ['[aria-label="Embed"]', '[aria-label="Yerleştir"]', '[data-tooltip="Yerleştir"]'];
                for (const sel of selectors) {
                    const el = document.querySelector(sel) as HTMLElement;
                    if (el) { el.click(); return true; }
                }
            });
            
            await editorPage.waitForSelector('div[role="tablist"] div:nth-child(2)', { timeout: 15000 });
            await editorPage.evaluate(() => (document.querySelectorAll('div[role="tablist"] div')[1] as HTMLElement).click());
            
            // 4. Şablonu Hazırla ve Yapıştır
            const finalHtml = HTML_TEMPLATE
                .replace(/{{DISTRICT}}/g, config.district.charAt(0).toUpperCase() + config.district.slice(1))
                .replace(/{{CITY}}/g, config.city)
                .replace(/{{TARGET_URL}}/g, config.targetUrl);

            console.log("📝 Iframe ve Tag kodlari yapistiriliyor...");
            await editorPage.waitForSelector('textarea', { timeout: 15000 });
            await editorPage.fill('textarea', finalHtml);
            
            // 5. İleri ve Ekle
            console.log("➡️ 'Ileri' butonuna tiklaniyor...");
            await editorPage.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                const next = btns.find(b => ['next', 'ileri', 'sonraki'].some(t => b.textContent?.toLowerCase().includes(t)));
                if (next) next.click();
            });
            await editorPage.waitForTimeout(4000);
            
            console.log("📥 'Ekle' butonuna tiklaniyor...");
            await editorPage.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                const insert = btns.find(b => ['insert', 'ekle'].some(t => b.textContent?.toLowerCase().includes(t)));
                if (insert) insert.click();
            });
            await editorPage.waitForTimeout(5000);

            // 6. Yayınla
            console.log("📡 'Yayinla' (Publish) baslatiliyor...");
            await editorPage.evaluate(() => {
                const selectors = ['[aria-label="Publish"]', '[aria-label="Yayınla"]', '[data-tooltip="Yayınla"]'];
                for (const sel of selectors) {
                    const el = document.querySelector(sel) as HTMLElement;
                    if (el) { el.click(); return true; }
                }
            });
            
            await editorPage.waitForSelector('input[name="site-url"]', { timeout: 15000 });
            console.log(`🔗 Web adresi ayarlaniyor: ${publishSlug}`);
            await editorPage.fill('input[name="site-url"]', publishSlug);
            await editorPage.waitForTimeout(4000);

            console.log("🚀 FINAL: Yayina aliniyor...");
            const published = await editorPage.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                const pub = btns.find(b => b.textContent?.toLowerCase() === 'yayınla' || b.textContent?.toLowerCase() === 'publish');
                if (pub) { pub.click(); return true; }
                return false;
            });

            if (!published) throw new Error("FINAL_PUBLISH_FAILED");

            console.log("⏳ Yayinin aktiflesmesi bekleniyor (15sn)...");
            await editorPage.waitForTimeout(15000);
            
            const liveUrl = `https://sites.google.com/view/${publishSlug}`;
            console.log(`✅ [BAŞARILI] Site Yayında! Link: ${liveUrl}`);
            
            this.saveToTier2List(liveUrl);
            await TelegramService.sendMessage(`✅ <b>HYDRA PLAYWRIGHT: GOD MODE</b>\n🎯 ${siteTitle}\n🔗 ${liveUrl}\n🔥 Status: LIVE`);

        } catch (error: any) {
            console.error(`❌ [HATA] ${config.district} başarısız oldu:`, error.message);
        } finally {
            try { await page.close(); } catch(e){}
        }
    }

    private saveToTier2List(url: string) {
        const filePath = path.join(process.cwd(), 'data', 'live_google_sites.json');
        let sites: string[] = [];
        if (fs.existsSync(filePath)) {
            try { sites = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch(e){}
        }
        if (!sites.includes(url)) {
            sites.push(url);
            fs.writeFileSync(filePath, JSON.stringify(sites, null, 2));
        }
    }

    async close() {
        if (this.browserContext) {
            await this.browserContext.close();
            console.log("🛑 [GOD MODE] Motor Kapatıldı.");
        }
    }
}

// BATCH RUNNER
async function runPlaywrightSiege() {
    const args = process.argv.slice(2);
    const round = parseInt(args[0] || '1');
    const city = args[1] || 'istanbul';
    
    // Test for one district first
    const testDistricts = ['sisli', 'besiktas', 'kadikoy'];
    
    const factory = new GoogleSitesFactory();
    
    try {
        await factory.initialize();
        
        for (const district of testDistricts) {
             await factory.constructSite({
                 district: district,
                 city: city,
                 targetUrl: "https://istanbulescort.blog",
                 round: round
             });
             
             console.log("⏳ Anti-spam beklemesi (10 saniye)...");
             await new Promise(r => setTimeout(r, 10000));
        }
    } catch (e: any) {
        console.error("💥 Kritik Hata:", e.message);
    } finally {
        await factory.close();
    }
}

// Only run if executed directly
if (require.main === module) {
    runPlaywrightSiege();
}
