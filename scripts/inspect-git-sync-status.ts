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

    // Get all text from settings container
    const cardText = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.Card-bodyScMXSSG9CS_B, .Card1eL_kO08v30a, main'));
      return cards.map(c => (c as HTMLElement).innerText).join('\n---\n');
    });

    console.log("=== GIT CONFIG AND SYNC STATUS TEXT ===");
    console.log(cardText);

    await page.screenshot({ path: 'readme-git-sync-details.png' });

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
