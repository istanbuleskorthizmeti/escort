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
      console.error("❌ GSC page not found!");
      return;
    }

    console.log("Navigating to GSC sitemaps page...");
    await page.goto(ROOT_PROPERTY_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    await page.keyboard.press('Escape');

    console.log("⚡ PURGING DOM BLOCKING OVERLAYS...");
    await page.evaluate(() => {
      document.querySelectorAll('iframe').forEach(f => f.remove());
      document.querySelectorAll('.KL4X6e, .TuA45b, trans-layer').forEach(el => el.remove());
    });
    await page.waitForTimeout(2000);

    // Dismiss the success modal if it is present
    const dismissBtn = page.locator('button, [role="button"], span').filter({ hasText: /^Kapat$/ }).first();
    if (await dismissBtn.count() > 0) {
      console.log("Dismissing success modal...");
      await dismissBtn.click({ force: true });
      await page.waitForTimeout(3000);
    } else {
      console.log("Success modal not visible or already dismissed.");
    }

    console.log("Waiting for sitemaps table...");
    const cell = page.locator('td[role="gridcell"]').first();
    await cell.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {
      console.log("Note: Table cells did not appear or table is empty.");
    });

    await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-final-table.png') });
    console.log("📸 Saved gsc-sitemaps-final-table.png");

    // Extract and print table rows
    const rowsData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr'));
      return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td, th'));
        return cells.map(c => c.textContent?.trim() || '');
      }).filter(r => r.length > 0);
    });

    console.log("=== SUBMITTED SITEMAPS TABLE ===");
    rowsData.forEach((row: string[], idx: number) => {
      console.log(`Row ${idx}:`, row.join(' | '));
    });

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
