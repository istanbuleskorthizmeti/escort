import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://istanbul-eskort-hizmeti.readme.io/docs/getting-started#/settings/git";
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(10000);

    const bodyText = await page.evaluate(() => {
      const container = document.querySelector('main, .SettingsContainer, [role="main"]') || document.body;
      return (container as HTMLElement).innerText;
    });

    console.log("=== GIT TAB TEXT ===");
    console.log(bodyText);

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
