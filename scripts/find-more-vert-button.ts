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

    // Find all buttons, icons, or divs near the top right or containing "more_vert"
    const elementsData = await page.evaluate(() => {
      const allButtons = Array.from(document.querySelectorAll('button, [role="button"], mat-icon, [aria-haspopup]'));
      return allButtons.map(el => {
        return {
          text: el.textContent?.trim() || '',
          html: el.outerHTML.substring(0, 300),
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          ariaLabel: el.getAttribute('aria-label'),
          ariaHasPopup: el.getAttribute('aria-haspopup')
        };
      });
    });

    console.log("=== BUTTONS & ICONS ON DETAILS PAGE ===");
    console.log(JSON.stringify(elementsData.filter((e: any) => e.text.includes('more_vert') || e.ariaLabel?.includes('Seçenek') || e.ariaLabel?.includes('option') || e.html.includes('more_vert') || e.html.includes('drilldown')), null, 2));

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
