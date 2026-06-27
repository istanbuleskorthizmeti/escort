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

    // Find all elements that mention "sync" or "repository"
    const mentions = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements
        .filter(el => {
          if (el.children.length > 0) return false; // leaf nodes only
          const text = el.textContent || '';
          return text.toLowerCase().includes('sync') || text.toLowerCase().includes('repository') || text.toLowerCase().includes('github');
        })
        .map(el => ({
          tag: el.tagName,
          text: el.textContent?.trim(),
          html: el.outerHTML,
          parentTag: el.parentElement?.tagName,
          parentClass: el.parentElement?.className
        }));
    });

    console.log("=== SYNC/REPOSITORY/GITHUB MENTIONS ===");
    console.log(JSON.stringify(mentions, null, 2));

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
