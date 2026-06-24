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
    
    const homeUrl = 'https://search.google.com/search-console?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F';
    console.log(`Navigating to GSC home: ${homeUrl}`);
    try {
      await targetPage.goto(homeUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    } catch (e: any) {
      console.log("Navigation warning/timeout (ignored):", e.message);
    }
    console.log("Waiting 8 seconds for page load...");
    await targetPage.waitForTimeout(8000);
    
    // Find the inspection search input
    console.log("Locating top inspection search bar...");
    const searchInput = targetPage.locator('input.Ax4B8.ZAGvjd').first();
    if (await searchInput.count() > 0) {
      console.log("Found search bar! Clicking and typing...");
      await searchInput.click();
      await targetPage.waitForTimeout(500);
      await searchInput.fill('https://istanbul-eskort-hizmeti.readme.io/docs/istanbul-avcilar-escort');
      await targetPage.waitForTimeout(500);
      await targetPage.keyboard.press('Enter');
      
      console.log("Waiting 20 seconds for inspection retrieval...");
      await targetPage.waitForTimeout(20000);
      
      await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-inspection-retrieved.png'), timeout: 10000, animations: 'disabled' });
      console.log("📸 Saved gsc-inspection-retrieved.png");
      
      // Look for "CANLI TEST" or "TEST LIVE URL" button using case-insensitive 'TEST' word matching
      console.log("Locating Live Test button...");
      const liveTestBtn = targetPage.locator('div[role="button"]:has-text("TEST"), button:has-text("TEST"), span:has-text("TEST")').first();
      if (await liveTestBtn.count() > 0) {
        console.log("Found Live Test button! Clicking...");
        await liveTestBtn.click();
        
        console.log("Waiting 65 seconds for Live Test to finish...");
        await targetPage.waitForTimeout(65000);
        
        await targetPage.screenshot({ 
          path: path.join(process.cwd(), 'gsc-sitemap-inspection-live.png'),
          timeout: 10000,
          animations: 'disabled'
        });
        console.log("📸 Saved gsc-sitemap-inspection-live.png");
        
        const liveText = await targetPage.evaluate(() => document.body.innerText);
        fs.writeFileSync('gsc-sitemap-inspection-live.txt', liveText);
        console.log("Saved gsc-sitemap-inspection-live.txt");
      } else {
        console.log("❌ Live Test button not found!");
      }
    } else {
      console.log("❌ Inspection search bar not found!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
