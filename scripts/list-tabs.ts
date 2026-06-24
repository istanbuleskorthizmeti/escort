import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔗 Connecting...");
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    console.log(`Found ${contexts.length} contexts.`);
    for (let cIdx = 0; cIdx < contexts.length; cIdx++) {
      const pages = contexts[cIdx].pages();
      console.log(`Context ${cIdx}: ${pages.length} pages.`);
      for (let pIdx = 0; pIdx < pages.length; pIdx++) {
        const page = pages[pIdx];
        console.log(`  - Page ${pIdx}: URL="${page.url()}" Title="${await page.title().catch(() => '')}"`);
      }
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
