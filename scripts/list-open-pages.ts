import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

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
  console.log(`Found ${pages.length} open pages.`);
  
  for (let i = 0; i < pages.length; i++) {
    console.log(`Page ${i}: URL = ${pages[i].url()}, Title = ${await pages[i].title().catch(() => 'no title')}`);
  }

  await browser.close();
}

run().catch(console.error);
