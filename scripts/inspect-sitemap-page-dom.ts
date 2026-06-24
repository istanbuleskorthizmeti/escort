import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log("🔗 Connecting...");
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  if (!context) return;
  const page = await context.newPage();
  
  try {
    const drilldownUrl = "https://search.google.com/search-console/sitemaps/info-drilldown?resource_id=https:%2F%2Fsites.google.com%2Fdorukcanay.digital%2Fsefakoyistanbul-drkcnay2026%2Fana-sayfa%2F&sitemap=https:%2F%2Fsites.google.com%2Fdorukcanay.digital%2Fsefakoyistanbul-drkcnay2026%2Fana-sayfa%2Fsystem%2Ffeeds%2Fsitemap";
    console.log(`Navigating to drilldown: ${drilldownUrl}`);
    await page.goto(drilldownUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(6000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Save page HTML
    const html = await page.evaluate(() => document.body.innerHTML);
    fs.writeFileSync('gsc-drilldown-dom.html', html);
    console.log("Saved DOM to gsc-drilldown-dom.html");

    // Dump all buttons
    const buttons = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, [role="button"], mat-icon'));
      return btns.map(b => ({
        tagName: b.tagName,
        id: b.id,
        className: b.className,
        text: b.textContent?.trim(),
        ariaLabel: b.getAttribute('aria-label'),
        ariaHaspopup: b.getAttribute('aria-haspopup'),
        html: b.outerHTML.substring(0, 200)
      }));
    });
    fs.writeFileSync('gsc-drilldown-buttons.json', JSON.stringify(buttons, null, 2));
    console.log("Saved buttons list to gsc-drilldown-buttons.json");

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }
}

run().catch(console.error);
