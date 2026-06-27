import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  console.log("Navigating to GSC...");
  await page.goto("https://search.google.com/search-console", { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(5000);

  // Take a screenshot of the GSC top-left area
  const screenshotPath = path.join(process.cwd(), 'scratch', 'gsc_top_left.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`Screenshot saved to: ${screenshotPath}`);

  // Dump all clickable elements in the top-left sidebar/header area
  const elements = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('div[role="button"], button, [aria-haspopup]'));
    return all.map(el => {
      const htmlEl = el as HTMLElement;
      return {
        innerText: htmlEl.innerText,
        className: htmlEl.className,
        ariaLabel: htmlEl.getAttribute('aria-label') || '',
        jscontroller: htmlEl.getAttribute('jscontroller') || '',
        outerHTML: htmlEl.outerHTML.substring(0, 200)
      };
    }).filter(e => e.innerText || e.ariaLabel);
  });

  console.log("Clickable elements:", JSON.stringify(elements, null, 2));

  await page.close();
  await browser.close();
}

run().catch(console.error);
