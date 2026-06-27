import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to browser...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  console.log("Number of contexts:", contexts.length);

  for (let cIdx = 0; cIdx < contexts.length; cIdx++) {
    const context = contexts[cIdx];
    const pages = context.pages();
    console.log(`Context ${cIdx} - Number of pages:`, pages.length);

    for (let pIdx = 0; pIdx < pages.length; pIdx++) {
      const page = pages[pIdx];
      try {
        const url = page.url();
        const title = await page.title().catch(() => 'no title');
        console.log(`Page ${pIdx}: URL=${url}, Title=${title}`);
        
        // If it's a page we don't need, close it to free up resources
        if (pIdx > 0 || url.includes('about:blank')) {
          console.log(`Closing page ${pIdx}...`);
          await page.close();
        }
      } catch (e: any) {
        console.error(`Error on page ${pIdx}:`, e.message);
      }
    }
  }
}

run().catch(console.error);
