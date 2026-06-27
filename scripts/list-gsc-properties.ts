import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  console.log("Navigating to GSC...");
  await page.goto("https://search.google.com/search-console", { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(5000);

  // Click the property selector dropdown in the top-left corner
  console.log("Clicking property selector dropdown...");
  const dropdownButton = page.locator('button[aria-label="Mülk arayın"]').first();
  await dropdownButton.click();
  await page.waitForTimeout(2000);

  // Dump all options in the dropdown list
  const properties = await page.evaluate(() => {
    const listItems = document.querySelectorAll('div[role="listbox"] [role="option"], div[role="menu"] [role="menuitem"], .v3Oild div.z80M1');
    return Array.from(listItems).map(el => {
      const htmlEl = el as HTMLElement;
      return {
        text: htmlEl.innerText,
        outerHTML: htmlEl.outerHTML.substring(0, 200)
      };
    }).filter(p => p.text);
  });

  console.log("Available GSC properties:", JSON.stringify(properties, null, 2));

  await page.close();
  await browser.close();
}

run().catch(console.error);
