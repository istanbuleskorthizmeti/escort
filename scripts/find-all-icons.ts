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

    const iconsData = await page.evaluate(() => {
      const icons = Array.from(document.querySelectorAll('mat-icon, button, [role="button"]'));
      return icons.map(el => {
        return {
          tagName: el.tagName,
          className: el.className,
          ariaLabel: el.getAttribute('aria-label'),
          textContent: el.textContent?.trim() || '',
          outerHTML: el.outerHTML.substring(0, 300)
        };
      });
    });

    console.log("=== ALL ICONS AND BUTTONS ===");
    console.log(JSON.stringify(iconsData, null, 2));

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
