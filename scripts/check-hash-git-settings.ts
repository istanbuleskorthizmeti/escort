import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://istanbul-eskort-hizmeti.readme.io/docs/getting-started#/settings/git";
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(8000);

    console.log("Current URL:", page.url());
    await page.screenshot({ path: 'readme-hash-git.png' });

    // Look for sync/pull buttons
    const btns = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button, a, [role="button"]')).map(el => ({
        text: (el as HTMLElement).innerText || '',
        tagName: el.tagName
      }));
    });
    console.log("Interactive buttons/links on git settings hash page:", btns);

    // Try to click resync
    const clicked = await page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('button, a, [role="button"]'));
      const syncBtn = allElements.find(el => {
        const txt = (el as HTMLElement).innerText.toLowerCase();
        return txt.includes('resync') || txt.includes('pull') || txt.includes('sync') || txt.includes('refresh') || txt.includes('import');
      });
      if (syncBtn) {
        (syncBtn as HTMLElement).click();
        return (syncBtn as HTMLElement).innerText;
      }
      return null;
    });

    console.log("Clicked:", clicked);
    if (clicked) {
      await page.waitForTimeout(10000);
      await page.screenshot({ path: 'readme-hash-git-after-sync.png' });
    }

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
