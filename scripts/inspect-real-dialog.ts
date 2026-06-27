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
  
  const threeDots = row.locator('div[role="button"]').first();
  await threeDots.click();
  await page.waitForTimeout(1000);

  // Click "Erişimi kaldır"
  const removeOption = page.locator('span[role="menuitem"][aria-label="Erişimi kaldır"]').filter({ visible: true }).first();
  await removeOption.click();
  await page.waitForTimeout(2000);

  // Find the dialog container by finding the element containing "Kullanıcı kaldırılsın mı?"
  const dialogHTML = await page.evaluate(() => {
    const header = Array.from(document.querySelectorAll('*')).find(el => (el as HTMLElement).innerText === 'Kullanıcı kaldırılsın mı?');
    if (!header) return 'Header not found';
    
    // Get the parent that looks like the dialog modal
    let parent = header.parentElement;
    while (parent && !parent.className.includes('iWO5td') && parent !== document.body) {
      parent = parent.parentElement;
    }
    return parent ? parent.outerHTML : 'Parent container not found';
  });

  console.log("Dialog HTML:\n", dialogHTML.substring(0, 5000));

  await page.close();
  await browser.close();
}

run().catch(console.error);
