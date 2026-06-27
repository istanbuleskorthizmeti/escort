import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    console.log("Navigating to login page...");
    await page.goto("https://dash.readme.com/login", { waitUntil: 'load' });
    await page.waitForTimeout(8000);

    console.log("URL:", page.url());
    console.log("Title:", await page.title());
    
    const text = await page.evaluate(() => document.body.innerText);
    console.log("Page text:");
    console.log(text.substring(0, 1000));

    await page.screenshot({ path: 'login-failure.png' });
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
