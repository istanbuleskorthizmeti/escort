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
    
    const sitemapsUrl = 'https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F';
    console.log(`Navigating to: ${sitemapsUrl}`);
    try {
      await targetPage.goto(sitemapsUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    } catch (e: any) {
      console.log("Navigation warning/timeout (ignored):", e.message);
    }
    console.log("Waiting 8 seconds for page load...");
    await targetPage.waitForTimeout(8000);
    
    // Save inner text
    const text = await targetPage.evaluate(() => document.body.innerText);
    fs.writeFileSync('gsc-check-sitemaps.txt', text);
    console.log("Saved gsc-check-sitemaps.txt");
    
    // Take screenshot with animations disabled and low timeout to avoid font hanging
    try {
      await targetPage.screenshot({ 
        path: path.join(process.cwd(), 'gsc-check-sitemaps.png'),
        timeout: 10000,
        animations: 'disabled'
      });
      console.log("📸 Saved gsc-check-sitemaps.png");
    } catch (e: any) {
      console.log("Screenshot warning/timeout (ignored):", e.message);
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
