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
    
    // Ensure we are on GSC home
    console.log("Navigating to GSC home...");
    await targetPage.goto('https://search.google.com/search-console', { waitUntil: 'networkidle', timeout: 45000 });
    await targetPage.waitForTimeout(5000);
    
    // Click property selector dropdown on top left
    console.log("Opening property selector dropdown...");
    // The dropdown typically has the class/selector representing the property name or dropdown arrow
    const selectorDropdown = targetPage.locator('div[aria-haspopup="listbox"], div[role="combobox"]').first();
    await selectorDropdown.click();
    await targetPage.waitForTimeout(2000);
    await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-dropdown-open.png') });
    
    // Find the correct property in the dropdown list
    console.log("Searching for the URL-prefix property...");
    const propertyOption = targetPage.locator('div[role="option"]').filter({ hasText: 'https://istanbul-eskort-hizmeti.readme.io/' });
    if (await propertyOption.count() > 0) {
      console.log("Found option. Clicking it...");
      await propertyOption.first().click();
      await targetPage.waitForTimeout(5000);
      console.log(`Selected property. Current URL: ${targetPage.url()}`);
      
      await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-property-selected.png') });
      
      // Now click "Site Haritaları" in the left menu
      console.log("Navigating to Site Haritaları...");
      const sitemapsLink = targetPage.locator('text=Site Haritaları');
      if (await sitemapsLink.count() > 0) {
        await sitemapsLink.first().click();
        await targetPage.waitForTimeout(5000);
        console.log(`Sitemaps URL: ${targetPage.url()}`);
        
        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-page-loaded.png') });
        
        // Find input and submit
        const input = targetPage.locator('input[placeholder*="Site haritası"], input[aria-label*="Site haritası"]');
        if (await input.count() > 0) {
          console.log("Entering sitemap.xml...");
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
            
            await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemap-submitted-by-click.png') });
            console.log("📸 Saved gsc-sitemap-submitted-by-click.png");
            
            const dismissBtn = targetPage.locator('text=ANLADIM');
            if (await dismissBtn.count() > 0) {
              console.log("Dismissing popup...");
              await dismissBtn.first().click();
              await targetPage.waitForTimeout(2000);
              await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-final-by-click.png') });
            }
          }
        }
      } else {
        console.log("❌ Left menu 'Site Haritaları' link not found!");
      }
    } else {
      console.log("❌ Could not find option for 'https://istanbul-eskort-hizmeti.readme.io/' in dropdown!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
