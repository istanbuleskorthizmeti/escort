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

    console.log("⚡ PURGING DOM BLOCKING OVERLAYS...");
    await page.evaluate(() => {
      document.querySelectorAll('iframe').forEach(f => f.remove());
      document.querySelectorAll('.KL4X6e, .TuA45b, trans-layer').forEach(el => el.remove());
    });
    await page.waitForTimeout(2000);

    console.log("Locating input...");
    const input = page.locator('input[placeholder*="Site haritası"]:visible, input[aria-label*="Site haritası"]:visible').first();
    if (await input.count() > 0) {
      console.log("Input found. Focusing and clearing...");
      await input.click({ force: true });
      await page.waitForTimeout(500);
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(500);

      // Physically type sitemap.xml character by character
      console.log("Typing 'sitemap.xml'...");
      await input.focus();
      for (const char of 'sitemap.xml') {
        await page.keyboard.type(char, { delay: 100 });
      }
      await page.waitForTimeout(1000);

      console.log("Locating exact submit button...");
      const realSubmitBtn = page.locator('div[role="button"]').filter({ hasText: /^Gönder$/i }).first();
      
      if (await realSubmitBtn.count() > 0) {
        console.log("Found real submit button! HTML:", await realSubmitBtn.evaluate((el: any) => el.outerHTML));
        
        console.log("Clicking real submit button...");
        await realSubmitBtn.click({ force: true });
        
        console.log("Waiting 15 seconds for submission to complete...");
        await page.waitForTimeout(15000);
        
        await page.screenshot({ path: path.join(process.cwd(), 'gsc-real-submit-success.png') });
        console.log("📸 Saved gsc-real-submit-success.png");
        
        // Dismiss success modal if present
        const dismissBtn = page.locator('text=ANLADIM, text=Kapat, text=TAMAM, button:has-text("ANLADIM")').first();
        if (await dismissBtn.count() > 0) {
          console.log("Dismissing success modal...");
          await dismissBtn.click({ force: true });
          await page.waitForTimeout(2000);
          await page.screenshot({ path: path.join(process.cwd(), 'gsc-real-submit-final.png') });
          console.log("📸 Saved gsc-real-submit-final.png");
        }
      } else {
        console.log("❌ Real submit button not found!");
      }
    } else {
      console.log("❌ Sitemap input not found!");
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
