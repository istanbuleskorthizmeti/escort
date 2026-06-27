import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://istanbul-eskort-hizmeti.readme.io/docs/getting-started";
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(6000);

    console.log("Setting hash to #/settings/dashboard...");
    await page.evaluate(() => {
      window.location.hash = '#/settings/dashboard';
    });
    await page.waitForTimeout(8000);

    console.log("Clicking 'Git Connection' link...");
    const clicked = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const gitLink = links.find(a => a.innerText.trim() === 'Git Connection');
      if (gitLink) {
        gitLink.click();
        return true;
      }
      return false;
    });

    console.log("Clicked:", clicked);
    await page.waitForTimeout(8000);

    console.log("Current URL:", page.url());
    
    // Log text content of the settings block or page
    const textContent = await page.evaluate(() => {
      const settingsContainer = document.querySelector('.SettingsContainer, main, #root');
      return settingsContainer ? (settingsContainer as HTMLElement).innerText : document.body.innerText;
    });
    console.log("Page Content Snippet:");
    console.log(textContent.substring(0, 1500));

    // Find and list all interactive elements in the settings body
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button, a, input')).map(el => ({
        tag: el.tagName,
        text: (el as HTMLElement).innerText || '',
        id: el.id
      }));
    });
    console.log("Buttons/Inputs on Git Connection page:", buttons);

    await page.screenshot({ path: 'readme-git-connection-page.png' });

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
