import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log("🔗 Connecting to existing Chrome instance on port 9222...");
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  if (!context) return;

  const page = await context.newPage();
  try {
    const siteUrl = "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa/";
    const sitemapsUrl = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(siteUrl)}`;
    console.log(`Navigating to: ${sitemapsUrl}`);
    await page.goto(sitemapsUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(6000);
    
    // Escape modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-page-inspect.png') });
    console.log("Saved gsc-sitemaps-page-inspect.png");

    // Log the entire body text to see what is on the page
    const bodyText = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync('gsc-sitemaps-page-text.txt', bodyText);
    console.log("Saved body text to gsc-sitemaps-page-text.txt");
    
    // Find all table elements or list items that might be rows in the sitemaps table
    const rows = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('div[role="row"], tr, .O9Z5Cc'));
      return elements.map(el => el.textContent?.trim() || '');
    });
    console.log("Found rows:", rows);

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }
}

run().catch(console.error);
