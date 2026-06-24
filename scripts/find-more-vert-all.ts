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

    const detailsUrl = `https://search.google.com/search-console/sitemaps/info-drilldown?resource_id=https:%2F%2Fistanbul-eskort-hizmeti.readme.io%2F&sitemap=https:%2F%2Fistanbul-eskort-hizmeti.readme.io%2Fsitemap.xml`;
    console.log(`Navigating to: ${detailsUrl}`);
    await page.goto(detailsUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    await page.keyboard.press('Escape');

    // Search all elements for text 'more_vert'
    const elementsData = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      return all
        .filter(el => el.textContent === 'more_vert' || el.getAttribute('aria-label')?.includes('Seçenek') || el.getAttribute('aria-label')?.includes('Option'))
        .map(el => {
          return {
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            outerHTML: el.outerHTML.substring(0, 400),
            ariaLabel: el.getAttribute('aria-label')
          };
        });
    });

    console.log("=== ALL ELEMENTS WITH 'more_vert' OR 'Seçenek' ===");
    console.log(JSON.stringify(elementsData, null, 2));

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
