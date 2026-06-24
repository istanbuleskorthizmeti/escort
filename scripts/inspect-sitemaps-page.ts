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

    const data = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const buttons = Array.from(document.querySelectorAll('button, [role="button"], [type="submit"]'));
      
      return {
        inputs: inputs.map(el => ({
          placeholder: el.placeholder,
          value: el.value,
          outerHTML: el.outerHTML.substring(0, 200)
        })),
        buttons: buttons.map(el => ({
          text: el.textContent?.trim() || '',
          ariaLabel: el.getAttribute('aria-label') || '',
          className: el.className,
          outerHTML: el.outerHTML.substring(0, 200)
        }))
      };
    });

    console.log("=== GSC SITEMAPS PAGE ELEMENTS ===");
    console.log(JSON.stringify(data, null, 2));

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
