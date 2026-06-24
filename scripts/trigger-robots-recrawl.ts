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
    
    // Locate the more_vert button (three dots menu)
    console.log("Locating the three-dots menu button...");
    const moreVertBtn = targetPage.locator('button:has-text("more_vert"), [aria-label*="Seçenekler"], [aria-label*="Options"], .internal-toy-class-or-icon').first();
    // Alternatively, let's find the element containing 'more_vert' text
    const genericMoreVert = targetPage.locator('text=more_vert').first();
    
    let btnToClick = null;
    if (await genericMoreVert.count() > 0) {
      btnToClick = genericMoreVert;
    } else if (await moreVertBtn.count() > 0) {
      btnToClick = moreVertBtn;
    }
    
    if (btnToClick) {
      console.log("Found more_vert button! Clicking...");
      await btnToClick.click();
      await targetPage.waitForTimeout(2000);
      
      // Save screenshot of menu
      await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-robots-menu-opened.png'), timeout: 10000 });
      console.log("📸 Saved gsc-robots-menu-opened.png");
      
      // Locate the Recrawl menu item
      // In Turkish: "Yeniden tarama isteğinde bulun"
      console.log("Locating 'Yeniden' menu item...");
      const recrawlItem = targetPage.locator('text=/Yeniden/').first();
      if (await recrawlItem.count() > 0) {
        console.log("Found recrawl option! Clicking...");
        await recrawlItem.click();
        
        console.log("Waiting 10 seconds for request completion...");
        await targetPage.waitForTimeout(10000);
        
        await targetPage.screenshot({ 
          path: path.join(process.cwd(), 'gsc-robots-recrawl-result.png'),
          timeout: 10000,
          animations: 'disabled'
        });
        console.log("📸 Saved gsc-robots-recrawl-result.png");
        
        const resText = await targetPage.evaluate(() => document.body.innerText);
        fs.writeFileSync('gsc-robots-recrawl-result.txt', resText);
        console.log("Saved gsc-robots-recrawl-result.txt");
      } else {
        console.log("❌ Could not find recrawl menu item!");
      }
    } else {
      console.log("❌ Could not find three-dots menu button!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
