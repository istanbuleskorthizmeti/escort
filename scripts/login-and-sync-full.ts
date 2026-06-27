import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to browser...");
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    console.log("Step 1: Navigating to ReadMe login page...");
    await page.goto("https://dash.readme.com/login", { waitUntil: 'load' });
    await page.waitForTimeout(5000);

    const isLoggedIn = await page.evaluate(() => document.body.innerText.includes('Good Evening') || document.body.innerText.includes('Projects'));
    if (!isLoggedIn) {
      console.log("Clicking Continue with Google...");
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const googleBtn = btns.find(b => b.innerText.toLowerCase().includes('google'));
        if (googleBtn) googleBtn.click();
      });
      await page.waitForTimeout(8000);

      if (page.url().includes('accounts.google.com')) {
        console.log("Selecting info@dorukcanay.digital Google account...");
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
    } else {
      console.log("Already logged in to ReadMe dashboard.");
    }

    console.log("Logged in URL:", page.url());
    await page.screenshot({ path: 'readme-logged-in-confirm.png' });

    console.log("Step 2: Navigating to hub-go redirect in the same tab...");
    await page.goto("https://dash.readme.com/hub-go/istanbul-eskort-hizmeti?redirect=/v1.0", { waitUntil: 'load' });
    await page.waitForTimeout(12000); // Wait for redirect and cookie write

    console.log("Redirected URL:", page.url());
    await page.screenshot({ path: 'readme-subdomain-redirected.png' });

    console.log("Step 3: Checking if admin sidebar is visible...");
    const sidebarVisible = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.innerText.trim().toLowerCase() === 'dashboard');
    });
    console.log("Sidebar visible?", sidebarVisible);

    if (sidebarVisible) {
      console.log("Clicking 'Dashboard' in sidebar...");
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const dashBtn = btns.find(b => b.innerText.trim().toLowerCase() === 'dashboard');
        if (dashBtn) dashBtn.click();
      });
      await page.waitForTimeout(8000);
      await page.screenshot({ path: 'readme-dashboard-hash-opened.png' });

      console.log("Clicking 'Git Connection' settings link...");
      const gitClicked = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const gitLink = links.find(a => a.innerText.trim() === 'Git Connection');
        if (gitLink) {
          gitLink.click();
          return true;
        }
        return false;
      });
      console.log("Clicked Git Connection:", gitClicked);
      await page.waitForTimeout(8000);
      await page.screenshot({ path: 'readme-git-connection-settings.png' });

      // Look for Resync / Sync / Refresh buttons
      const resyncBtnText = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
        const target = items.find(el => {
          const txt = (el as HTMLElement).innerText.toLowerCase();
          return txt.includes('resync') || txt.includes('pull') || txt.includes('sync') || txt.includes('refresh') || txt.includes('import');
        });
        if (target) {
          (target as HTMLElement).click();
          return (target as HTMLElement).innerText;
        }
        return null;
      });
      console.log("Clicked Sync Button:", resyncBtnText);
      if (resyncBtnText) {
        await page.waitForTimeout(10000);
        await page.screenshot({ path: 'readme-git-sync-done.png' });
      }
    } else {
      console.log("Error: Sidebar not visible. Maybe login expired or failed.");
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
