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
    
    const detailsUrl = 'https://search.google.com/search-console/sitemaps/info-drilldown?resource_id=https:%2F%2Fistanbul-eskort-hizmeti.readme.io%2F&sitemap=https:%2F%2Fistanbul-eskort-hizmeti.readme.io%2Fsitemap.xml';
    console.log(`Navigating to: ${detailsUrl}`);
    try {
      await targetPage.goto(detailsUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    } catch (e: any) {
      console.log("Navigation warning/timeout (ignored):", e.message);
    }
    console.log("Waiting 8 seconds for page load...");
    await targetPage.waitForTimeout(8000);
    
    // Find the error expand row and click it
    console.log("Locating error row for click...");
    const errorRow = targetPage.locator('text=Genel HTTP hatası').first();
    if (await errorRow.count() > 0) {
      console.log("Found error row! Clicking...");
      await errorRow.click();
      await targetPage.waitForTimeout(3000);
      
      await targetPage.screenshot({ 
        path: path.join(process.cwd(), 'gsc-sitemap-details-expanded.png'),
        timeout: 10000,
        animations: 'disabled'
      });
      console.log("📸 Saved gsc-sitemap-details-expanded.png");
      
      const expandedText = await targetPage.evaluate(() => document.body.innerText);
      fs.writeFileSync('gsc-sitemap-details-expanded.txt', expandedText);
    } else {
      console.log("❌ Could not find the 'Genel HTTP hatası' row!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
