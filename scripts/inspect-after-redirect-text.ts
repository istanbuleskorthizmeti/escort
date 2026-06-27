import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://istanbul-eskort-hizmeti.readme.io/docs/getting-started?redirect=%2Fv1.0";
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(6000);
    
    console.log("URL:", page.url());
    console.log("Title:", await page.title());
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("Body text contains 'Unable to render'?", bodyText.includes('Unable to render'));
    console.log("Body text contains 'Premium'?", bodyText.includes('Premium'));
    console.log("Body text contains 'Melissa'?", bodyText.includes('Melissa'));

    console.log("Body text preview (first 800 chars):");
    console.log(bodyText.substring(0, 800));
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
