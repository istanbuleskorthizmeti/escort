import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');

async function testEditor() {
  console.log("🚀 [DIAGNOSTIC] Launching Chrome in non-headless mode...");
  const chromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";
  
  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
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

  const page = await browserContext.newPage();
  
  // Try to load one of the Google Sites editor URLs
  const siteUrl = "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/edit";
  console.log(`📡 Loading editor: ${siteUrl}`);
  
  await page.goto(siteUrl, { waitUntil: 'load', timeout: 120000 });
  await page.waitForTimeout(10000); // Wait 10 seconds to inspect visually and check redirection

  // 1. Add Native Text Box (Indexable Local SEO Content)
  console.log("✍️ Adding native Text Box for SEO article...");
  const textBoxClicked = await page.evaluate(() => {
    const selectors = ['[aria-label="Text box"]', '[aria-label="Metin kutusu"]', '[data-tooltip="Metin kutusu"]', '[data-tooltip="Text box"]'];
    for (const sel of selectors) {
      const el = document.querySelector(sel) as HTMLElement;
      if (el) { el.click(); return true; }
    }
    return false;
  });
  if (!textBoxClicked) {
    console.warn("⚠️ Could not find Text box button via selectors, trying button element search...");
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const btnText = await page.evaluate((el: any) => el.textContent, btn);
      if (btnText?.toLowerCase().includes('text box') || btnText?.toLowerCase().includes('metin kutusu')) {
        await btn.click();
        break;
      }
    }
  }
  await page.waitForTimeout(4000);

  // Type article text into active text editor
  const articleText = "Sefaköy Escort Hizmeti - VIP ve Kaporasız Partnerler 2026\n\n" +
         "Sefaköy genelinde kaporasız, ön ödemesiz ve tamamen adreste elden ödemeli çalışan bireysel escort partnerlerin güncel listesine ulaşmak için doğru yerdesiniz. " +
         "Tamamı teyitli ve gerçek görsellerden oluşan elit refakatçi alternatiflerimiz, siz değerli misafirlerimize unutulmaz anlar yaşatmak için hazırdır.\n\n" +
         "Anahtar Kelimeler:\n" +
         "sefaköy escort, sefaköy eskort, kaporasız sefaköy escort.";
  
  console.log(`✍️ Typing SEO article into native text box (${articleText.length} chars)...`);
  await page.keyboard.type(articleText, { delay: 10 });
  await page.waitForTimeout(5000);

  console.log("📡 Clicking Publish (Yayınla) button...");
  const publishBtn = page.locator('div[role="button"]:has-text("Yayınla"), div[role="button"]:has-text("Publish")');
  if (await publishBtn.count() > 0) {
    await publishBtn.first().click();
    await page.waitForTimeout(4000);
    
    const confirmBtn = page.locator('div[role="button"]:has-text("Yayınla"), div[role="button"]:has-text("Publish")').last();
    if (await confirmBtn.count() > 0 && await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await page.waitForTimeout(10000); // Wait for publish
      console.log("🚀 Published successfully!");
    }
  }

  console.log("📸 Editor test complete. Closing browser...");
  await browserContext.close();
}

testEditor();
