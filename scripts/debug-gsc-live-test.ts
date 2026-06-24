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
        if (page.url().includes('search.google.com/search-console')) {
          targetPage = page;
          break;
        }
      }
      if (targetPage) break;
    }
    if (!targetPage) {
      console.error("❌ Google Search Console page not found!");
      return;
    }
    
    console.log(`🎯 Found GSC page. Checking for popup/modal...`);
    await targetPage.bringToFront();
    
    // Check if "Kapat" (Close) or "Canlı testi göster" button exists
    const closeBtn = targetPage.locator('text=Kapat');
    const showLiveBtn = targetPage.locator('text=Canlı testi göster');
    
    if (await showLiveBtn.count() > 0) {
      console.log("Clicking 'Canlı testi göster'...");
      await showLiveBtn.first().click();
      await targetPage.waitForTimeout(5000);
    } else if (await closeBtn.count() > 0) {
      console.log("Clicking 'Kapat'...");
      await closeBtn.first().click();
      await targetPage.waitForTimeout(2000);
    } else {
      console.log("No modal buttons found.");
    }
    
    await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-live-test-details.png') });
    console.log("📸 Saved gsc-live-test-details.png");
    
    const text = await targetPage.evaluate(() => document.body.innerText);
    fs.writeFileSync('gsc-live-test-details.txt', text);
    console.log("📝 Saved gsc-live-test-details.txt");
    
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
