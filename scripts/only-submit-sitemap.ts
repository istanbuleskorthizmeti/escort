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
      console.log("Opening new Search Console tab...");
      if (contexts.length > 0) {
        page = await contexts[0].newPage();
      } else {
        console.error("❌ No contexts!");
        return;
      }
    }

    console.log("Navigating to GSC sitemaps page...");
    await page.goto(ROOT_PROPERTY_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    await page.keyboard.press('Escape');

    console.log("Locating sitemap input...");
    const input = page.locator('input[placeholder*="Site haritası"]:visible, input[aria-label*="Site haritası"]:visible').first();
    if (await input.count() > 0) {
      await input.click();
      await page.waitForTimeout(500);
      
      // Clear input first
      await input.fill('');
      await page.waitForTimeout(500);
      
      console.log("Typing 'sitemap.xml' with delay...");
      await input.focus();
      await page.keyboard.type('sitemap.xml', { delay: 100 });
      await page.waitForTimeout(1000);
      
      console.log("Pressing Enter to submit...");
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      
      console.log("Checking for submit button as fallback...");
      const submitBtn = page.locator('div[role="button"]:has-text("Gönder"):visible, span:has-text("Gönder"):visible, div[role="button"]:has-text("GÖNDER"):visible, span:has-text("GÖNDER"):visible').first();
      if (await submitBtn.count() > 0 && await submitBtn.isEnabled()) {
        console.log("Clicking submit button...");
        await submitBtn.click();
      }
      
      console.log("Waiting 15 seconds for submission to complete...");
      await page.waitForTimeout(15000);
      
      await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-root-only-submit-success.png') });
      console.log("📸 Saved gsc-sitemaps-root-only-submit-success.png");
      
      // Dismiss success modal
      const dismissBtn = page.locator('text=ANLADIM, text=Kapat, text=TAMAM, button:has-text("ANLADIM")').first();
      if (await dismissBtn.count() > 0) {
        console.log("Dismissing success modal...");
        await dismissBtn.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-root-only-submit-final.png') });
      }
    } else {
      console.log("❌ Sitemap input not found!");
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
