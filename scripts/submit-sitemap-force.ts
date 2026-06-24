import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🔗 Connecting to CDP...");
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
    
    // Save screenshot
    await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-fresh-load.png') });
    
    // Let's find all text inputs on this page
    const inputs = await targetPage.evaluate(() => {
      return Array.from(document.querySelectorAll('input')).map((input: any) => ({
        type: input.type,
        placeholder: input.placeholder || '',
        value: input.value || '',
        outerHTML: input.outerHTML
      }));
    });
    console.log("Inputs found on page:", inputs);
    
    // We want the input that is inside the "Yeni bir site haritası ekleyin" section
    // GSC sitemap input has placeholder like "Site haritası URL'sini girin"
    let sitemapInputSelector = '';
    
    // Let's find by placeholder
    const gscSitemapInput = targetPage.locator('input[placeholder*="Site haritası"], input[aria-label*="Site haritası"]');
    if (await gscSitemapInput.count() > 0) {
      console.log("Found sitemap input by placeholder!");
      await gscSitemapInput.first().click();
      await targetPage.keyboard.press('Control+A');
      await targetPage.keyboard.press('Backspace');
      await gscSitemapInput.first().fill('sitemap.xml');
      await targetPage.waitForTimeout(1000);
      
      const submitBtn = targetPage.locator('text=GÖNDER');
      if (await submitBtn.count() > 0) {
        console.log("Clicking GÖNDER button...");
        await submitBtn.first().click();
        console.log("Submitted! Waiting 15 seconds...");
        await targetPage.waitForTimeout(15000);
        
        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-after-submit.png') });
        console.log("📸 Saved gsc-sitemaps-after-submit.png");
        
        const afterText = await targetPage.evaluate(() => document.body.innerText);
        fs.writeFileSync('gsc-sitemaps-after-submit.txt', afterText);
        
        // Let's dismiss popup if present
        const dismissBtn = targetPage.locator('text=ANLADIM');
        if (await dismissBtn.count() > 0) {
          console.log("Dismissing popup...");
          await dismissBtn.first().click();
          await targetPage.waitForTimeout(2000);
          await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-final.png') });
        }
      } else {
        console.log("❌ Submit button GÖNDER not found!");
      }
    } else {
      console.log("❌ Could not locate GSC sitemap input!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
