import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://istanbul-eskort-hizmeti.readme.io/docs/getting-started#/settings/git";
    console.log(`Navigating directly to hash URL: ${url}`);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(10000);

    console.log("URL:", page.url());
    console.log("Title:", await page.title());
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("Includes 'BiDi'?", bodyText.includes('BiDi'));
    console.log("Includes 'Repository'?", bodyText.includes('Repository'));
    console.log("Includes 'GitHub'?", bodyText.includes('GitHub'));
    console.log("Includes 'Sync'?", bodyText.includes('Sync'));
    
    // Find all buttons
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).map(b => ({
        text: b.innerText.trim(),
        className: b.className
      }));
    });
    console.log("Buttons:", buttons);

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
