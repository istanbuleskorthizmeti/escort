import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  const targetUrl = "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa/";
  const settingsUrl = `https://search.google.com/search-console/settings?resource_id=${encodeURIComponent(targetUrl)}`;

  console.log(`Navigating to: ${settingsUrl}`);
  await page.goto(settingsUrl, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Click "Sahipliği doğrulama" row
  console.log("Clicking 'Sahipliği doğrulama'...");
  const verificationRow = page.locator('div').filter({ hasText: /^Sahipliği doğrulama$/ }).first();
  await verificationRow.click();
  await page.waitForTimeout(4000);

  const screenshotPath = path.join(process.cwd(), 'scratch', 'gsc_settings_verification.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);

  // Dump page innerText
  const text = await page.evaluate(() => document.body.innerText);
  console.log("Verification Page Text:\n", text);

  await page.close();
  await browser.close();
}

run().catch(console.error);
