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
      console.log("GSC page not found in open tabs. Opening a new tab...");
      if (contexts.length > 0) {
        targetPage = await contexts[0].newPage();
      } else {
        console.error("❌ No browser contexts found!");
        return;
      }
    }
    
    console.log(`🎯 Found page: ${targetPage.url()}`);
    await targetPage.bringToFront();
    
    const inspectUrl = 'https://search.google.com/search-console/inspect?resource_id=https:%2F%2Fistanbul-eskort-hizmeti.readme.io%2F&url=https:%2F%2Fistanbul-eskort-hizmeti.readme.io%2Fsitemap.xml';
    console.log(`Navigating to: ${inspectUrl}`);
    try {
      await targetPage.goto(inspectUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
    } catch (e: any) {
      console.log("Navigation warning/timeout (ignored):", e.message);
    }
    console.log("Waiting 8 seconds for page load...");
    await targetPage.waitForTimeout(8000);
    
    // Look for "CANLI TEST" or "TEST LIVE URL" button
    console.log("Locating Live Test button...");
    const liveTestBtn = targetPage.locator('text=CANLI TEST, text=CANLI TESTİ GÖRÜNTÜLE, text=TEST LIVE URL').first();
    if (await liveTestBtn.count() > 0) {
      console.log("Found Live Test button! Clicking...");
      await liveTestBtn.click();
      
      console.log("Waiting 65 seconds for Live Test to finish...");
      await targetPage.waitForTimeout(65000);
      
      await targetPage.screenshot({ 
        path: path.join(process.cwd(), 'gsc-sitemap-livetest.png'),
        timeout: 10000,
        animations: 'disabled'
      });
      console.log("📸 Saved gsc-sitemap-livetest.png");
      
      const liveText = await targetPage.evaluate(() => document.body.innerText);
      fs.writeFileSync('gsc-sitemap-livetest.txt', liveText);
      console.log("Saved gsc-sitemap-livetest.txt");
    } else {
      console.log("❌ Live Test button not found!");
      // Take screenshot anyway to see why
      await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemap-inspect-no-btn.png') });
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
