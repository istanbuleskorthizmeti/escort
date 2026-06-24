import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

const ROOT_PROPERTY_URL = 'https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F';

async function run() {
  console.log("🔗 Connecting to Chrome...");
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page: any = null;
    for (const context of contexts) {
      const pages = context.pages();
      for (const p of pages) {
        if (p.url().includes('search.google.com/search-console')) {
          page = p;
          break;
        }
      }
      if (page) break;
    }
    if (!page) {
      console.error("❌ GSC page not found!");
      return;
    }

    console.log("Navigating to GSC sitemaps page...");
    await page.goto(ROOT_PROPERTY_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    await page.keyboard.press('Escape');

    console.log("Locating input...");
    const input = page.locator('input[placeholder*="Site haritası"]:visible, input[aria-label*="Site haritası"]:visible').first();
    if (await input.count() > 0) {
      console.log("Input found. Focusing and typing...");
      await input.click({ force: true });
      await page.waitForTimeout(500);
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(500);

      // Type the sitemap name character by character
      await page.keyboard.type('sitemap.xml', { delay: 150 });
      await page.waitForTimeout(1000);

      console.log("Pressing Enter...");
      await page.keyboard.press('Enter');
      console.log("Waiting 15 seconds for submission to complete...");
      await page.waitForTimeout(15000);

      await page.screenshot({ path: path.join(process.cwd(), 'gsc-submit-enter-success.png') });
      console.log("📸 Saved gsc-submit-enter-success.png");

      // Dismiss success modal if present
      const dismissBtn = page.locator('text=ANLADIM, text=Kapat, text=TAMAM, button:has-text("ANLADIM")').first();
      if (await dismissBtn.count() > 0) {
        console.log("Dismissing success modal...");
        await dismissBtn.click({ force: true });
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(process.cwd(), 'gsc-submit-enter-final.png') });
        console.log("📸 Saved gsc-submit-enter-final.png");
      }
    } else {
      console.log("❌ Sitemap input not found!");
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
