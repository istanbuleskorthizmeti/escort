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
    await targetPage.goto(sitemapsUrl, { waitUntil: 'networkidle', timeout: 45000 });
    console.log("Waiting 8 seconds for page load...");
    await targetPage.waitForTimeout(8000);
    console.log(`Current URL: ${targetPage.url()}`);
    
    await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-direct.png') });
    console.log("📸 Saved gsc-sitemaps-direct.png");
    
    const bodyText = await targetPage.evaluate(() => document.body.innerText);
    fs.writeFileSync('gsc-sitemaps-direct.txt', bodyText);
    
    const input = targetPage.locator('input[placeholder*="Site haritası"], input[aria-label*="Site haritası"]');
    if (await input.count() > 0) {
      console.log("Found sitemap input box. Entering sitemap.xml...");
      await input.first().click();
      await targetPage.keyboard.press('Control+A');
      await targetPage.keyboard.press('Backspace');
      await input.first().fill('sitemap.xml');
      await targetPage.waitForTimeout(1000);
      
      const submitBtn = targetPage.locator('text=GÖNDER');
      if (await submitBtn.count() > 0) {
        console.log("Clicking GÖNDER...");
        await submitBtn.first().click();
        await targetPage.waitForTimeout(15000);
        
        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-direct-submitted.png') });
        console.log("📸 Saved gsc-sitemaps-direct-submitted.png");
        
        const dismissBtn = targetPage.locator('text=ANLADIM');
        if (await dismissBtn.count() > 0) {
          console.log("Dismissing popup...");
          await dismissBtn.first().click();
          await targetPage.waitForTimeout(2000);
          await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-direct-final.png') });
        }
      }
    } else {
      console.log("❌ Sitemap input box not found on page!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
