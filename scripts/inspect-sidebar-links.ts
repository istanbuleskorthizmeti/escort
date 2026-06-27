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
    
    console.log("Current URL:", page.url());
    console.log("Current Title:", await page.title());

    // Extract all links in the admin sidebar on the left
    const sidebarLinks = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('a, button, div[role="button"]'));
      return items.map(el => ({
        text: (el as HTMLElement).innerText.trim(),
        href: (el as HTMLAnchorElement).href || '',
        tagName: el.tagName
      })).filter(item => item.text.length > 0);
    });

    console.log("All page interactive items:", sidebarLinks);
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
