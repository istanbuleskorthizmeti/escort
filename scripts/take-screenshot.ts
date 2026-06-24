import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

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
    if (page) {
      console.log(`Current page URL: ${page.url()}`);
      await page.screenshot({ path: path.join(process.cwd(), 'gsc-current-state.png') });
      console.log("📸 Saved gsc-current-state.png");
    } else {
      console.log("❌ No active GSC page found!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
