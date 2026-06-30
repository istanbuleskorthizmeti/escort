import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ISTANBUL_NEIGHBORS } from '../lib/seo/neighborhood-map';

// Enable stealth plugin
chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const CHROME_PATH = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";
const TEXT_THRESHOLD = 1500;

interface SiteConfig {
  url: string;
  slug: string;
  district: string;
}

const GOOGLE_SITES: SiteConfig[] = [
  { url: "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa", slug: "sefakoyistanbul-drkcnay2026", district: "sefakoy" },
  { url: "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa", slug: "bakrkyescort-drkcnayv1", district: "bakirkoy" },
  { url: "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa", slug: "catalca-escort-drkcnay1-v", district: "catalca" },
  { url: "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa", slug: "beylikduzu-vip-escort", district: "beylikduzu" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa", slug: "besyol-universiteli-escort", district: "besyol" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa", slug: "besyol-escort-drkcnay1-v", district: "besyol" },
  { url: "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa", slug: "istanbul-escort", district: "istanbul" },
  { url: "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa", slug: "sancaktepe-escort-drkcnay1-v", district: "sancaktepe" },
  { url: "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa", slug: "kartal-escort-drkcnay1-v", district: "kartal" },
  { url: "https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa", slug: "cekmekoy-escort-drkcnay1-v", district: "cekmekoy" },
  { url: "https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa", slug: "arnavutkoy-escort-drkcnay1-v", district: "arnavutkoy" },
  { url: "https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa", slug: "basaksehir-escort-drkcnay1-v", district: "basaksehir" },
  { url: "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa", slug: "esenler-escort-drkcnay1-v", district: "esenler" },
  { url: "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa", slug: "adalar-escort-drkcnay1-v", district: "adalar" },
  { url: "https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026/ana-sayfa", slug: "silivriescort-drkcnay2026", district: "silivri" },
  { url: "https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v/ana-sayfa", slug: "beyoglu-escort-drkcnay1-v", district: "beyoglu" }
];

async function getPageTextLength(url: string): Promise<number> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(response.data);
    $('script, style, iframe, nav, header, footer').remove();
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    return text.length;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`⚠️ Failed to parse public text length for ${url}:`, msg);
    return 0;
  }
}

function getDistrictProperName(district: string): string {
  const mapping: Record<string, string> = {
    sefakoy: "Sefaköy",
    bakirkoy: "Bakırköy",
    catalca: "Çatalca",
    beylikduzu: "Beylikdüzü",
    besyol: "Beşyol",
    istanbul: "İstanbul",
    sancaktepe: "Sancaktepe",
    kartal: "Kartal",
    cekmekoy: "Çekmeköy",
    arnavutkoy: "Arnavutköy",
    basaksehir: "Başakşehir",
    esenler: "Esenler",
    adalar: "Adalar",
    silivri: "Silivri",
    beyoglu: "Beyoğlu"
  };
  return mapping[district.toLowerCase()] || district;
}

function getDistrictLowercaseTurkish(district: string): string {
  const mapping: Record<string, string> = {
    sefakoy: "sefaköy",
    bakirkoy: "bakırköy",
    catalca: "çatalca",
    beylikduzu: "beylikdüzü",
    besyol: "beşyol",
    istanbul: "istanbul",
    sancaktepe: "sancaktepe",
    kartal: "kartal",
    cekmekoy: "çekmeköy",
    arnavutkoy: "arnavutköy",
    basaksehir: "başakşehir",
    esenler: "esenler",
    adalar: "adalar",
    silivri: "silivri",
    beyoglu: "beyoğlu"
  };
  return mapping[district.toLowerCase()] || district.toLowerCase();
}

