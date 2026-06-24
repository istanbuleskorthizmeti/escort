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
    
    console.log(`🎯 Found page: ${targetPage.url()}`);
    await targetPage.bringToFront();
    
    const sitemapsUrl = 'https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F';
    console.log(`Navigating to: ${sitemapsUrl}`);
    try {
      await targetPage.goto(sitemapsUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    } catch (e: any) {
      console.log("Navigation timeout (ignored):", e.message);
    }
    console.log("Waiting 5 seconds for page load...");
    await targetPage.waitForTimeout(5000);
    
    // Set value via page evaluate
    console.log("Injecting sitemap value via JS...");
    const success = await targetPage.evaluate(() => {
      const input = document.querySelector('input[placeholder*="Site haritası"], input[aria-label*="Site haritası"]') as HTMLInputElement;
      if (input) {
        input.value = 'sitemap.xml';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      return false;
    });
    
    if (success) {
      console.log("Sitemap value injected successfully.");
      await targetPage.waitForTimeout(1000);
      
      // Take screenshot to see if GÖNDER button is enabled
      await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-injected.png') });
      
      const submitBtn = targetPage.locator('text=GÖNDER');
      if (await submitBtn.count() > 0) {
        console.log("Clicking GÖNDER button...");
        await submitBtn.first().click({ force: true });
        
        console.log("Waiting 15 seconds for submission response...");
        await targetPage.waitForTimeout(15000);
        
        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-injected-submitted.png') });
        console.log("📸 Saved gsc-sitemaps-injected-submitted.png");
        
        const text = await targetPage.evaluate(() => document.body.innerText);
        fs.writeFileSync('gsc-sitemaps-injected-submitted.txt', text);
        
        // Try to dismiss popup
        const dismissBtn = targetPage.locator('text=ANLADIM');
        if (await dismissBtn.count() > 0) {
          console.log("Dismissing popup...");
          await dismissBtn.first().click({ force: true });
          await targetPage.waitForTimeout(2000);
          await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-injected-final.png') });
        }
      } else {
        console.log("❌ Submit button GÖNDER not found!");
      }
    } else {
      console.log("❌ Failed to find sitemap input via JS!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
