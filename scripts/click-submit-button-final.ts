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
        if (page.url().includes('search.google.com/search-console/sitemaps')) {
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
    
    // Close the feedback panel first if open (by sending Escape)
    console.log("Closing feedback panel if open...");
    await targetPage.keyboard.press('Escape');
    await targetPage.waitForTimeout(2000);
    await targetPage.keyboard.press('Escape');
    await targetPage.waitForTimeout(1000);
    
    // Enter sitemap.xml to make sure the button is enabled
    console.log("Re-ensuring sitemap.xml value is in the input...");
    await targetPage.evaluate(() => {
      const input = document.querySelector('input[placeholder*="Site haritası"], input[aria-label*="Site haritası"]') as HTMLInputElement;
      if (input) {
        input.value = 'sitemap.xml';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await targetPage.waitForTimeout(1000);
    
    // Find sitemap input card submit button by matching text content of any element
    console.log("Clicking the 'Gönder' button...");
    const clicked = await targetPage.evaluate(() => {
      // Find all elements that might act as button
      const allElements = Array.from(document.querySelectorAll('[role="button"], button, div, span'));
      // Find the one that has textContent exact match "Gönder" or "gönder" case-insensitively
      const btn = allElements.find((el: any) => {
        const text = el.textContent ? el.textContent.trim().toLowerCase() : '';
        return (text === 'gönder' || text === 'gonder') && el.children.length === 0;
      }) as HTMLElement;
      
      if (btn) {
        btn.click();
        return true;
      }
      
      // Fallback: search for any element containing Gönder but we select the deepest one
      const anyGonder = allElements.filter((el: any) => {
        const text = el.textContent ? el.textContent.trim().toLowerCase() : '';
        return text === 'gönder' || text === 'gonder';
      });
      if (anyGonder.length > 0) {
        const deepest = anyGonder[anyGonder.length - 1] as HTMLElement;
        deepest.click();
        return true;
      }
      
      return false;
    });
    
    if (clicked) {
      console.log("Click simulated successfully!");
      console.log("Waiting 15 seconds for submission to process...");
      await targetPage.waitForTimeout(15000);
      
      await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-success-submitted.png') });
      console.log("📸 Saved gsc-sitemaps-success-submitted.png");
      
      const afterText = await targetPage.evaluate(() => document.body.innerText);
      fs.writeFileSync('gsc-sitemaps-success-submitted.txt', afterText);
      
      // Look for "ANLADIM" or "TAMAM" or "Kapat" dialog dismiss
      const dismissBtn = targetPage.locator('text=ANLADIM');
      const closeBtn = targetPage.locator('text=Kapat');
      if (await dismissBtn.count() > 0) {
        console.log("Dismissing modal popup via ANLADIM...");
        await dismissBtn.first().click();
        await targetPage.waitForTimeout(2000);
        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-success-final.png') });
      } else if (await closeBtn.count() > 0) {
        console.log("Dismissing modal popup via Kapat...");
        await closeBtn.first().click();
        await targetPage.waitForTimeout(2000);
        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-success-final.png') });
      }
    } else {
      console.log("❌ Could not find the Gönder button!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
