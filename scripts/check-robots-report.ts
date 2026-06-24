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
    
    // Save inner text
    const text = await targetPage.evaluate(() => document.body.innerText);
    fs.writeFileSync('gsc-robots-settings-details.txt', text);
    console.log("Saved gsc-robots-settings-details.txt");
    
    await targetPage.screenshot({ 
      path: path.join(process.cwd(), 'gsc-robots-settings-details.png'),
      timeout: 10000,
      animations: 'disabled'
    });
    console.log("📸 Saved gsc-robots-settings-details.png");
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
