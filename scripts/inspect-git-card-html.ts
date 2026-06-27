import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
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

    // Find the Card elements and print their text
    const cardsText = await page.evaluate(() => {
      const allHeaders = Array.from(document.querySelectorAll('h4'));
      const targetHeader = allHeaders.find(h => h.innerText.includes('Docs repository') || h.innerText.includes('docs are synced'));
      if (!targetHeader) return "Target header not found";
      
      // Let's traverse up to the closest Card or container
      let parent: HTMLElement | null = targetHeader;
      while (parent && !parent.className.includes('SettingsContainer') && parent.tagName !== 'MAIN') {
        parent = parent.parentElement;
      }
      
      if (parent) {
        return {
          tagName: parent.tagName,
          className: parent.className,
          text: parent.innerText
        };
      }
      return "Parent container not found";
    });

    console.log("=== CONTAINER TEXT ===");
    console.log(JSON.stringify(cardsText, null, 2));

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
