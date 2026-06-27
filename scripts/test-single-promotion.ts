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
  await page.waitForTimeout(3000);

  // Click add user
  const addButton = page.locator('div[role="button"]').filter({ hasText: /Kullanıcı ekle/i }).filter({ visible: true }).first();
  await addButton.click();
  await page.waitForTimeout(1500);

  // Fill email
  const emailInput = page.locator('div[role="dialog"] input[aria-label="Geçerli bir Google hesabı e-postası girin"]').filter({ visible: true }).first();
  await emailInput.fill('e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com');
  await page.waitForTimeout(500);

  // Click permission dropdown container
  console.log("Clicking dropdown...");
  const dropdown = page.locator('div[role="dialog"] div[jsname="BA389"]').filter({ visible: true }).first();
  await dropdown.click();
  await page.waitForTimeout(1000);

  // Click the VISIBLE Sahibi option globally
  console.log("Selecting Sahibi option...");
  const ownerOption = page.locator('div[role="option"]').filter({ hasText: 'Sahibi' }).filter({ visible: true }).first();
  await ownerOption.click();
  await page.waitForTimeout(1000);

  // Click save
  console.log("Clicking save...");
  const saveButton = page.locator('div[role="dialog"] div[data-id="EBS5u"]').filter({ visible: true }).first();
  await saveButton.click();
  await page.waitForTimeout(4000);

  // Take screenshot of list
  const screenshotPath = path.join(process.cwd(), 'scratch', 'gsc_users_list_single_test.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);

  // Dump the table innerText
  const tableText = await page.evaluate(() => {
    const table = document.querySelector('table');
    return table ? table.innerText : 'No table found';
  });
  console.log("Table content:\n", tableText);

  await page.close();
  await browser.close();
}

run().catch(console.error);
