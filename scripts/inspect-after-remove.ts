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

  console.log(`Navigating to: ${usersUrl}`);
  await page.goto(usersUrl, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);

  const sa = 'e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com';
  const row = page.locator('tr').filter({ hasText: sa }).first();
  
  const threeDots = row.locator('div[role="button"]').first();
  await threeDots.click();
  await page.waitForTimeout(1000);

  // Click "Erişimi kaldır"
  const removeOption = page.locator('span[role="menuitem"][aria-label="Erişimi kaldır"]').filter({ visible: true }).first();
  await removeOption.click();
  await page.waitForTimeout(1500);

  // Confirm in dialog (using case-insensitive regex)
  console.log("Confirming removal in dialog...");
  const confirmBtn = page.locator('div, span, button').filter({ hasText: /Kullanıcıyı kaldır/i }).filter({ visible: true }).first();
  await confirmBtn.click();
  
  // Wait 1.5 seconds and take screenshot to capture toast/alert
  await page.waitForTimeout(1500);
  const screenshotPath = path.join(process.cwd(), 'scratch', 'after_remove_click.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);

  // Dump body text
  const text = await page.evaluate(() => document.body.innerText);
  console.log("Body text after removal attempt:\n", text.substring(0, 1000));

  await page.close();
  await browser.close();
}

run().catch(console.error);
