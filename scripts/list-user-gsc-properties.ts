import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const chromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("🔍 [USER GSC] Launching Chrome to inspect user's GSC properties...");
  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    executablePath: chromePath,
    viewport: { width: 1366, height: 768 }
  });

  const page = await browserContext.newPage();
  try {
    console.log("Navigating to Search Console home...");
    await page.goto("https://search.google.com/search-console", { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(10000);

    await page.screenshot({ path: path.join(process.cwd(), 'gsc-dashboard.png') });
    console.log("Screenshot of dashboard saved to gsc-dashboard.png");

    // Click on the property selector dropdown to list all properties
    console.log("Opening property selector dropdown...");
    const dropdownSelector = '[data-back-to-message-list="true"], div[aria-label*="Mülk arayın"], div[aria-label*="Search property"], .wP4Wec, .c5z59';
    
    // Let's use evaluate to find the property dropdown and click it
    const dropdownClicked = await page.evaluate(() => {
      const el = document.querySelector('div[aria-expanded][role="listbox"]') || 
                 document.querySelector('div[aria-label*="Mülk arayın"]') ||
                 document.querySelector('div[aria-label*="Search property"]') ||
                 document.querySelector('.wP4Wec') ||
                 document.querySelector('.c5z59');
      if (el) {
        (el as HTMLElement).click();
        return true;
      }
      return false;
    });

    console.log("Dropdown click result:", dropdownClicked);
    await page.waitForTimeout(5000);
    await page.screenshot({ path: path.join(process.cwd(), 'gsc-properties-dropdown.png') });
    console.log("Screenshot of properties dropdown saved to gsc-properties-dropdown.png");

    // Extract property names and verification statuses from the dropdown list
    const properties = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('[role="option"], [data-value]'));
      return items.map(el => ({
        text: el.textContent?.trim(),
        value: el.getAttribute('data-value') || el.getAttribute('value')
      }));
    });

    console.log("User GSC Properties list:", JSON.stringify(properties, null, 2));

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await browserContext.close();
  }
}

run();
