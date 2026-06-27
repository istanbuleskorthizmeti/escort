import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    console.log("Navigating to settings page...");
    // Go to project dashboard first to let the cookies settle
    await page.goto("https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/general", { waitUntil: 'load' });
    await page.waitForTimeout(6000);

    console.log(`Current URL: ${page.url()}`);
    console.log(`Current Title: ${await page.title()}`);

    // Screenshot first
    await page.screenshot({ path: 'readme-settings-general.png' });

    // Look for Git Connection menu or link
    console.log("Locating Git Connection menu link...");
    const gitLinkFound = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const target = links.find(a => a.innerText.toLowerCase().includes('git') || a.href.includes('/git'));
      if (target) {
        target.click();
        return true;
      }
      return false;
    });

    if (!gitLinkFound) {
      console.log("Git Connection link not clicked automatically, navigating directly to Git settings...");
      await page.goto("https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/git", { waitUntil: 'load' });
      await page.waitForTimeout(5000);
    } else {
      await page.waitForTimeout(5000);
    }

    console.log(`Current URL at Git Settings: ${page.url()}`);
    await page.screenshot({ path: 'readme-git-settings.png' });

    // Look for "Manage connection" or dropdown
    const disconnected = await page.evaluate(async () => {
      // Find "Manage connection" button or similar
      const btns = Array.from(document.querySelectorAll('button, a, div'));
      const manageBtn = btns.find(b => (b as HTMLElement).innerText.toLowerCase().includes('manage connection'));
      if (manageBtn) {
        (manageBtn as HTMLElement).click();
        // Wait 2 seconds
        await new Promise(r => setTimeout(r, 2000));
      }

      // Look for "Connected" dropdown
      const dropdowns = Array.from(document.querySelectorAll('button, div[role="button"]'));
      const connectedDropdown = dropdowns.find(d => (d as HTMLElement).innerText.toLowerCase().includes('connected'));
      if (connectedDropdown) {
        (connectedDropdown as HTMLElement).click();
        await new Promise(r => setTimeout(r, 2000));
        
        // Find "Disconnect Repository" in the dropdown list
        const menuItems = Array.from(document.querySelectorAll('li, button, span, a'));
        const disconnectItem = menuItems.find(item => (item as HTMLElement).innerText.toLowerCase().includes('disconnect'));
        if (disconnectItem) {
          (disconnectItem as HTMLElement).click();
          await new Promise(r => setTimeout(r, 2000));

          // Confirm disconnect modal if any
          const confirmBtns = Array.from(document.querySelectorAll('button'));
          const confirmBtn = confirmBtns.find(b => b.innerText.toLowerCase() === 'disconnect' || b.innerText.toLowerCase().includes('confirm'));
          if (confirmBtn) {
            confirmBtn.click();
            await new Promise(r => setTimeout(r, 3000));
            return "SUCCESS";
          }
        }
      }
      return "NOT_FOUND";
    });

    console.log("Disconnect result:", disconnected);
    await page.screenshot({ path: 'readme-disconnect-result.png' });

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
