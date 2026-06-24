import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🔗 Connecting to existing Chrome instance on port 9222...");
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    
    let targetPage: any = null;
    
    for (const context of contexts) {
      const pages = context.pages();
      for (const page of pages) {
        const url = page.url();
        if (url.includes('search.google.com/search-console')) {
          targetPage = page;
          break;
        }
      }
      if (targetPage) break;
    }
    
    if (!targetPage) {
      console.error("❌ Google Search Console page not found in active browser tabs!");
      await browser.close();
      return;
    }
    
    console.log(`🎯 Found GSC page. Navigating to URL Inspection for the sitemap...`);
    const inspectUrl = 'https://search.google.com/search-console/inspect?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F&id=ws4_0Y3dev89i7EvYE0SIA';
    await targetPage.goto(inspectUrl, { waitUntil: 'networkidle', timeout: 45000 });
    await targetPage.waitForTimeout(5000);
    
    console.log("Searching for the URL input box...");
    const searchInput = targetPage.locator('input[type="text"], input[placeholder*="URL"], input[aria-label*="URL"]');
    if (await searchInput.count() > 0) {
      console.log("Entering sitemap URL...");
      await searchInput.first().click();
      await targetPage.keyboard.press('Control+A');
      await targetPage.keyboard.press('Backspace');
      await searchInput.first().fill('https://istanbul-eskort-hizmeti.readme.io/sitemap.xml');
      await targetPage.waitForTimeout(1000);
      await targetPage.keyboard.press('Enter');
      
      console.log("Submitted URL. Waiting 10 seconds for initial indexed status...");
      await targetPage.waitForTimeout(10000);
      
      console.log("Looking for the 'Canlı URL'yi test et' button...");
      const testLiveBtn = targetPage.getByText("Canlı URL'yi test et");
      
      if (await testLiveBtn.count() > 0) {
        console.log("Found button. Clicking it...");
        await testLiveBtn.first().click();
        
        console.log("Testing Live URL... This takes up to 2 minutes. Waiting in intervals...");
        for (let i = 0; i < 12; i++) {
          await targetPage.waitForTimeout(10000);
          console.log(`Waiting... ${10 * (i + 1)} seconds elapsed.`);
          await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-inspect-sitemap-live-testing.png') });
        }
        
        console.log("Live test should be complete. Waiting 5 more seconds...");
        await targetPage.waitForTimeout(5000);
        
        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-inspect-sitemap-live-result.png') });
        console.log("📸 Saved gsc-inspect-sitemap-live-result.png");
        
        // Save DOM text
        const text = await targetPage.evaluate(() => document.body.innerText);
        fs.writeFileSync('gsc-live-text.txt', text);
        console.log("Saved live test body text to gsc-live-text.txt");
        
        // Output relevant lines
        const lines = text.split('\n');
        console.log("=== LIVE TEST RESULTS ===");
        for (const line of lines) {
          if (line.includes('Crawl') || line.includes('Tarama') || line.includes('HTTP') || line.includes('hata') || line.includes('kullanılabilir') || line.includes('geliştirilmiş') || line.includes('taranabilir') || line.includes('Dizin')) {
            console.log(line);
          }
        }
      } else {
        console.log("❌ 'Canlı URL'yi test et' button not found!");
      }
    } else {
      console.log("❌ Search input not found!");
    }
  } catch (err: any) {
    console.error("❌ Error in live inspect script:", err.message);
  }
}

run();
