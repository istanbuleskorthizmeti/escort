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

    console.log("Navigating to GSC sitemaps list...");
    await page.goto('https://search.google.com/search-console/sitemaps', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);

    // Escape any modals
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    console.log("Clicking property selector dropdown...");
    await page.click('#resource-selector-container');
    await page.waitForTimeout(2000);

    // Capture list of items in the dropdown
    const propertyList = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('[role="option"], [data-value], div'));
      return elements
        .map(el => el.textContent?.trim() || '')
        .filter(text => text.includes('istanbul-eskort-hizmeti') || text.includes('readme.io'))
        .filter((val, idx, self) => self.indexOf(val) === idx);
    });

    console.log("=== PROPERTIES FOUND ===");
    console.log(propertyList);

    // Save screenshot of the dropdown open
    await page.screenshot({ path: path.join(process.cwd(), 'gsc-dropdown-open.png') });
    console.log("📸 Saved gsc-dropdown-open.png");

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
