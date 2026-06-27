import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting...");
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://dash.readme.com/hub-go/istanbul-eskort-hizmeti?redirect=/v1.0";
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(10000);

    // Click Dashboard via DOM click (bypasses pointer intercept)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const dashBtn = btns.find(b => b.innerText.trim().toLowerCase() === 'dashboard');
      if (dashBtn) dashBtn.click();
    });
    await page.waitForTimeout(6000);

    // Click Git Connection via DOM click
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('*'));
      const gitLink = items.find(el => (el as HTMLElement).innerText?.trim() === 'Git Connection');
      if (gitLink) (gitLink as HTMLElement).click();
    });
    await page.waitForTimeout(6000);

    // List all interactive elements on the Git tab
    const elements = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('button, a, div[role="button"], input[type="button"], input[type="submit"]'));
      return items.map(el => ({
        tag: el.tagName,
        text: (el as HTMLElement).innerText.trim() || '',
        id: el.id,
        className: el.className,
        role: el.getAttribute('role'),
        type: el.getAttribute('type')
      })).filter(x => x.text.length > 0 || x.id || x.className);
    });

    console.log("ALL INTERACTIVE ELEMENTS ON GIT CONNECTION TAB:");
    console.log(JSON.stringify(elements, null, 2));

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
