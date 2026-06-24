import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  for (const ctx of contexts) {
    const pages = ctx.pages();
    for (const p of pages) {
      console.log(`- Title: "${await p.title()}" | URL: ${p.url()}`);
    }
  }

  await browser.close();
}

run().catch(console.error);
