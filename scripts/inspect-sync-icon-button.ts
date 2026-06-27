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

    // Inspect the actual HTML of all buttons on the page
    const buttons = await page.evaluate(() => {
      const main = document.querySelector('main, .SettingsContainer, [role="main"]') || document.body;
      return Array.from(main.querySelectorAll('button')).map(b => ({
        text: b.innerText.trim(),
        html: b.outerHTML,
        className: b.className,
        ariaLabel: b.getAttribute('aria-label'),
        title: b.getAttribute('title')
      }));
    });

    console.log("=== BUTTONS ON GIT TAB ===");
    console.log(JSON.stringify(buttons, null, 2));

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
