import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

const ROOT_PROPERTY_URL = 'https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F';

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
    await page.goto(ROOT_PROPERTY_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    await page.keyboard.press('Escape');

    console.log("⚡ PURGING DOM BLOCKING OVERLAYS (GOD MODE)...");
    await page.evaluate(() => {
      // Remove all iframes (feedback, widgets, etc.)
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        console.log("Removing iframe:", iframe.src || iframe.name);
        iframe.remove();
      });

      // Remove all overlay backdrop layers
      const backdrops = document.querySelectorAll('.KL4X6e, .TuA45b, trans-layer, [class*="backdrop"], [class*="overlay"]');
      backdrops.forEach(el => {
        console.log("Removing backdrop/overlay:", el.className);
        el.remove();
      });

      // Reset body/html overflow styles if they were locked
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
      const html = document.documentElement;
      if (html) {
        html.style.overflow = 'auto';
        html.style.pointerEvents = 'auto';
      }
    });

    await page.waitForTimeout(2000);

    console.log("Locating sitemap input...");
    const input = page.locator('input[placeholder*="Site haritası"]:visible, input[aria-label*="Site haritası"]:visible').first();
    if (await input.count() > 0) {
      console.log("Input found. Clearing and typing value...");
      await input.click({ force: true });
      await page.waitForTimeout(500);
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(500);

      // Programmatically set and dispatch event first
      await page.evaluate(() => {
        const el = document.querySelector('input[placeholder*="Site haritası"], input[aria-label*="Site haritası"]') as HTMLInputElement;
        if (el) {
          el.value = 'sitemap.xml';
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      await page.waitForTimeout(500);

      // Physically type it too
      await input.focus();
      await page.keyboard.press('End');
      await page.keyboard.type('l');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(1000);

      console.log("Locating submit button...");
      const submitBtn = page.locator('div[role="button"]:has-text("Gönder"):visible, span:has-text("Gönder"):visible, div[role="button"]:has-text("GÖNDER"):visible, span:has-text("GÖNDER"):visible').first();
      
      if (await submitBtn.count() > 0) {
        console.log("Clicking submit button...");
        await submitBtn.click({ force: true });
        
        console.log("Waiting 15 seconds for submission to complete...");
        await page.waitForTimeout(15000);
        
        await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-god-mode-success.png') });
        console.log("📸 Saved gsc-sitemaps-god-mode-success.png");
        
        // Dismiss success modal if present
        const dismissBtn = page.locator('text=ANLADIM, text=Kapat, text=TAMAM, button:has-text("ANLADIM")').first();
        if (await dismissBtn.count() > 0) {
          console.log("Dismissing success modal...");
          await dismissBtn.click({ force: true });
          await page.waitForTimeout(2000);
          await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-god-mode-final.png') });
          console.log("📸 Saved gsc-sitemaps-god-mode-final.png");
        }
      } else {
        console.log("❌ Submit button not found!");
      }
    } else {
      console.log("❌ Sitemap input not found!");
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
