import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  if (contexts.length === 0) {
    console.error("❌ No contexts found!");
    return;
  }

  const context = contexts[0];
  const pages = context.pages();
  console.log(`📋 Total open pages: ${pages.length}`);

  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    try {
      const url = p.url();
      const title = await p.title().catch(() => '');
      console.log(`Tab #${i}: URL="${url}" | Title="${title}"`);
    } catch (err: any) {
      console.error(`Tab #${i} error:`, err.message);
    }
  }
}

run().catch(console.error);
