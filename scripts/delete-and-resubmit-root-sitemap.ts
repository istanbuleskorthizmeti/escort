import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

async function removeSitemap(page: any, sitemapUrl: string, name: string) {
  console.log(`\n🗑️ Attempting to remove sitemap: ${name} (${sitemapUrl})...`);
  
  const detailsUrl = `https://search.google.com/search-console/sitemaps/sitemap-details?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F&sitemap_path=${encodeURIComponent(sitemapUrl)}`;
  console.log(`Navigating directly to sitemap details page: ${detailsUrl}`);
  
  await page.goto(detailsUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch((e: any) => {
    console.log("Navigation warning (ignored):", e.message);
  });
  await page.waitForTimeout(5000);
  
  // Escape modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  const screenshotPath = path.join(process.cwd(), `gsc-sitemap-detail-${name}.png`);
  await page.screenshot({ path: screenshotPath });
  console.log(`📸 Saved screenshot to ${screenshotPath}`);

  // Look for options button (more_vert / three dots)
  // GSC top-right menu button is often a button inside mat-card-header or similar
  console.log("Locating options menu (three dots button) on the sitemap details card...");
  const optionsBtn = page.locator('button[aria-label*="Seçenek"], button[aria-label*="options"], button:has(mat-icon[string="more_vert"]), [role="button"]:has(mat-icon[string="more_vert"])').first();
  const optionsBtnFallback1 = page.locator('mat-icon:has-text("more_vert")').first();
  const optionsBtnFallback2 = page.locator('button[aria-haspopup="menu"]').first();

  let clicked = false;
  if (await optionsBtn.count() > 0 && await optionsBtn.isVisible()) {
    console.log("Clicking options button by aria-label/icon...");
    await optionsBtn.click();
    clicked = true;
  } else if (await optionsBtnFallback1.count() > 0) {
    console.log("Clicking fallback options button (mat-icon)...");
    await optionsBtnFallback1.click();
    clicked = true;
  } else if (await optionsBtnFallback2.count() > 0) {
    console.log("Clicking fallback options button (aria-haspopup)...");
    await optionsBtnFallback2.click();
    clicked = true;
  }

  if (clicked) {
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(process.cwd(), `gsc-menu-opened-${name}.png`) });
    console.log(`📸 Saved gsc-menu-opened-${name}.png`);

    // Click "Site haritasını kaldır" or "Remove sitemap"
    console.log("Looking for 'Site haritasını kaldır' or 'Remove sitemap' menu item...");
    const removeBtn = page.locator('button[role="menuitem"]:has-text("Site haritasını kaldır"), button[role="menuitem"]:has-text("kaldır"), button[role="menuitem"]:has-text("Remove"), button[role="menuitem"]:has-text("remove")').first();
    if (await removeBtn.count() > 0) {
      console.log("Found remove button! Clicking...");
      await removeBtn.click();
      await page.waitForTimeout(2000);

      // Confirm dialog click
      console.log("Confirming deletion in modal...");
      const confirmBtn = page.locator('span:has-text("Site haritasını kaldır"), button:has-text("Site haritasını kaldır"), span:has-text("Kaldır"), button:has-text("Kaldır"), span:has-text("Remove"), button:has-text("Remove")').first();
      if (await confirmBtn.count() > 0) {
        await confirmBtn.click();
        console.log(`✅ Sitemap ${name} removed! Waiting 5 seconds...`);
        await page.waitForTimeout(5000);
      } else {
        console.log("❌ Could not find confirmation button!");
      }
    } else {
      console.log("❌ Could not find remove menu item!");
    }
  } else {
    console.log("❌ Failed to open options menu!");
  }
}

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

    // Step 1: Select root property first (safeguard)
    console.log("Navigating to GSC sitemaps page...");
    await page.goto('https://search.google.com/search-console/sitemaps', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    await page.keyboard.press('Escape');

    console.log("Opening property selector...");
    await page.click('#resource-selector-container');
    await page.waitForTimeout(2000);

    const options = page.locator('[role="option"], [data-value]');
    const count = await options.count();
    let correctOptionClicked = false;
    for (let i = 0; i < count; i++) {
      const option = options.nth(i);
      const text = await option.innerText();
      if (text.replace(/\s+/g, ' ').trim() === 'https://istanbul-eskort-hizmeti.readme.io/') {
        console.log("🎯 Selected root property.");
        await option.click();
        correctOptionClicked = true;
        break;
      }
    }

    if (!correctOptionClicked) {
      console.log("Fallback selector search...");
      const fallbackOption = page.locator('[role="option"]:has-text("https://istanbul-eskort-hizmeti.readme.io/"):not(:has-text("docs")):not(:has-text("sitemap.xml"))').first();
      if (await fallbackOption.count() > 0) {
        await fallbackOption.click();
      } else {
        console.error("❌ Failed to select root property.");
        return;
      }
    }
    await page.waitForTimeout(5000);

    // Step 2: Remove "/sitemap.xml/sitemap.xml" sitemap
    await removeSitemap(page, 'https://istanbul-eskort-hizmeti.readme.io/sitemap.xml/sitemap.xml', 'nested');

    // Step 3: Remove "/sitemap.xml" sitemap
    await removeSitemap(page, 'https://istanbul-eskort-hizmeti.readme.io/sitemap.xml', 'root-stale');

    // Step 4: Submit fresh sitemap.xml
    console.log("\n➕ Submitting fresh sitemap.xml to root property...");
    await page.goto('https://search.google.com/search-console/sitemaps', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    await page.keyboard.press('Escape');

    const input = page.locator('input[placeholder*="Site haritası"]:visible, input[aria-label*="Site haritası"]:visible').first();
    if (await input.count() > 0) {
      await input.click();
      await page.waitForTimeout(500);
      await input.fill('sitemap.xml');
      await page.waitForTimeout(1000);
      
      const submitBtn = page.locator('div[role="button"]:has-text("Gönder"):visible, span:has-text("Gönder"):visible, div[role="button"]:has-text("GÖNDER"):visible, span:has-text("GÖNDER"):visible').first();
      if (await submitBtn.count() > 0) {
        await submitBtn.click();
        console.log("Waiting 15 seconds for submission to complete...");
        await page.waitForTimeout(15000);
        
        await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-root-fresh-success.png') });
        console.log("📸 Saved gsc-sitemaps-root-fresh-success.png");
        
        const dismissBtn = page.locator('text=ANLADIM, text=Kapat, text=TAMAM').first();
        if (await dismissBtn.count() > 0) {
          await dismissBtn.click();
          await page.waitForTimeout(2000);
          await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-root-fresh-final.png') });
        }
      }
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
