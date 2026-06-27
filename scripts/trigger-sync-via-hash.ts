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
    console.log(`Navigating to hub-go redirect: ${url}...`);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(10000); // Wait for redirect and SSO cookies
 
    console.log(`URL after redirect: ${page.url()}`);
    await page.screenshot({ path: 'readme-after-redirect.png' });

    console.log("Clicking the Dashboard button in the sidebar...");
    const dashClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const dashBtn = btns.find(b => b.innerText.trim().toLowerCase() === 'dashboard');
      if (dashBtn) {
        dashBtn.click();
        return true;
      }
      return false;
    });
    console.log("Clicked Dashboard:", dashClicked);
    await page.waitForTimeout(8000);

    console.log("Locating and clicking 'Git Connection' in settings menu...");
    const clicked = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const gitLink = links.find(a => a.innerText.trim() === 'Git Connection');
      if (gitLink) {
        gitLink.click();
        return true;
      }
      return false;
    });
    console.log("Clicked Git Connection link:", clicked);
    await page.waitForTimeout(8000);

    console.log("Current URL:", page.url());
    await page.screenshot({ path: 'readme-git-settings-rendered.png' });

    // Print all text in the settings content area
    const contentText = await page.evaluate(() => {
      // Find main content block
      const main = document.querySelector('main, .SettingsContainer, [role="main"]');
      return main ? (main as HTMLElement).innerText : document.body.innerText;
    });
    console.log("=== Git settings content ===");
    console.log(contentText.substring(0, 1500));

    // Find any buttons in the settings content area (like Sync, Pull, Trigger, manual, etc.)
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button, a, input')).map(el => ({
        tag: el.tagName,
        text: (el as HTMLElement).innerText.trim() || '',
        id: el.id,
        className: el.className
      })).filter(b => b.text.length > 0 || b.tag === 'INPUT');
    });
    console.log("Interactive buttons on Git settings:", buttons);

    // Look for sync/pull trigger
    const syncResult = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
      const target = items.find(el => {
        const txt = (el as HTMLElement).innerText.toLowerCase();
        return txt.includes('sync') || txt.includes('pull') || txt.includes('resync') || txt.includes('import') || txt.includes('refresh');
      });
      if (target) {
        (target as HTMLElement).click();
        return (target as HTMLElement).innerText;
      }
      return null;
    });

    console.log("Triggered sync click:", syncResult);
    if (syncResult) {
      await page.waitForTimeout(10000);
      await page.screenshot({ path: 'readme-git-sync-completed.png' });
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
