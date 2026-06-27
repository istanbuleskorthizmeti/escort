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

    // Print all buttons on the entire page
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).map((b, idx) => ({
        index: idx,
        text: b.innerText.trim(),
        html: b.outerHTML
      }));
    });

    console.log("=== ALL BUTTONS DUMP ===");
    for (const b of buttons) {
      if (b.html.toLowerCase().includes('sync') || b.html.toLowerCase().includes('pull') || b.html.toLowerCase().includes('git') || b.text.length > 0) {
        console.log(`Index: ${b.index}, Text: "${b.text}"`);
        console.log(`HTML: ${b.html}`);
        console.log("-----------------------------------------");
      }
    }

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
