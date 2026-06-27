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

  const elementsInfo = await page.evaluate(() => {
    const dialog = document.querySelector('div[role="dialog"]');
    if (!dialog) return 'No dialog found';
    
    // Find all elements containing text "Tam"
    const results: any[] = [];
    const elements = dialog.querySelectorAll('*');
    elements.forEach(el => {
      const text = el.textContent || '';
      if (text.includes('Tam')) {
        results.push({
          tagName: el.tagName,
          className: el.className,
          role: el.getAttribute('role'),
          innerText: (el as HTMLElement).innerText,
          outerHTML: el.outerHTML.substring(0, 200)
        });
      }
    });
    return results;
  });

  console.log("Elements in dialog containing 'Tam':", JSON.stringify(elementsInfo, null, 2));

  await page.close();
  await browser.close();
}

run().catch(console.error);
