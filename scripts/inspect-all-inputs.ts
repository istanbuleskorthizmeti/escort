import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

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
  await page.waitForTimeout(2000);

  console.log("Inspecting ALL inputs on page...");
  const inputsInfo = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input, [contenteditable="true"]');
    return Array.from(inputs).map(input => ({
      tagName: input.tagName,
      type: (input as HTMLInputElement).type || null,
      role: input.getAttribute('role'),
      className: input.className,
      name: (input as HTMLInputElement).name || null,
      placeholder: (input as HTMLInputElement).placeholder || null,
      ariaLabel: input.getAttribute('aria-label'),
      outerHTML: input.outerHTML.substring(0, 300)
    }));
  });

  console.log("All inputs/editable elements:", JSON.stringify(inputsInfo, null, 2));

  await page.close();
  await browser.close();
}

run().catch(console.error);
