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

      // Print input state BEFORE typing
      console.log("Before typing - Input value attribute:", await input.getAttribute('value'));
      console.log("Before typing - Input HTML:", await input.evaluate((el: any) => el.outerHTML));

      // Physically type it key-by-key
      console.log("Physically typing 'sitemap.xml'...");
      await input.focus();
      for (const char of 'sitemap.xml') {
        await page.keyboard.type(char, { delay: 100 });
      }
      await page.waitForTimeout(1000);

      // Print input state AFTER typing
      console.log("After typing - Input value attribute:", await input.getAttribute('value'));
      console.log("After typing - Input HTML:", await input.evaluate((el: any) => el.outerHTML));

      // Print submit button state
      // Find the button by checking textContent matching "Gönder" exactly
      const submitBtn = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('div[role="button"]'));
        const btn = buttons.find(b => b.textContent?.trim().toLowerCase() === 'gönder');
        return btn ? {
          outerHTML: btn.outerHTML,
          className: btn.className,
          ariaDisabled: btn.getAttribute('aria-disabled')
        } : null;
      });

      console.log("Submit button state:", JSON.stringify(submitBtn, null, 2));

      await page.screenshot({ path: path.join(process.cwd(), 'gsc-debug-input-sync.png') });
      console.log("📸 Saved gsc-debug-input-sync.png");
    } else {
      console.log("❌ Sitemap input not found!");
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
