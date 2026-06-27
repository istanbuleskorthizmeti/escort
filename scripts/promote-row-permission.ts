import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  const targetUrl = "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa/";
  const usersUrl = `https://search.google.com/search-console/users?resource_id=${encodeURIComponent(targetUrl)}`;

  console.log(`Navigating to: ${usersUrl}`);
  await page.goto(usersUrl, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);

  const sa = 'e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com';
  const row = page.locator('tr').filter({ hasText: sa }).first();
  
  console.log("Clicking three-dots menu...");
  const threeDots = row.locator('div[role="button"]').first();
  await threeDots.click();
  await page.waitForTimeout(2000);

  // Dump all texts inside the popup menu
  const menuItems = await page.evaluate(() => {
    const items = document.querySelectorAll('div[role="menu"] [role="menuitem"], div[role="menu"] span, div.JPdR6b span');
    return Array.from(items).map(el => (el as HTMLElement).innerText).filter(Boolean);
  });
  console.log("Menu items found:", menuItems);

  await page.close();
  await browser.close();
}

run().catch(console.error);
