import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
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

  const btn = page.locator('div[role="button"]').filter({ hasText: /Kullanıcı ekle/i }).first();
  await btn.click();
  await page.waitForTimeout(2000);

  const realDialogHtml = await page.evaluate(() => {
    const dialogs = document.querySelectorAll('div[role="dialog"]');
    for (const d of Array.from(dialogs)) {
      if (d.textContent && d.textContent.includes('E-posta adresi') && d.textContent.includes('İzin')) {
        return d.outerHTML;
      }
    }
    return 'No matching dialog found';
  });

  const outputPath = path.join(process.cwd(), 'scratch', 'real_dialog.html');
  fs.writeFileSync(outputPath, realDialogHtml, 'utf8');
  console.log("Real Dialog HTML saved to:", outputPath);

  await page.close();
  await browser.close();
}

run().catch(console.error);
