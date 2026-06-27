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

    // Click Dashboard
    console.log("Clicking 'Dashboard'...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const dashBtn = btns.find(b => b.innerText.trim().toLowerCase() === 'dashboard');
      if (dashBtn) dashBtn.click();
    });
    await page.waitForTimeout(8000);

    // Click Git Connection
    console.log("Clicking 'Git Connection'...");
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('*'));
      const gitLink = items.find(el => (el as HTMLElement).innerText?.trim() === 'Git Connection');
      if (gitLink) (gitLink as HTMLElement).click();
    });
    await page.waitForTimeout(8000);

    // Take screenshot of the Git connection page to verify it's open
    await page.screenshot({ path: 'readme-subdomain-git-open.png' });

    // Print all buttons on this tab
    const buttons = await page.evaluate(() => {
      // Find buttons inside the settings content container or active panel
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.map((b, idx) => ({
        index: idx,
        text: b.innerText.trim(),
        html: b.outerHTML,
        className: b.className
      }));
    });
    console.log("All buttons found on settings page:", buttons);

    // Try to find the Resync button. In Git Connection, it usually has an icon (like SVG path) or specific title.
    // Let's click the button that has a class containing 'secondary' or has an icon with no text, and is inside the settings area.
    const clickResult = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      
      // Let's filter for buttons that do not have text, or have text like "Resync" / "Sync"
      const resyncBtn = btns.find(b => {
        const html = b.outerHTML.toLowerCase();
        const className = b.className.toLowerCase();
        
        // Exclude sidebar navigation, copy page, search, etc.
        if (className.includes('splitbutton') || className.includes('pagethumbs') || className.includes('dropdown-toggle')) return false;
        
        // Look for sync/pull indicators in outerHTML or className
        return html.includes('sync') || html.includes('pull') || html.includes('refresh') || html.includes('import') || (b.innerText.trim().length === 0 && className.includes('button_secondary'));
      });

      if (resyncBtn) {
        (resyncBtn as HTMLElement).click();
        return {
          success: true,
          html: resyncBtn.outerHTML
        };
      }
      return { success: false, html: null };
    });

    console.log("Click result:", clickResult);
    if (clickResult.success) {
      console.log("Waiting 15 seconds for sync to run...");
      await page.waitForTimeout(15000);
      await page.screenshot({ path: 'readme-subdomain-sync-completed.png' });
    }

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
