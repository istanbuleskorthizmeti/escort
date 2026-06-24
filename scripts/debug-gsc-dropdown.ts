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

    console.log("Navigating to GSC...");
    await page.goto('https://search.google.com/search-console/sitemaps', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);

    // Escape any modals
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    console.log("Opening property selector...");
    await page.click('#resource-selector-container');
    await page.waitForTimeout(2000);

    const optionsData = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('[role="option"], [data-value], .mat-menu-item'));
      return items.map(el => {
        return {
          text: el.textContent?.trim() || '',
          html: el.innerHTML,
          role: el.getAttribute('role'),
          dataValue: el.getAttribute('data-value'),
          tagName: el.tagName
        };
      }).filter(item => item.text.includes('istanbul-eskort-hizmeti'));
    });

    console.log("=== DETAILED PROPERTY OPTIONS ===");
    console.log(JSON.stringify(optionsData, null, 2));

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