function generateArticleText(district: string, neighbors: string[]): string {
  const currentYear = new Date().getFullYear();
  const cleanNeighbors = neighbors.slice(0, 5).join(', ');
  
  const capDistrict = getDistrictProperName(district);
  const lowercaseDistrict = getDistrictLowercaseTurkish(district);

  return `${capDistrict} Escort ve Elit Partner Hizmetleri ${currentYear}\n\n` +
         `${capDistrict} genelinde kaporasız, ön ödemesiz ve tamamen buluşma anında elden ödemeli çalışan bireysel escort partnerlerin güncel listesine hoş geldiniz. ` +
         `Tamamı teyitli ve %100 gerçek görsellerden oluşan elit refakatçi alternatiflerimiz, siz değerli misafirlerimize unutulmaz anlar yaşatmak için hazırdır.\n\n` +
         `Güvenilir ve Kaporasız Görüşme Deneyimi:\n` +
         `Bölgemizde hizmet veren partnerler hiçbir şekilde ön ödeme veya kapora talep etmez. Tamamen güven esasına dayalı olarak, adreste elden ödeme kolaylığı sunulmaktadır. ` +
         `Bu sayede dolandırıcılık risklerinden uzak, şeffaf ve güvenli bir randevu süreci geçirebilirsiniz.\n\n` +
         `Lüks Refakatçi ve VIP Konseptler:\n` +
         `- %100 Gerçek Görsel Garantisi: Görsellerin tamamı güncel ve teyitlidir.\n` +
         `- Geniş Hizmet Ağı: Rezidans, otel veya kendi kişisel adreslerinizde görüşme imkanı.\n` +
         `- Yakın Hizmet Bölgeleri: ${capDistrict} ve çevresindeki ${cleanNeighbors} bölgelerinde aktif hizmet verilmektedir.\n\n` +

         `Anahtar Kelimeler:\n` +
         `${lowercaseDistrict} escort, ${lowercaseDistrict} eskort, kaporasız ${lowercaseDistrict} escort, ${lowercaseDistrict} vip eskort, ${lowercaseDistrict} rus escort, ${lowercaseDistrict} escort bayan.`;
}

