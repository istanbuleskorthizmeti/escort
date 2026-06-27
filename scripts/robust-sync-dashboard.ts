import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting...");
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://dash.readme.com/hub-go/istanbul-eskort-hizmeti?redirect=/v1.0";
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(12000);

    console.log("Clicking 'Dashboard' button via Playwright locator...");
    await page.locator('button:has-text("Dashboard"), [role="button"]:has-text("Dashboard")').first().click();
    await page.waitForTimeout(6000);
    console.log("URL after clicking Dashboard:", page.url());

    console.log("Clicking 'Git Connection' link/button via Playwright locator...");
    await page.locator('text="Git Connection"').first().click();
    await page.waitForTimeout(6000);
    console.log("URL after clicking Git Connection:", page.url());

    // Print all text in settings content area
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("Body text includes 'Git'?", bodyText.includes('Git') || bodyText.includes('Repository'));

    console.log("Locating the Resync/Sync/Pull/Refresh button...");
    const syncButtonText = await page.evaluate(() => {
      // Find all buttons, links, etc.
      const items = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
      const btn = items.find(el => {
        const txt = (el as HTMLElement).innerText.toLowerCase();
        // Look for exact sync words but exclude generic informational links
        if (txt.includes('learn more') || txt.includes('documentation')) return false;
        return txt.includes('sync') || txt.includes('pull') || txt.includes('resync') || txt.includes('refresh') || txt.includes('import');
      });
      if (btn) {
        (btn as HTMLElement).click();
        return (btn as HTMLElement).innerText;
      }
      return null;
    });

    console.log("Clicked Sync Button:", syncButtonText);
    if (syncButtonText) {
      await page.waitForTimeout(10000);
      await page.screenshot({ path: 'readme-robust-sync-done.png' });
    } else {
      console.log("Locating all buttons on Git tab for debug:");
      const btns = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
      });
      console.log(btns);
      await page.screenshot({ path: 'readme-robust-sync-failed.png' });
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
