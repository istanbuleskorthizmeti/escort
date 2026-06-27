import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/git";
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(6000);

    console.log(`URL: ${page.url()}`);
    console.log(`Title: ${await page.title()}`);
    
    // Log all buttons on the page
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button, a')).map(el => ({
        text: (el as HTMLElement).innerText || '',
        id: el.id,
        className: el.className
      }));
    });
    console.log("Buttons found:", buttons);

    // Try to find a Sync or Pull button
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      const syncBtn = btns.find(b => {
        const txt = (b as HTMLElement).innerText.toLowerCase();
        return txt.includes('sync') || txt.includes('pull') || txt.includes('refresh') || txt.includes('import');
      });
      if (syncBtn) {
        (syncBtn as HTMLElement).click();
        return (syncBtn as HTMLElement).innerText;
      }
      return null;
    });

    console.log("Clicked button:", clicked);
    if (clicked) {
      await page.waitForTimeout(6000);
      await page.screenshot({ path: 'readme-after-sync-clicked.png' });
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
