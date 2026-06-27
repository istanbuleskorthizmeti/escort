import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  const targetUrl = "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa/";
  const usersUrl = `https://search.google.com/search-console/users?resource_id=${encodeURIComponent(targetUrl)}`;

  await page.goto(usersUrl, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Click add user
  const addButton = page.locator('div[role="button"]').filter({ hasText: /Kullanıcı ekle/i }).first();
  await addButton.click();
  await page.waitForTimeout(1500);

  console.log("Clicking permission dropdown...");
  // Let's click the permission dropdown element (which currently says "Tam" inside the dialog)
  const dropdown = page.locator('div[role="dialog"] div[role="listbox"], div[role="dialog"] div[aria-haspopup="listbox"], div[role="dialog"] div:has-text("Tam")').last();
  await dropdown.click();
  await page.waitForTimeout(1000);

  // Take screenshot of options
  await page.screenshot({ path: path.join(process.cwd(), 'scratch', 'gsc_roles_options.png') });
  
  // List all options in the DOM
  const options = await page.evaluate(() => {
    const opts = document.querySelectorAll('div[role="option"]');
    return Array.from(opts).map(el => (el as HTMLElement).innerText).filter(Boolean);
  });
  console.log("Roles found:", options);

  await page.close();
  await browser.close();
}

run().catch(console.error);
