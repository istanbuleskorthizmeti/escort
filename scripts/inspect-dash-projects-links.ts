import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    await page.goto("https://dash.readme.com/", { waitUntil: 'load' });
    await page.waitForTimeout(6000);
    
    console.log("URL:", page.url());
    console.log("Title:", await page.title());

    const projectLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.map(a => ({
        text: a.innerText.trim(),
        href: a.href
      })).filter(item => item.href.includes('dash.readme.com/project') || item.text.length > 0);
    });

    console.log("Project Links found on Dashboard:", projectLinks);
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
