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
    
    // Select the specific sitemap input by its unique label
    const input = targetPage.locator('input[aria-label*="Site haritası URL\'sini girin"], input[aria-label*="Site haritası URL\'sini"]').first();
    console.log("Locating the specific sitemap input field...");
    if (await input.count() > 0) {
      console.log("Found sitemap input field. Clicking and filling...");
      await input.click();
      await targetPage.waitForTimeout(500);
      await input.fill('sitemap.xml');
      await targetPage.waitForTimeout(1000);
      
      // Select the submit button inside the sitemap card
      const submitBtn = targetPage.locator('div.IJefve div[role="button"], div[role="button"]:has-text("Gönder")').first();
      if (await submitBtn.count() > 0) {
        console.log("Found submit button! Clicking...");
        await submitBtn.click();
        
        console.log("Waiting 15 seconds for submission response...");
        await targetPage.waitForTimeout(15000);
        
        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-final-submitted.png') });
        console.log("📸 Saved gsc-sitemaps-final-submitted.png");
        
        const afterText = await targetPage.evaluate(() => document.body.innerText);
        fs.writeFileSync('gsc-sitemaps-final-submitted.txt', afterText);
        
        // Check for dismiss popup
        const dismissBtn = targetPage.locator('text=ANLADIM, text=Kapat, text=TAMAM').first();
        if (await dismissBtn.count() > 0) {
          console.log("Dismissing modal dialog...");
          await dismissBtn.click();
          await targetPage.waitForTimeout(2000);
          await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-final-ok.png') });
        }
      } else {
        console.log("❌ Submit button 'Gönder' not found!");
      }
    } else {
      console.log("❌ Sitemap input field not found!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
