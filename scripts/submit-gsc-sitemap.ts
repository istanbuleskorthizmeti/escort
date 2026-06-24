import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
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
    
    console.log(`🎯 Found GSC page. Navigating to sitemaps dashboard...`);
    const sitemapsUrl = 'https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F';
    await targetPage.goto(sitemapsUrl, { waitUntil: 'networkidle', timeout: 45000 });
    await targetPage.waitForTimeout(5000);
    
    console.log(`Resubmitting sitemap.xml...`);
    await targetPage.bringToFront();
    
    // Find input element for new sitemap
    const input = targetPage.locator('input[type="text"], input[placeholder*="Site haritası"], input[aria-label*="Site haritası"]');
    if (await input.count() > 0) {
      console.log("Found sitemap input box.");
      await input.first().click();
      await targetPage.keyboard.press('Control+A');
      await targetPage.keyboard.press('Backspace');
      await input.first().fill('sitemap.xml');
      await targetPage.waitForTimeout(1000);
      
      // Click submit button (GÖNDER)
      const submitBtn = targetPage.locator('text=GÖNDER');
      if (await submitBtn.count() > 0) {
        console.log("Clicking submit button...");
        await submitBtn.first().click();
        
        console.log("Waiting 10 seconds for submission completion...");
        await targetPage.waitForTimeout(10000);
        
        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemap-submitted.png') });
        console.log("📸 Saved gsc-sitemap-submitted.png");
        
        // Check if there is an "ANLADIM" or "TAMAM" button to dismiss the confirmation popup
        const dismissBtn = targetPage.locator('text=ANLADIM');
        if (await dismissBtn.count() > 0) {
          console.log("Dismissing popup...");
          await dismissBtn.first().click();
          await targetPage.waitForTimeout(2000);
          await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemap-post-submit.png') });
        }
      } else {
        console.log("❌ Submit button not found!");
      }
    } else {
      console.log("❌ Sitemap input box not found!");
    }
    
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
