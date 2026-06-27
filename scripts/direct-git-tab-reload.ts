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

    console.log("Directly setting hash to #/settings/git and reloading...");
    await page.evaluate(() => {
      window.location.hash = '#/settings/git';
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
    await page.waitForTimeout(12000);

    console.log("Current URL:", page.url());
    await page.screenshot({ path: 'readme-direct-git-tab.png' });

    // Print all buttons and links in the entire body
    const items = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button, a, div[role="button"]')).map(el => ({
        tag: el.tagName,
        text: (el as HTMLElement).innerText.trim() || '',
        id: el.id,
        className: el.className
      })).filter(x => x.text.length > 0);
    });

    console.log("Interactive items on loaded page:");
    console.log(JSON.stringify(items, null, 2));

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
