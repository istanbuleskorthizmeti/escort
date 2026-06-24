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
    
    const robotsUrl = 'https://search.google.com/search-console/settings/robots-txt?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F';
    console.log(`Navigating to: ${robotsUrl}`);
    try {
      await targetPage.goto(robotsUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    } catch (e: any) {
      console.log("Navigation warning/timeout (ignored):", e.message);
    }
    console.log("Waiting 8 seconds for page load...");
    await targetPage.waitForTimeout(8000);
    
    // Find the row with robots.txt URL and click it
    console.log("Locating robots.txt table row...");
    const row = targetPage.locator('td:has-text("robots.txt"), span:has-text("robots.txt"), div:has-text("robots.txt")').first();
    if (await row.count() > 0) {
      console.log("Found row! Clicking...");
      await row.click();
      
      console.log("Waiting 5 seconds for cached content page to load...");
      await targetPage.waitForTimeout(5000);
      
      await targetPage.screenshot({ 
        path: path.join(process.cwd(), 'gsc-cached-robots-content.png'),
        timeout: 10000,
        animations: 'disabled'
      });
      console.log("📸 Saved gsc-cached-robots-content.png");
      
      const contentText = await targetPage.evaluate(() => document.body.innerText);
      fs.writeFileSync('gsc-cached-robots-content.txt', contentText);
      console.log("Saved gsc-cached-robots-content.txt");
    } else {
      console.log("❌ Could not find robots.txt row!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
