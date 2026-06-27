import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to browser...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    console.log("Navigating to generic login page...");
    await page.goto("https://dash.readme.com/login", { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    console.log("Clearing active sessions...");
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Reload to ensure we are clean
    await page.goto("https://dash.readme.com/login", { waitUntil: 'load' });
    await page.waitForTimeout(4000);

    console.log("Clicking Continue with Google...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const googleBtn = btns.find(b => b.innerText.toLowerCase().includes('google'));
      if (googleBtn) googleBtn.click();
    });
    await page.waitForTimeout(6000);

    console.log(`URL after clicking Google: ${page.url()}`);
    await page.screenshot({ path: 'readme-google-oauth-clicked.png' });

    // Handle Google Account Chooser
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
      await page.waitForTimeout(10000);
    }

    console.log(`Logged in Dashboard URL: ${page.url()}`);
    await page.screenshot({ path: 'readme-logged-in-dorukcanay-generic.png' });

    // Verify projects
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("Dashboard preview:");
    console.log(bodyText.substring(0, 1000));

    // Navigate to Git Settings
    console.log("Navigating to git settings...");
    await page.goto("https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/git", { waitUntil: 'load' });
    await page.waitForTimeout(8000);
    console.log(`Git settings page: ${page.url()}`);
    await page.screenshot({ path: 'readme-sync-page-generic.png' });

    // Check for Manual Sync / Resync buttons
    const resyncClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
      // Look for Resync / Pull / Sync / Refresh
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
      await page.screenshot({ path: 'readme-sync-completed-generic.png' });
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
