import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://dash.readme.com/hub-go/istanbul-eskort-hizmeti?redirect=/v1.0";
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(8000);
    
    console.log("Final URL:", page.url());
    console.log("Title:", await page.title());

    // Try navigating to /git under the final URL prefix
    // E.g., if page.url() is https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/
    // Let's extract the project path
    const match = page.url().match(/https:\/\/dash\.readme\.com\/project\/[^/]+\/[^/]+/);
    if (match) {
      const gitUrl = `${match[0]}/git`;
      console.log(`Navigating to git settings at: ${gitUrl}`);
      await page.goto(gitUrl, { waitUntil: 'load' });
      await page.waitForTimeout(6000);
      console.log("Git settings page URL:", page.url());
      await page.screenshot({ path: 'readme-dorukcanay-git-settings-direct.png' });

      // Check for Resync / Sync / Refresh buttons
      const resyncClicked = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
        const syncBtn = btns.find(b => {
          const txt = (b as HTMLElement).innerText.toLowerCase();
          return txt.includes('resync') || txt.includes('pull') || txt.includes('sync') || txt.includes('refresh') || txt.includes('import');
        });
        if (syncBtn) {
          (syncBtn as HTMLElement).click();
          return (syncBtn as HTMLElement).innerText;
        }
        return null;
      });
      console.log("Resync button clicked:", resyncClicked);
      if (resyncClicked) {
        await page.waitForTimeout(10000);
        await page.screenshot({ path: 'readme-dorukcanay-sync-completed.png' });
      }
    } else {
      console.log("Could not parse project path from URL:", page.url());
      await page.screenshot({ path: 'readme-hub-error.png' });
    }
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
