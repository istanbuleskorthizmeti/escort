import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

const ROOT_PROPERTY_URL = 'https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F';

async function removeSitemapFromUI(page: any, sitemapName: string, isNested: boolean) {
  console.log(`\n➡️ [START] Deleting sitemap: ${sitemapName}`);
  
  // 1. Go to sitemaps overview page for root property
  console.log("Navigating to GSC sitemaps overview page with root property parameter...");
  await page.goto(ROOT_PROPERTY_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  await page.keyboard.press('Escape');

  console.log("Waiting for sitemaps table cell...");
  await page.waitForSelector('div[role="gridcell"], td', { timeout: 30000 });
  await page.waitForTimeout(2000);

  // Find the exact cell
  const regex = isNested ? /^\/sitemap\.xml\/sitemap\.xml$/ : /^\/sitemap\.xml$/;
  console.log(`Looking for table cell matching regex: ${regex}`);
  const cell = page.locator('div[role="gridcell"], td, span, div, a').filter({ hasText: regex }).first();
  
  if (await cell.count() > 0 && await cell.isVisible()) {
    console.log(`Found sitemap cell for "${sitemapName}". Clicking it to open details page...`);
    await cell.click();
    
    console.log("Waiting for URL to change to sitemap details drilldown...");
    await page.waitForURL('**/info-drilldown**', { timeout: 15000 }).catch((e: any) => {
      console.log("URL change wait warning:", e.message);
    });
    
    console.log("Waiting for 'more_vert' options menu to appear...");
    // Target only the options menu button, not the filter button
    const dotsMenu = page.locator('div.JRtysb[aria-label*="seçenek"], div.JRtysb[aria-label*="option"], div.JRtysb[aria-label*="Diğer seçenekler"]').first();
    await dotsMenu.waitFor({ state: 'visible', timeout: 20000 });
    
    console.log("Clicking options menu (three dots)...");
    await dotsMenu.click();
    await page.waitForTimeout(1500);

    // Capture menu open screenshot
    await page.screenshot({ path: path.join(process.cwd(), `gsc-menu-open-${sitemapName.replace(/\//g, '_')}.png`) });

    console.log("Looking for 'Site haritasını kaldır' or 'Remove sitemap' menu item...");
    const removeBtn = page.locator('[role="menuitem"]').filter({ hasText: /Site haritasını kaldır|Remove/ }).first();
    if (await removeBtn.count() > 0) {
      console.log("Found remove menu item! Clicking...");
      await removeBtn.click();
      await page.waitForTimeout(2000);

      // Confirm dialog click
      console.log("Confirming deletion in dialog...");
      const confirmBtn = page.locator('[role="dialog"] button, [role="dialog"] [role="button"], button, [role="button"]').filter({ hasText: /Site haritasını kaldır|Kaldır|Remove/ }).last();
      if (await confirmBtn.count() > 0) {
        await confirmBtn.click();
        console.log(`✅ Sitemap "${sitemapName}" successfully removed!`);
        await page.waitForTimeout(5000);
      } else {
        console.log("❌ Confirmation button not found!");
      }
    } else {
      console.log("❌ Remove menu item not found!");
    }
  } else {
    console.log(`ℹ️ Sitemap "${sitemapName}" was not found in the list. Skipping removal.`);
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

    // Step 1: Purge nested sitemap
    await removeSitemapFromUI(page, '/sitemap.xml/sitemap.xml', true);

    // Step 2: Purge stale root sitemap
    await removeSitemapFromUI(page, '/sitemap.xml', false);

    // Step 3: Submit fresh sitemap.xml
    console.log("\n➕ Submitting fresh sitemap.xml to root property...");
    await page.goto(ROOT_PROPERTY_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
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
        
        await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-root-purged-success.png') });
        console.log("📸 Saved gsc-sitemaps-root-purged-success.png");
        
        // Dismiss success modal
        const dismissBtn = page.locator('text=ANLADIM, text=Kapat, text=TAMAM').first();
        if (await dismissBtn.count() > 0) {
          console.log("Dismissing success modal...");
          await dismissBtn.click();
          await page.waitForTimeout(2000);
          await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-root-purged-final.png') });
        }
      }
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
