import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🔗 Connecting...");
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let targetPage: any = null;
    for (const context of contexts) {
      const pages = context.pages();
      for (const page of pages) {
        if (page.url().includes('search.google.com/search-console/sitemaps')) {
          targetPage = page;
          break;
        }
      }
      if (targetPage) break;
    }
    if (!targetPage) {
      console.error("❌ Google Search Console sitemaps page not found!");
      return;
    }
    
    console.log(`🎯 Found GSC page: "${await targetPage.title()}"`);
    await targetPage.bringToFront();
    await targetPage.waitForTimeout(3000);
    
    await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-page.png') });
    console.log("📸 Saved gsc-sitemaps-page.png");
    
    const bodyText = await targetPage.evaluate(() => document.body.innerText);
    fs.writeFileSync('gsc-sitemaps-text.txt', bodyText);
    console.log("📝 Saved gsc-sitemaps-text.txt");
    
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
