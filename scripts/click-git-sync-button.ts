import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to browser...");
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://istanbul-eskort-hizmeti.readme.io/docs/getting-started#/settings/git";
    console.log(`Navigating to Git Connection: ${url}`);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(10000);

    console.log("Locating the Resync button by class...");
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      // Find the button that has secondary outline class and has empty or very short text
      const resyncBtn = btns.find(b => {
        const isOutline = b.className.includes('Button_secondary_outline') && b.className.includes('Button_secondary');
        const isShortText = b.innerText.trim().length === 0;
        return isOutline && isShortText;
      });

      if (resyncBtn) {
        (resyncBtn as HTMLElement).click();
        return true;
      }
      return false;
    });

    console.log("Resync button clicked?", clicked);
    if (clicked) {
      console.log("Waiting 15 seconds for sync to complete...");
      await page.waitForTimeout(15000);
      await page.screenshot({ path: 'readme-sync-click-completed.png' });
      console.log("🎉 Resync triggered successfully!");
    } else {
      console.error("❌ Failed to find the Resync button.");
    }

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
