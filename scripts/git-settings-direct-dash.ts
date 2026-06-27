import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting...");
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/git";
    console.log(`Navigating directly to Git settings on dash.readme.com: ${url}`);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(10000);

    console.log("URL:", page.url());
    console.log("Title:", await page.title());
    await page.screenshot({ path: 'readme-dash-git-tab.png' });

    // Print all text in the main/settings container
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("Page contains 'Resync'?", bodyText.includes('Resync'));
    console.log("Page contains 'GitHub'?", bodyText.includes('GitHub'));
    
    // Find all buttons
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button, a, div[role="button"]')).map(b => ({
        tag: b.tagName,
        text: (b as HTMLElement).innerText.trim() || '',
        className: b.className
      })).filter(x => x.text.length > 0);
    });
    console.log("Interactive elements found:", buttons);

    // Click Resync/Sync/Pull/Refresh
    const resyncClicked = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
      const target = items.find(el => {
        const txt = (el as HTMLElement).innerText.toLowerCase();
        if (txt.includes('learn more') || txt.includes('documentation')) return false;
        return txt.includes('sync') || txt.includes('pull') || txt.includes('resync') || txt.includes('refresh') || txt.includes('import');
      });
      if (target) {
        (target as HTMLElement).click();
        return (target as HTMLElement).innerText;
      }
      return null;
    });

    console.log("Clicked Sync Button:", resyncClicked);
    if (resyncClicked) {
      console.log("Waiting 15 seconds for sync to complete...");
      await page.waitForTimeout(15000);
      await page.screenshot({ path: 'readme-dash-sync-completed.png' });
      console.log("🎉 Sync triggered successfully!");
    } else {
      console.log("❌ Resync button not found.");
    }

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
