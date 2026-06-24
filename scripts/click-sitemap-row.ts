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

    // Step 1: Go to sitemaps page
    console.log("Navigating to GSC sitemaps page...");
    await page.goto('https://search.google.com/search-console/sitemaps', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    await page.keyboard.press('Escape');

    // Make sure we select the root property
    console.log("Ensuring root property is selected...");
    await page.click('#resource-selector-container');
    await page.waitForTimeout(2000);

    const options = page.locator('[role="option"], [data-value]');
    const count = await options.count();
    let correctOptionClicked = false;
    for (let i = 0; i < count; i++) {
      const option = options.nth(i);
      const text = await option.innerText();
      if (text.replace(/\s+/g, ' ').trim() === 'https://istanbul-eskort-hizmeti.readme.io/') {
        await option.click();
        correctOptionClicked = true;
        break;
      }
    }
    if (!correctOptionClicked) {
      const fallbackOption = page.locator('[role="option"]:has-text("https://istanbul-eskort-hizmeti.readme.io/"):not(:has-text("docs")):not(:has-text("sitemap.xml"))').first();
      if (await fallbackOption.count() > 0) {
        await fallbackOption.click();
      }
    }
    await page.waitForTimeout(5000);
    await page.keyboard.press('Escape');

    await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-before-click.png') });
    console.log("📸 Saved gsc-sitemaps-before-click.png");

    // Look for sitemap rows in the table
    console.log("Looking for sitemap rows in table...");
    
    // We want to find a cell or element containing exactly "/sitemap.xml" or "/sitemap.xml/sitemap.xml"
    const cellSelector = 'div[role="gridcell"] text, span, div, a';
    const allCells = page.locator('div[role="gridcell"], td, tr');
    const cellCount = await allCells.count();
    console.log(`Found ${cellCount} grid cells/table rows.`);

    let targetRowText = '';
    // Let's print all gridcell/td text contents to find the best match
    for (let i = 0; i < cellCount; i++) {
      const txt = await allCells.nth(i).innerText();
      if (txt.includes('sitemap.xml')) {
        console.log(`Cell [${i}]: "${txt.replace(/\s+/g, ' ')}"`);
      }
    }

    // Locate `/sitemap.xml` exactly (not /sitemap.xml/sitemap.xml)
    // In GSC, sitemap paths are shown in rows. We can locate the cell containing the path and click it.
    const exactSitemapLink = page.locator('div[role="gridcell"], td, span, div, a').filter({ hasText: /^\/sitemap\.xml$/ }).first();
    if (await exactSitemapLink.count() > 0 && await exactSitemapLink.isVisible()) {
      console.log("Found exact sitemap link! Clicking...");
      await exactSitemapLink.click();
      await page.waitForTimeout(5000);
      
      console.log(`Navigated to: ${page.url()}`);
      await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemap-details-clicked.png') });
      
      // Let's delete it
      console.log("Opening details options menu...");
      const optionsBtn = page.locator('button[aria-label*="Seçenek"], button[aria-label*="options"], button:has(mat-icon[string="more_vert"]), [role="button"]:has(mat-icon[string="more_vert"])').first();
      const optionsBtnFallback = page.locator('mat-icon:has-text("more_vert")').first();
      
      let menuOpened = false;
      if (await optionsBtn.count() > 0) {
        await optionsBtn.click();
        menuOpened = true;
      } else if (await optionsBtnFallback.count() > 0) {
        await optionsBtnFallback.click();
        menuOpened = true;
      }
      
      if (menuOpened) {
        await page.waitForTimeout(1500);
        await page.screenshot({ path: path.join(process.cwd(), 'gsc-details-menu-clicked.png') });
        
        const removeBtn = page.locator('button[role="menuitem"]:has-text("Site haritasını kaldır"), button[role="menuitem"]:has-text("kaldır"), button[role="menuitem"]:has-text("Remove"), button[role="menuitem"]:has-text("remove")').first();
        if (await removeBtn.count() > 0) {
          await removeBtn.click();
          await page.waitForTimeout(2000);
          
          const confirmBtn = page.locator('span:has-text("Site haritasını kaldır"), button:has-text("Site haritasını kaldır"), span:has-text("Kaldır"), button:has-text("Kaldır"), span:has-text("Remove"), button:has-text("Remove")').first();
          if (await confirmBtn.count() > 0) {
            await confirmBtn.click();
            console.log("✅ Stale sitemap deleted via click navigation!");
            await page.waitForTimeout(5000);
          }
        }
      }
    } else {
      console.log("❌ Could not find exact sitemap link in table!");
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
