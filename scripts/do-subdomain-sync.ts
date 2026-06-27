import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to browser...");
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const url = "https://dash.readme.com/hub-go/istanbul-eskort-hizmeti?redirect=/v1.0";
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load' });
    
    console.log("Waiting 12 seconds for redirects, SSO cookies, and React mount...");
    await page.waitForTimeout(12000);

    console.log(`Current URL: ${page.url()}`);
    console.log("Interactive buttons found on load:");
    const initialButtons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
    });
    console.log(initialButtons);

    console.log("Checking if Dashboard button is in DOM...");
    let dashboardClicked = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      dashboardClicked = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const dashBtn = btns.find(b => b.innerText.trim().toLowerCase() === 'dashboard');
        if (dashBtn) {
          dashBtn.click();
          return true;
        }
        return false;
      });
      if (dashboardClicked) {
        console.log(`✅ Dashboard button found and clicked on attempt ${attempt}!`);
        break;
      }
      console.log(`⚠️ Attempt ${attempt}/5: Dashboard button not found. Waiting 4 seconds...`);
      await page.waitForTimeout(4000);
    }

    if (!dashboardClicked) {
      console.error("❌ Could not find Dashboard button!");
      await page.screenshot({ path: 'readme-dashboard-missing.png' });
      return;
    }

    console.log("Waiting for settings panel to render...");
    await page.waitForTimeout(8000);
    await page.screenshot({ path: 'readme-settings-panel.png' });

    console.log("Clicking 'Git Connection' settings link...");
    const gitClicked = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('*'));
      const gitLink = items.find(el => {
        const text = (el as HTMLElement).innerText || '';
        return text.trim() === 'Git Connection';
      });
      if (gitLink) {
        (gitLink as HTMLElement).click();
        return true;
      }
      return false;
    });
    console.log("Git Connection tab clicked:", gitClicked);
    await page.waitForTimeout(8000);
    await page.screenshot({ path: 'readme-git-tab.png' });

    console.log("Locating resync button...");
    const resyncClicked = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
      const syncBtn = items.find(el => {
        const txt = (el as HTMLElement).innerText.toLowerCase();
        return txt.includes('resync') || txt.includes('pull') || txt.includes('sync') || txt.includes('refresh') || txt.includes('import');
      });
      if (syncBtn) {
        (syncBtn as HTMLElement).click();
        return (syncBtn as HTMLElement).innerText;
      }
      return null;
    });

    console.log("Resync button action:", resyncClicked);
    if (resyncClicked) {
      console.log("Waiting 12 seconds for sync process to finish...");
      await page.waitForTimeout(12000);
      await page.screenshot({ path: 'readme-sync-success.png' });
      console.log("🎉 Sync triggered successfully!");
    } else {
      console.log("❌ Could not find resync button.");
    }

  } catch (err: any) {
    console.error("Error during do-subdomain-sync:", err.message);
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
