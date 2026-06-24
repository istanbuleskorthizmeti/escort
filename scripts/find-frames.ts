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

    const frames = page.frames();
    console.log(`Found ${frames.length} frames on the page.`);
    for (let i = 0; i < frames.length; i++) {
      console.log(`Frame [${i}]: name="${frames[i].name()}", url="${frames[i].url()}"`);
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
