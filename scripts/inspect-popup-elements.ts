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

    // Click "Connected"
    await page.evaluate(() => {
      const connBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Connected'));
      if (connBtn) connBtn.click();
    });
    await page.waitForTimeout(4000);

    // Get all interactive-looking tags or items inside portals/popovers
    const items = await page.evaluate(() => {
      // Find all elements that were added to the body or inside overlays
      const all = Array.from(document.body.querySelectorAll('*'));
      
      // Let's filter for elements that contain text and are inside popovers/overlays
      return all
        .filter(el => {
          if (el.children.length > 0) return false; // leaf nodes only
          const txt = el.textContent?.trim() || '';
          return txt.length > 0;
        })
        .map(el => ({
          tag: el.tagName,
          text: el.textContent?.trim(),
          parentTag: el.parentElement?.tagName,
          parentClass: el.parentElement?.className,
          html: el.outerHTML
        }))
        .filter(x => {
          const t = x.text.toLowerCase();
          return t.includes('resync') || t.includes('sync') || t.includes('disconnect') || t.includes('connection');
        });
    });

    console.log("=== LEAF NODES IN POPUP/OVERLAYS ===");
    console.log(JSON.stringify(items, null, 2));

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
