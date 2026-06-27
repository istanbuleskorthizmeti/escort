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

    // Find and print all text inside cards in the main area
    const cardTexts = await page.evaluate(() => {
      const el = document.querySelector('.SettingsContainer, main');
      if (!el) return "SettingsContainer/main not found";
      
      // Get all child divs/p/h4
      const children = Array.from(el.querySelectorAll('h1, h2, h3, h4, p, span, div.CardBody-contentScMXSSG9CS_B'));
      return children.map(c => ({
        tag: c.tagName,
        text: (c as HTMLElement).innerText.trim()
      })).filter(x => x.text.length > 0);
    });

    console.log("=== GIT SETTINGS ELEMENTS ===");
    console.log(JSON.stringify(cardTexts, null, 2));

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
