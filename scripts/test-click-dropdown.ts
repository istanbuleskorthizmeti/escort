import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const chromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("🔍 [TEST DROPDOWN] Starting dropdown click test...");
  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    executablePath: chromePath,
    viewport: { width: 1366, height: 768 }
  });

  const page = await browserContext.newPage();
  try {
    console.log("Navigating to Search Console home...");
    await page.goto("https://search.google.com/search-console", { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000);

    console.log("Clicking property selector (#resource-selector-container)...");
    await page.click('#resource-selector-container');

    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(process.cwd(), 'gsc-dropdown-clicked-success.png') });
    console.log("Screenshot after click saved to gsc-dropdown-clicked-success.png");

      // Let's print all options currently in the DOM
      const options = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('[role="option"], [data-value], div'));
        return items
          .filter(i => {
            const text = i.textContent || '';
            return (text.includes('sites.google.com') || text.includes('dorukcanay') || text.includes('escort')) && text.length < 150;
          })
          .map(i => i.textContent?.trim());
      });
      console.log("Unique GSC options found in DOM:", Array.from(new Set(options)).slice(0, 50));

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await browserContext.close();
  }
}

run();
