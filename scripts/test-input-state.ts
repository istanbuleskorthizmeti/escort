import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

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

    console.log("Locating input...");
    const input = page.locator('input[aria-label*="Site haritası"]').first();
    console.log("Input count:", await input.count());
    
    // Clear input
    await input.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(500);

    // Type sitemap.xml
    console.log("Typing 'sitemap.xml'...");
    await page.keyboard.type('sitemap.xml', { delay: 100 });
    await page.waitForTimeout(1000);

    // Print button outerHTML
    const submitBtn = page.locator('div[role="button"]:has-text("Gönder"):visible, span:has-text("Gönder"):visible').first();
    console.log("Submit button outerHTML:", await submitBtn.evaluate((el: any) => el.outerHTML));
    console.log("Submit button textContent:", await submitBtn.innerText());
    console.log("Submit button disabled status (aria-disabled):", await submitBtn.getAttribute('aria-disabled'));

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
