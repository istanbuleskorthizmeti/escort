import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    await page.goto("https://dash.readme.com/to/istanbul-eskort-hizmeti", { waitUntil: 'load' });
    await page.waitForTimeout(5000);
    
    console.log("URL:", page.url());
    console.log("Title:", await page.title());
    console.log("Text content:");
    console.log(await page.evaluate(() => document.body.innerText));

    const elements = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a, button, input')).map(el => ({
        tag: el.tagName,
        text: (el as HTMLElement).innerText || '',
        href: (el as HTMLAnchorElement).href || '',
        id: el.id,
        className: el.className
      }));
    });
    console.log("Interactive Elements:", elements);
    await page.screenshot({ path: 'readme-login-elements.png' });
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
