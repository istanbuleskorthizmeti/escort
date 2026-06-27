import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to browser...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    console.log("Clearing cookies/storage for ReadMe...");
    await page.goto("https://dash.readme.com/", { waitUntil: 'load' });
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    console.log("Navigating to login page...");
    await page.goto("https://dash.readme.com/to/istanbul-eskort-hizmeti", { waitUntil: 'load' });
    await page.waitForTimeout(5000);
    console.log(`URL after navigation: ${page.url()}`);

    // If confirmation screen is shown (link sent), click Back
    const hasSentText = await page.evaluate(() => document.body.innerText.includes('link sent'));
    if (hasSentText) {
      console.log("Confirmation screen detected, clicking Back...");
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const back = btns.find(b => b.innerText.toLowerCase().includes('back'));
        if (back) back.click();
      });
      await page.waitForTimeout(4000);
    }

    console.log("Clicking Google OAuth button...");
    const clickedGoogle = await page.evaluate(() => {
      const googleBtn = document.querySelector('a[href*="/auth/google"]');
      if (googleBtn) {
        (googleBtn as HTMLElement).click();
        return true;
      }
      return false;
    });
    console.log("Clicked Google OAuth:", clickedGoogle);
    await page.waitForTimeout(6000);

    console.log(`URL after clicking Google: ${page.url()}`);
    await page.screenshot({ path: 'readme-google-click.png' });

    if (page.url().includes('accounts.google.com')) {
      console.log("Selecting info@dorukcanay.digital account...");
      await page.evaluate(() => {
        const emailDiv = document.querySelector('div[data-email="info@dorukcanay.digital"]');
        if (emailDiv) {
          (emailDiv as HTMLElement).click();
        } else {
          const firstAccount = document.querySelector('li div[role="link"]');
          if (firstAccount) (firstAccount as HTMLElement).click();
        }
      });
      await page.waitForTimeout(8000);
    }

    console.log(`Current URL after Google OAuth: ${page.url()}`);
    await page.screenshot({ path: 'readme-logged-in-dorukcanay.png' });

    // Now navigate to the git page
    console.log("Navigating to git settings...");
    await page.goto("https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/git", { waitUntil: 'load' });
    await page.waitForTimeout(8000);

    console.log(`Git settings page URL: ${page.url()}`);
    console.log(`Title: ${await page.title()}`);
    await page.screenshot({ path: 'readme-dorukcanay-git-settings.png' });

    // Find and click any manual trigger/pull/sync buttons
    const triggerClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
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

    console.log("Triggered Sync Button Clicked:", triggerClicked);
    if (triggerClicked) {
      await page.waitForTimeout(6000);
      await page.screenshot({ path: 'readme-dorukcanay-after-sync.png' });
    }

  } catch (err: any) {
    console.error("Error during execution:", err.message);
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
