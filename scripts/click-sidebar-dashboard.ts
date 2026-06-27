import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://istanbul-eskort-hizmeti.readme.io/docs/getting-started";
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(8000);

    console.log("Clicking the Dashboard button in the sidebar...");
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const dashBtn = btns.find(b => b.innerText.trim().toLowerCase() === 'dashboard');
      if (dashBtn) {
        dashBtn.click();
        return true;
      }
      return false;
    });

    console.log("Clicked:", clicked);
    await page.waitForTimeout(6000);

    console.log("Current URL:", page.url());
    console.log("Current Title:", await page.title());
    await page.screenshot({ path: 'readme-after-clicking-dashboard.png' });

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
