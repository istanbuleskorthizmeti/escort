import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://dash.readme.com/hub-go/istanbul-eskort-hizmeti?redirect=/v1.0";
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(10000);

    // Click Dashboard
    await page.evaluate(() => {
      const dashBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim().toLowerCase() === 'dashboard');
      if (dashBtn) dashBtn.click();
    });
    await page.waitForTimeout(6000);

    // Click Git Connection
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('*'));
      const gitLink = items.find(el => (el as HTMLElement).innerText?.trim() === 'Git Connection');
      if (gitLink) (gitLink as HTMLElement).click();
    });
    await page.waitForTimeout(6000);

    // Find the Card elements and print their text
    const hierarchy = await page.evaluate(() => {
      const allHeaders = Array.from(document.querySelectorAll('h4'));
      const targetHeader = allHeaders.find(h => h.innerText.includes('Docs repository'));
      if (!targetHeader) return ["Docs repository header not found"];
      
      const res: string[] = [];
      let el: HTMLElement | null = targetHeader;
      for (let i = 0; i < 6; i++) {
        if (!el) break;
        res.push(`Level ${i}: Tag=${el.tagName}, Class="${el.className}"\nText: ${el.innerText.substring(0, 300)}`);
        el = el.parentElement;
      }
      return res;
    });

    console.log("=== HIERARCHY ===");
    for (const h of hierarchy) {
      console.log(h);
      console.log("-----------------------------------------");
    }

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
