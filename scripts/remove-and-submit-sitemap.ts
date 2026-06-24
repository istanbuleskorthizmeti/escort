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

    // Step 1: Navigate directly to the sitemap details page
    const sitemapDetailsUrl = 'https://search.google.com/search-console/sitemaps/sitemap-details?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F&sitemap_path=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2Fsitemap.xml';
    console.log(`Navigating to sitemap details: ${sitemapDetailsUrl}`);
    await targetPage.goto(sitemapDetailsUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch((e: any) => {
      console.log("Navigation timeout/warning (ignored):", e.message);
    });
    console.log("Waiting 5 seconds for details page load...");
    await targetPage.waitForTimeout(5000);

    // Escape any popup/feedback dialog
    await targetPage.keyboard.press('Escape');
    await targetPage.waitForTimeout(1000);

    // Save initial screenshot
    await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemap-detail-init.png') });
    console.log("📸 Saved gsc-sitemap-detail-init.png");

    // Click on more_vert button (options button)
    console.log("Looking for options menu (more_vert / three dots button)...");
    const optionsBtn = targetPage.locator('button[aria-label*="Seçenek"], button[aria-label*="options"], button:has(mat-icon[string="more_vert"]), [role="button"]:has(mat-icon[string="more_vert"])').first();
    // Fallback locator for the button on the top right
    const optionsBtnFallback = targetPage.locator('mat-card button').first();

    let clicked = false;
    if (await optionsBtn.count() > 0 && await optionsBtn.isVisible()) {
      console.log("Found options button by aria-label/icon!");
      await optionsBtn.click();
      clicked = true;
    } else if (await optionsBtnFallback.count() > 0) {
      console.log("Using fallback locator for options button!");
      await optionsBtnFallback.click();
      clicked = true;
    } else {
      // Direct click on coordinates if we can't locate
      console.log("Could not find button by locator, attempting coordinate-based or general click...");
      const dotsButton = targetPage.locator('mat-icon:has-text("more_vert")').first();
      if (await dotsButton.count() > 0) {
        await dotsButton.click();
        clicked = true;
      }
    }

    if (clicked) {
      await targetPage.waitForTimeout(1500);
      await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemap-menu-opened.png') });
      console.log("📸 Saved gsc-sitemap-menu-opened.png");

      // Click "Site haritasını kaldır" or "Remove sitemap"
      console.log("Looking for 'Site haritasını kaldır' or 'Remove sitemap' menu item...");
      const removeBtn = targetPage.locator('button[role="menuitem"]:has-text("Site haritasını kaldır"), button[role="menuitem"]:has-text("kaldır"), button[role="menuitem"]:has-text("Remove"), button[role="menuitem"]:has-text("remove")').first();
      if (await removeBtn.count() > 0) {
        console.log("Found remove button! Clicking...");
        await removeBtn.click();
        await targetPage.waitForTimeout(2000);

        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemap-remove-confirm.png') });
        console.log("📸 Saved gsc-sitemap-remove-confirm.png");

        // Confirm dialog click
        console.log("Confirming deletion...");
        const confirmBtn = targetPage.locator('span:has-text("Site haritasını kaldır"), button:has-text("Site haritasını kaldır"), span:has-text("Kaldır"), button:has-text("Kaldır"), span:has-text("Remove"), button:has-text("Remove")').first();
        if (await confirmBtn.count() > 0) {
          await confirmBtn.click();
          console.log("Sitemap removed! Waiting 5 seconds...");
          await targetPage.waitForTimeout(5000);
        } else {
          console.log("❌ Could not find confirmation button!");
        }
      } else {
        console.log("❌ Could not find remove menu item!");
      }
    } else {
      console.log("❌ Failed to open options menu!");
    }

    // Step 2: Navigate back to the sitemaps page and submit fresh
    const sitemapsUrl = 'https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F';
    console.log(`Navigating to: ${sitemapsUrl}`);
    await targetPage.goto(sitemapsUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch((e: any) => {
      console.log("Navigation timeout/warning (ignored):", e.message);
    });
    console.log("Waiting 5 seconds for page load...");
    await targetPage.waitForTimeout(5000);

    // Escape any popups
    await targetPage.keyboard.press('Escape');
    await targetPage.waitForTimeout(1000);

    // Select the visible input
    const input = targetPage.locator('input[placeholder*="Site haritası"]:visible, input[aria-label*="Site haritası"]:visible').first();
    console.log("Checking if visible input exists...");
    if (await input.count() > 0) {
      console.log("Found visible input! Clicking and typing...");
      await input.click();
      await targetPage.waitForTimeout(500);
      await input.fill('sitemap.xml');
      await targetPage.waitForTimeout(1000);
      
      // Select the submit button
      const submitBtn = targetPage.locator('div[role="button"]:has-text("Gönder"):visible, span:has-text("Gönder"):visible, div[role="button"]:has-text("GÖNDER"):visible, span:has-text("GÖNDER"):visible').first();
      if (await submitBtn.count() > 0) {
        console.log("Found submit button! Clicking...");
        await submitBtn.click();
        
        console.log("Waiting 15 seconds for submission to complete...");
        await targetPage.waitForTimeout(15000);
        
        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-resubmit-success.png') });
        console.log("📸 Saved gsc-sitemaps-resubmit-success.png");
        
        const afterText = await targetPage.evaluate(() => document.body.innerText);
        fs.writeFileSync('gsc-sitemaps-resubmit-success.txt', afterText);
        
        // Dismiss popup
        const dismissBtn = targetPage.locator('text=ANLADIM, text=Kapat, text=TAMAM').first();
        if (await dismissBtn.count() > 0) {
          console.log("Dismissing modal...");
          await dismissBtn.click();
          await targetPage.waitForTimeout(2000);
          await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-resubmit-final.png') });
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
