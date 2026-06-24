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
    const submitBtn = await targetPage.evaluate(() => {
      // Find all elements that might act as button
      const allElements = Array.from(document.querySelectorAll('button, div[role="button"], div, span'));
      // Find the one that has textContent exact match "GÖNDER"
      const btn = allElements.find((el: any) => {
        // Must have exactly GÖNDER and not contain children with other text
        return el.textContent.trim() === 'GÖNDER' && el.children.length === 0;
      }) as HTMLElement;
      
      if (btn) {
        btn.click();
        return true;
      }
      
      // Fallback: search for any element containing GÖNDER but we select the deepest one
      const anyGonder = allElements.filter((el: any) => el.textContent.trim() === 'GÖNDER');
      if (anyGonder.length > 0) {
        // Pick the last one (deepest in DOM)
        const deepest = anyGonder[anyGonder.length - 1] as HTMLElement;
        deepest.click();
        return true;
      }
      
      return false;
    });
    
    if (submitBtn) {
      console.log("Click successfully simulated via JS query selector!");
      console.log("Waiting 15 seconds for submission to process...");
      await targetPage.waitForTimeout(15000);
      
      await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-correct-submitted.png') });
      console.log("📸 Saved gsc-sitemaps-correct-submitted.png");
      
      const afterText = await targetPage.evaluate(() => document.body.innerText);
      fs.writeFileSync('gsc-sitemaps-correct-submitted.txt', afterText);
      
      // Look for "ANLADIM" or "TAMAM" dialog dismiss
      const dismissBtn = targetPage.locator('text=ANLADIM');
      if (await dismissBtn.count() > 0) {
        console.log("Dismissing modal popup...");
        await dismissBtn.first().click();
        await targetPage.waitForTimeout(2000);
        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-correct-final.png') });
      }
    } else {
      console.log("❌ Could not find exact GÖNDER button!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
