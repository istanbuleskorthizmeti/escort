import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🔗 Connecting to Chrome...");
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page: any = null;
    for (const context of contexts) {
      const pages = context.pages();
      for (const p of pages) {
        if (p.url().includes('search.google.com/search-console')) {
          page = p;
          break;
        }
      }
      if (page) break;
    }
    if (!page) {
      console.log("Opening new Search Console tab...");
      if (contexts.length > 0) {
        page = await contexts[0].newPage();
      } else {
        console.error("❌ No contexts!");
        return;
      }
    }

    console.log("Navigating to GSC sitemaps page...");
    await page.goto('https://search.google.com/search-console/sitemaps', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch((e: any) => {
      console.log("Navigation warning (ignored):", e.message);
    });
    await page.waitForTimeout(5000);

    // Escape any popup/modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    console.log("Opening property selector...");
    await page.click('#resource-selector-container');
    await page.waitForTimeout(2000);

    console.log("Searching for the correct root property option in the dropdown...");
    // Find all div elements with role="option" or data-value that match the domain and don't contain docs or sitemap.xml
    const options = page.locator('[role="option"], [data-value]');
    const count = await options.count();
    console.log(`Found ${count} property options in dropdown.`);
    
    let correctOptionClicked = false;
    for (let i = 0; i < count; i++) {
      const option = options.nth(i);
      const text = await option.innerText();
      const cleanText = text.replace(/\s+/g, ' ').trim();
      
      // We want exactly "https://istanbul-eskort-hizmeti.readme.io/"
      if (cleanText === 'https://istanbul-eskort-hizmeti.readme.io/') {
        console.log(`🎯 Found correct root property option: "${cleanText}". Clicking...`);
        await option.click();
        correctOptionClicked = true;
        break;
      }
    }

    if (!correctOptionClicked) {
      console.log("⚠️ Could not find exact match in options list. Trying fallback filters...");
      // Try locator filters
      const fallbackOption = page.locator('[role="option"]:has-text("https://istanbul-eskort-hizmeti.readme.io/"):not(:has-text("docs")):not(:has-text("sitemap.xml"))').first();
      if (await fallbackOption.count() > 0) {
        console.log("🎯 Found correct option using fallback filters. Clicking...");
        await fallbackOption.click();
        correctOptionClicked = true;
      } else {
        console.error("❌ Failed to find the root property option in the dropdown!");
        await page.screenshot({ path: path.join(process.cwd(), 'gsc-dropdown-failed.png') });
        return;
      }
    }

    console.log("Waiting 6 seconds for the property sitemaps page to load...");
    await page.waitForTimeout(6000);

    // Escape any modals again
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-root-loaded.png') });
    console.log("📸 Saved gsc-sitemaps-root-loaded.png");

    // Select the visible input
    const input = page.locator('input[placeholder*="Site haritası"]:visible, input[aria-label*="Site haritası"]:visible').first();
    if (await input.count() > 0) {
      console.log("Found sitemap input. Typing 'sitemap.xml'...");
      await input.click();
      await page.waitForTimeout(500);
      await input.fill('sitemap.xml');
      await page.waitForTimeout(1000);
      
      const submitBtn = page.locator('div[role="button"]:has-text("Gönder"):visible, span:has-text("Gönder"):visible, div[role="button"]:has-text("GÖNDER"):visible, span:has-text("GÖNDER"):visible').first();
      if (await submitBtn.count() > 0) {
        console.log("Clicking submit button...");
        await submitBtn.click();
        
        console.log("Waiting 15 seconds for submission to complete...");
        await page.waitForTimeout(15000);
        
        await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-root-submit-success.png') });
        console.log("📸 Saved gsc-sitemaps-root-submit-success.png");
        
        // Dismiss popup modal
        const dismissBtn = page.locator('text=ANLADIM, text=Kapat, text=TAMAM').first();
        if (await dismissBtn.count() > 0) {
          console.log("Dismissing success modal...");
          await dismissBtn.click();
          await page.waitForTimeout(2000);
        }
      } else {
        console.log("❌ Could not find the submit button!");
      }
    } else {
      console.log("❌ Could not find the visible sitemap input field!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
