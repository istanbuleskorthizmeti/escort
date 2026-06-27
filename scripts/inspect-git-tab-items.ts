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
      const gitLink = Array.from(document.querySelectorAll('*')).find(el => (el as HTMLElement).innerText?.trim() === 'Git Connection');
      if (gitLink) (gitLink as HTMLElement).click();
    });
    await page.waitForTimeout(6000);

    // Print all buttons, inputs, links on the Git Settings tab
    const items = await page.evaluate(() => {
      // Find elements inside the main content area
      const main = document.querySelector('main, .SettingsContainer, [role="main"]') || document.body;
      return Array.from(main.querySelectorAll('button, a, input, div[role="button"]')).map(el => ({
        tag: el.tagName,
        text: (el as HTMLElement).innerText.trim() || '',
        id: el.id,
        className: el.className,
        href: (el as HTMLAnchorElement).href || ''
      })).filter(x => x.text.length > 0 || x.tag === 'INPUT');
    });

    console.log("Git Connection page items:", items);
    await page.screenshot({ path: 'readme-git-tab-items.png' });

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