async function enrichSites() {
  console.log("🚀 [HYDRA-ENRICHER] Starting Google Sites text saturation run...");
  
  if (!fs.existsSync(USER_DATA_DIR)) {
    fs.mkdirSync(USER_DATA_DIR, { recursive: true });
  }

  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    executablePath: CHROME_PATH,
    viewport: { width: 1366, height: 768 },
    args: [
      '--start-maximized',
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browserContext.newPage();

  try {
    for (const site of GOOGLE_SITES) {
      console.log(`\n----------------------------------------\n🔍 Checking site: ${site.url}`);
      const currentLength = await getPageTextLength(site.url);
      console.log(`📊 Current public text length: ${currentLength} characters.`);

      if (currentLength >= TEXT_THRESHOLD) {
        console.log(`🟢 Site meets threshold (${TEXT_THRESHOLD} chars). Skipping enrichment.`);
        continue;
      }

      console.log(`⚠️ Site text content is thin (${currentLength} chars). Navigating to public page...`);
      await page.goto(site.url, { waitUntil: 'load', timeout: 120000 });
      await page.waitForTimeout(5000);

      // Detect login screen
      if (page.url().includes('signin') || page.url().includes('accounts.google.com')) {
        console.log("⚠️ [ACTION REQUIRED] Please sign in to your Workspace account in the Chrome window...");
        await page.waitForFunction(
          () => !window.location.href.includes('signin') && !window.location.href.includes('accounts.google.com'),
          { timeout: 0 }
        );
        console.log("🟢 Login detected. Returning to site...");
        await page.goto(site.url, { waitUntil: 'load', timeout: 120000 });
        await page.waitForTimeout(5000);
      }

      console.log("🖱️ Looking for edit pencil button...");
      const editSelectors = [
        'div[role="button"][aria-label*="edit" i]',
        'div[role="button"][aria-label*="düzenle" i]',
        'a[href*="/edit"]',
        'a[aria-label*="edit" i]',
        'a[aria-label*="düzenle" i]',
        'button[aria-label*="edit" i]',
        'button[aria-label*="düzenle" i]',
        '[data-tooltip*="edit" i]',
        '[data-tooltip*="düzenle" i]'
      ];

      const initialPagesCount = (await browserContext.pages()).length;

      let clicked = false;
      for (const sel of editSelectors) {
        try {
          const locator = page.locator(sel);
          if (await locator.count() > 0) {
            console.log(`🎯 Clicking selector: ${sel}`);
            await locator.first().click();
            clicked = true;
            break;
          }
        } catch (e) {}
      }

      if (!clicked) {
        console.log("🖱️ Coordinate fallback: clicking bottom-right corner edit button...");
        await page.mouse.click(1325, 725);
        clicked = true;
      }

      console.log("⏳ Waiting 8 seconds for editor load/redirection...");
      await page.waitForTimeout(8000);

      // Multi-tab check
      const currentPages = await browserContext.pages();
      let editorPage = page;
      if (currentPages.length > initialPagesCount) {
        editorPage = currentPages[currentPages.length - 1];
        await editorPage.bringToFront();
        console.log("📂 Switched to newly opened Editor tab.");
      } else {
        console.log("ℹ️ Editor opened in the same tab.");
      }

      console.log("⏳ Waiting for Editor interface to load (Text box button presence)...");
      await editorPage.waitForFunction(() => {
        const selectors = ['[aria-label="Text box"]', '[aria-label="Metin kutusu"]', '[data-tooltip="Metin kutusu"]', '[data-tooltip="Text box"]'];
        return selectors.some(sel => document.querySelector(sel) !== null);
      }, { timeout: 60000 });

      // Clear selection by clicking on the top-left area of the canvas banner
      console.log("🧹 Deselecting any active elements by clicking banner area...");
      await editorPage.mouse.click(300, 150);
      await editorPage.keyboard.press('Escape');
      await editorPage.keyboard.press('Escape');
      await editorPage.waitForTimeout(1000);

      console.log("✍️ Inserting native text box...");
      const textBoxClicked = await editorPage.evaluate(() => {
        const selectors = ['[aria-label="Text box"]', '[aria-label="Metin kutusu"]', '[data-tooltip="Metin kutusu"]', '[data-tooltip="Text box"]'];
        for (const sel of selectors) {
          const el = document.querySelector(sel) as HTMLElement;
          if (el) { el.click(); return true; }
        }
        return false;
      });

      if (!textBoxClicked) {
        const buttons = await editorPage.$$('button');
        for (const btn of buttons) {
          const btnText = await editorPage.evaluate((el: any) => el.textContent, btn);
          if (btnText?.toLowerCase().includes('text box') || btnText?.toLowerCase().includes('metin kutusu')) {
            await btn.click();
            break;
          }
        }
      }

      await editorPage.waitForTimeout(4000);

      // Generate article text
      const neighbors = ISTANBUL_NEIGHBORS[site.district.toLowerCase()] || [];
      const articleText = generateArticleText(site.district, neighbors);

      console.log(`✍️ Inserting SEO article (${articleText.length} chars)...`);
      await editorPage.keyboard.insertText(articleText);
      await editorPage.waitForTimeout(5000);

      console.log("📡 Publishing changes...");
      const publishBtn = editorPage.locator('div[role="button"]:has-text("Yayınla"), div[role="button"]:has-text("Publish")');
      if (await publishBtn.count() > 0) {
        await publishBtn.first().click();
        await editorPage.waitForTimeout(6000);

        const confirmed = await editorPage.evaluate(() => {
          const els = Array.from(document.querySelectorAll('button, div[role="button"]'));
          const matches = els.filter(el => {
            const txt = el.textContent?.trim().toLowerCase() || '';
            return txt.includes('yayınla') || txt.includes('publish');
          }) as HTMLElement[];

          if (matches.length > 0) {
            const lastBtn = matches[matches.length - 1];
            lastBtn.click();
            return true;
          }
          return false;
        });

        if (confirmed) {
          await editorPage.waitForTimeout(10000);
          console.log(`✅ Successfully enriched and published ${site.district}!`);
        } else {
          console.warn("⚠️ Confirmation publish button was not found or not visible.");
        }
      } else {
        console.warn("⚠️ Publish button was not found.");
      }

      // Close the extra editor tab if opened
      if (editorPage !== page) {
        await editorPage.close();
        await page.bringToFront();
      }

      console.log("⏳ Cooling down for 5 seconds...");
      await page.waitForTimeout(5000);
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("💥 Enrichment loop encountered an error:", msg);
  } finally {
    await browserContext.close();
    console.log("🛑 [HYDRA-ENRICHER] Run completed.");
  }
}

if (require.main === module) {
  enrichSites().catch(console.error);
}
