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
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(10000);

    // Click Dashboard
    await page.evaluate(() => {
      const dashBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim().toLowerCase() === 'dashboard');
      if (dashBtn) dashBtn.click();
    });
    await page.waitForTimeout(6000);

    // Click Git Connection
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('*'));
      const gitLink = items.find(el => (el as HTMLElement).innerText?.trim() === 'Git Connection');
      if (gitLink) (gitLink as HTMLElement).click();
    });
    await page.waitForTimeout(6000);

    // Click the "Connected" dropdown button
    console.log("Clicking 'Connected' dropdown...");
    const clickedDropdown = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const connBtn = btns.find(b => b.innerText.includes('Connected'));
      if (connBtn) {
        connBtn.click();
        return true;
      }
      return false;
    });

    console.log("Dropdown clicked?", clickedDropdown);
    if (!clickedDropdown) {
      console.error("❌ 'Connected' button not found.");
      return;
    }

    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'readme-dropdown-opened.png' });

    // Print all options in the open dropdown/dialog
    const options = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('button, a, div[role="menuitem"], [role="option"]'));
      return items.map((el, idx) => ({
        index: idx,
        tagName: el.tagName,
        text: (el as HTMLElement).innerText?.trim() || '',
        html: el.outerHTML
      })).filter(x => x.text.length > 0);
    });
    console.log("Dropdown options found:", options);

    // Find and click the Resync/Sync option
    const clickedResync = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('button, a, div[role="menuitem"], [role="option"]'));
      // Find item with text containing Resync or Sync
      const resyncItem = items.find(el => {
        const txt = (el as HTMLElement).innerText.toLowerCase();
        return txt.includes('resync') || txt.includes('sync') || txt.includes('refresh') || txt.includes('pull');
      });

      if (resyncItem) {
        (resyncItem as HTMLElement).click();
        return (resyncItem as HTMLElement).innerText;
      }
      return null;
    });

    console.log("Clicked Resync Option:", clickedResync);

    if (clickedResync) {
      console.log("Waiting 15 seconds for sync to run...");
      await page.waitForTimeout(15000);
      await page.screenshot({ path: 'readme-resync-completed-new.png' });
      console.log("🎉 Sync triggered successfully!");
    } else {
      console.error("❌ Failed to find Resync option in dropdown.");
    }

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
