import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    console.log("Navigating to GSC...");
    await page.goto("https://search.google.com/search-console", { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    // Find the property selector by class or aria-label
    console.log("Locating property dropdown...");
    const dropdown = page.locator('[aria-label="Mülk arayın"], button.F3p5Ad, .F3p5Ad').filter({ visible: true }).first();
    await dropdown.click();
    await page.waitForTimeout(2000);

    // Save screenshot of dropdown open
    const ssPath = path.join(process.cwd(), 'scratch', 'gsc_dropdown_open.png');
    await page.screenshot({ path: ssPath });
    console.log(`Screenshot saved to: ${ssPath}`);

    // Dump list of options in dropdown
    const options = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.z80M1, [role="option"], [role="menuitem"]'));
      return els.map(el => (el as HTMLElement).innerText).filter(Boolean);
    });

    console.log("Found properties/options in dropdown:", options);

  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
