import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("Connecting to Chrome...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  const targetUrl = "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa/";
  const usersUrl = `https://search.google.com/search-console/users?resource_id=${encodeURIComponent(targetUrl)}`;

  console.log(`Navigating to users settings: ${usersUrl}`);
  await page.goto(usersUrl, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Take an initial screenshot before clicking
  await page.screenshot({ path: path.join(process.cwd(), 'scratch', 'gsc_users_before.png') });

  try {
    console.log("Locating the button...");
    const btn = page.locator('button, div[role="button"]').filter({ hasText: /KULLANICI EKLE/i }).first();
    console.log("Button visible:", await btn.isVisible());
    
    await btn.click({ timeout: 5000 });
    console.log("Clicked! Waiting for dialog...");
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(process.cwd(), 'scratch', 'gsc_add_user_dialog.png') });
    console.log("Dialog screenshot saved.");

    // Print text on the page to see if dialog elements are visible
    const text = await page.evaluate(() => document.body.innerText);
    console.log("Body text after click has 'İzin' or 'Rol':", text.includes('İzin') || text.includes('Rol'));
  } catch (err: any) {
    console.error("Failed to click or find dialog:", err.message);
  }

  await page.close();
  await browser.close();
}

run().catch(console.error);
