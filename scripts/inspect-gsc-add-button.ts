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

  const elementsInfo = await page.evaluate(() => {
    const results: any[] = [];
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      const text = (el.textContent || '').toLowerCase();
      if (text.includes('kullanıcı ekle') || text.includes('kullanici ekle')) {
        results.push({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          role: el.getAttribute('role'),
          innerText: (el as HTMLElement).innerText,
          html: el.outerHTML.substring(0, 150)
        });
      }
    });
    return results;
  });

  console.log("📋 --- Case-insensitive Matches ---");
  console.log(JSON.stringify(elementsInfo.slice(-10), null, 2)); // Print last 10 matches (leaf nodes)

  await page.close();
  await browser.close();
}

run().catch(console.error);
