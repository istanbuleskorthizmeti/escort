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
  await page.waitForTimeout(2000);

  // Take screenshot of confirmation dialog
  const screenshotPath = path.join(process.cwd(), 'scratch', 'remove_dialog_open.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);

  // Dump all visible buttons and dialog elements
  const elements = await page.evaluate(() => {
    const dialog = document.querySelector('div[role="dialog"]');
    if (!dialog) return 'No dialog found';
    
    // Dump all buttons/clickable elements inside dialog
    const clickables = dialog.querySelectorAll('div[role="button"], button, [tabindex="0"]');
    return Array.from(clickables).map(el => {
      const htmlEl = el as HTMLElement;
      return {
        innerText: htmlEl.innerText,
        className: htmlEl.className,
        outerHTML: htmlEl.outerHTML.substring(0, 300)
      };
    });
  });

  console.log("Dialog buttons:", JSON.stringify(elements, null, 2));

  await page.close();
  await browser.close();
}

run().catch(console.error);
