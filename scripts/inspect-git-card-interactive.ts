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

    // Let's print all interactive elements inside the parent of "Docs repository"
    const gitCardElements = await page.evaluate(() => {
      const allHeaders = Array.from(document.querySelectorAll('h4'));
      const targetHeader = allHeaders.find(h => h.innerText.includes('Docs repository'));
      if (!targetHeader) return ["Docs repository header not found"];
      
      // Let's go up 4 levels to the Card container
      let card = targetHeader.parentElement;
      for (let i = 0; i < 4; i++) {
        if (card) card = card.parentElement;
      }

      if (!card) return ["Card container not found"];

      // Find all buttons, links, svgs inside this card
      const interactive = Array.from(card.querySelectorAll('button, a, svg, div[role="button"]'));
      return interactive.map((el, idx) => ({
        index: idx,
        tagName: el.tagName,
        className: el.className,
        text: (el as HTMLElement).innerText?.trim() || '',
        html: el.outerHTML
      }));
    });

    console.log("=== CARD INTERACTIVE ELEMENTS ===");
    console.log(JSON.stringify(gitCardElements, null, 2));

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
