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
  
  for (const page of pages) {
    const url = page.url();
    const title = await page.title().catch(() => 'Untitled');
    console.log(`- Page: URL="${url}" | Title="${title}"`);
    
    // Close pages that are not the original Gmail or ReadMe doc pages
    // Keep: mail.google.com main tab, readme.io main docs tab, google search console tab
    const shouldKeep = 
      (url.includes('mail.google.com') && !url.includes('#search/')) ||
      url.includes('search.google.com') ||
      url.includes('readme.io/docs/getting-started') ||
      url === 'about:blank';
      
    if (!shouldKeep && pages.length > 2) {
      console.log(`  🗑️ Closing page: ${url}`);
      await page.close().catch(() => {});
    }
  }

  await browser.close();
  console.log("✅ Cleanup completed!");
}

run().catch(console.error);
