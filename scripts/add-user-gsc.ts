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

  console.log(`Navigating to: ${usersUrl}`);
  await page.goto(usersUrl, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log("Clicking 'Kullanıcı ekle' button...");
  const btn = page.locator('div[role="button"]').filter({ hasText: /Kullanıcı ekle/i }).first();
  await btn.click();
  await page.waitForTimeout(1000);

  console.log("Filling email...");
  const emailInput = page.locator('input[aria-label="Geçerli bir Google hesabı e-postası girin"]').first();
  await emailInput.fill('e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com');
  await page.waitForTimeout(1000);

  console.log("Clicking permission dropdown...");
  const dropdown = page.locator('div[role="dialog"] div[role="listbox"], div[role="dialog"] div[aria-haspopup="listbox"]').first();
  await dropdown.click();
  await page.waitForTimeout(1000);

  console.log("Selecting 'Sahibi' option...");
  const ownerOption = page.locator('div[role="option"]').filter({ hasText: /Sahibi/i }).first();
  await ownerOption.click();
  await page.waitForTimeout(1000);

  console.log("Clicking 'Ekle' button...");
  const saveButton = page.locator('div[role="dialog"] div[role="button"]').filter({ hasText: /Ekle/i }).first();
  await saveButton.click();
  
  console.log("Waiting for dialog to close...");
  await page.waitForTimeout(4000);

  await page.screenshot({ path: path.join(process.cwd(), 'scratch', 'gsc_add_success.png') });
  console.log("Screenshot saved after save action.");

  await page.close();
  await browser.close();
}

run().catch(console.error);
