import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const sitesPath = path.join(process.cwd(), 'data', 'live_google_sites.json');

async function removeSitemapsFromProperty(page: any, siteUrl: string, index: number, total: number) {
  const siteUrlWithSlash = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
  
  console.log(`\n--------------------------------------------------`);
  console.log(`📍 [${index}/${total}] Scanning GSC Sitemaps for: ${siteUrlWithSlash}`);
  
  const sitemapsUrl = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(siteUrlWithSlash)}`;
  
  let loop = true;
  let attempts = 0;
  const deletedPaths = new Set<string>();
  
  while (loop && attempts < 4) {
    attempts++;
    console.log(`🔗 Navigating to sitemaps page (Attempt ${attempts}): ${sitemapsUrl}`);
    try {
      await page.goto(sitemapsUrl, { waitUntil: 'load', timeout: 30000 });
    } catch (e: any) {
      console.log("   ⚠️ Navigation timeout/warning:", e.message);
    }
    
    await page.waitForTimeout(6000);
    await page.keyboard.press('Escape'); // Close any modal overlay
    await page.waitForTimeout(1000);

    // Find if there is a sitemap row in the table
    // We want to delete any sitemap matching "/system/feeds/sitemap" or "/sitemap.xml"
    const rowSelector = 'div[role="row"], tr, .O9Z5Cc';
    const rowCount = await page.locator(rowSelector).count();
    console.log(`   🔍 Found ${rowCount} rows in the sitemaps table.`);
    
    let targetRowText = null;
    let targetRowIndex = -1;
    let targetSitemapPath = "";
    
    for (let r = 0; r < rowCount; r++) {
      const text = await page.locator(rowSelector).nth(r).innerText();
      let foundPath = "";
      if (text.includes('/system/feeds/sitemap')) {
        foundPath = '/system/feeds/sitemap';
      } else if (text.includes('/sitemap.xml')) {
        foundPath = '/sitemap.xml';
      }
      
      if (foundPath && !deletedPaths.has(foundPath)) {
        // Exclude the header row
        if (!text.includes('Durum') && !text.includes('Status') && !text.includes('Gönderildi')) {
          targetRowText = text;
          targetRowIndex = r;
          targetSitemapPath = foundPath;
          break;
        }
      }
    }

    if (targetRowIndex !== -1 && targetRowText) {
      console.log(`   🎯 Found target sitemap row: "${targetRowText.split('\n')[0]}"`);
      
      // Click the row to navigate to details
      const rowEl = page.locator(rowSelector).nth(targetRowIndex);
      await rowEl.click();
      console.log("   ⌛ Waiting for sitemap details page to load...");
      await page.waitForTimeout(5000);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);

      // Diagnostics
      const currentUrl = page.url();
      const currentTitle = await page.title();
      console.log(`   🌐 Details URL: ${currentUrl}`);
      console.log(`   🌐 Details Page Title: ${currentTitle}`);
      
      const safeName = siteUrlWithSlash.replace(/[^a-zA-Z0-9]/g, '-');
      await page.screenshot({ path: path.join(process.cwd(), `gsc-sitemap-details-${safeName}.png`) });

      // Click Options menu (three dots)
      console.log("   🔍 Locating options menu...");
      const optionsBtn = page.locator('[role="button"][aria-label*="seçenekler"], [role="button"][aria-label*="options"], [role="button"][aria-label*="Diğer"], [role="button"][aria-label*="More"]').first();
      const optionsBtnFallback1 = page.locator('[role="button"]:has(mat-icon:has-text("more_vert")), button:has(mat-icon:has-text("more_vert")), [role="button"]:has-text("more_vert")').first();
      const optionsBtnFallback2 = page.locator('.U26fgb.JRtysb.WzwrXb').first();

      let menuClicked = false;
      if (await optionsBtn.count() > 0 && await optionsBtn.isVisible()) {
        console.log("   👉 Clicking optionsBtn via aria-label...");
        await optionsBtn.click();
        menuClicked = true;
      } else if (await optionsBtnFallback2.count() > 0 && await optionsBtnFallback2.isVisible()) {
        console.log("   👉 Clicking optionsBtnFallback2 via GSC classes...");
        await optionsBtnFallback2.click();
        menuClicked = true;
      } else if (await optionsBtnFallback1.count() > 0 && await optionsBtnFallback1.isVisible()) {
        console.log("   👉 Clicking optionsBtnFallback1 via icon text...");
        await optionsBtnFallback1.click();
        menuClicked = true;
      }

      if (menuClicked) {
        await page.waitForTimeout(1500);
        
        // Find and click "Site haritasını kaldır" / "Remove sitemap"
        const removeBtn = page.locator('button[role="menuitem"]:has-text("Site haritasını kaldır"), button[role="menuitem"]:has-text("kaldır"), button[role="menuitem"]:has-text("Remove"), button[role="menuitem"]:has-text("remove")').first();
        if (await removeBtn.count() > 0 && await removeBtn.isVisible()) {
          console.log("   🎯 Found 'Remove sitemap' menu item. Clicking...");
          await removeBtn.click();
          await page.waitForTimeout(2000);

          // Click confirmation
          const confirmBtn = page.locator('span:has-text("Site haritasını kaldır"), button:has-text("Site haritasını kaldır"), span:has-text("Kaldır"), button:has-text("Kaldır"), span:has-text("Remove"), button:has-text("Remove")').first();
          if (await confirmBtn.count() > 0 && await confirmBtn.isVisible()) {
            await confirmBtn.click();
            console.log(`   ✅ Sitemap deleted successfully!`);
            await page.waitForTimeout(4000);
          } else {
            // Fallback evaluate click
            await page.evaluate(() => {
              const btns = Array.from(document.querySelectorAll('button, span, div[role="button"]'));
              const match = btns.find(b => {
                const txt = b.textContent?.toLowerCase() || '';
                return txt.includes('kaldır') || txt.includes('remove');
              });
              if (match) (match as HTMLElement).click();
            });
            console.log(`   ✅ Sitemap deleted via fallback click.`);
            await page.waitForTimeout(4000);
          }
        } else {
          // Fallback menu click
          await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('[role="menuitem"], button'));
            const match = items.find(i => {
              const txt = i.textContent?.toLowerCase() || '';
              return txt.includes('kaldır') || txt.includes('remove');
            });
            if (match) (match as HTMLElement).click();
          });
          await page.waitForTimeout(2000);
          await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, span, div[role="button"]'));
            const match = btns.find(b => {
              const txt = b.textContent?.toLowerCase() || '';
              return txt.includes('kaldır') || txt.includes('remove');
            });
            if (match) (match as HTMLElement).click();
          });
          console.log(`   ✅ Sitemap deleted via fallback menu/dialog click.`);
          await page.waitForTimeout(4000);
        }
      } else {
        console.log("   ❌ Failed to open options menu.");
        loop = false; // Break loop if we failed to open the menu
      }
      
      deletedPaths.add(targetSitemapPath);
      console.log(`   Added ${targetSitemapPath} to deleted list for this property.`);
      await page.waitForTimeout(5000);
    } else {
      console.log("   ℹ️ No matching failed/stale sitemaps found on this property.");
      loop = false; // No more sitemaps to delete, exit loop
    }
  }
}

async function run() {
  console.log("🔗 Connecting to existing Chrome instance on port 9222...");
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  
  if (!context) {
    console.error("❌ No active browser context found!");
    return;
  }

  if (!fs.existsSync(sitesPath)) {
    console.error("❌ live_google_sites.json not found!");
    return;
  }

  const sites: string[] = JSON.parse(fs.readFileSync(sitesPath, 'utf8'));
  console.log(`📋 Loaded ${sites.length} sites for sitemap deletion.`);

  const page = await context.newPage();
  try {
    for (let i = 0; i < sites.length; i++) {
      await removeSitemapsFromProperty(page, sites[i], i + 1, sites.length).catch(err => {
        console.error(`   ❌ Error during sitemap deletion loop for ${sites[i]}:`, err.message);
      });
    }
  } catch (runErr: any) {
    console.error("Error during execution loop:", runErr.message);
  } finally {
    await page.close();
  }
  
  console.log("\n🏆 Done deleting failed sitemaps from Google Search Console.");
}

run().catch(console.error);
