import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔗 Connecting to existing Chrome instance on port 9222...");
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    
    let targetPage: any = null;
    
    for (const context of contexts) {
      const pages = context.pages();
      for (const page of pages) {
        const url = page.url();
        if (url.includes('search.google.com/search-console')) {
          targetPage = page;
          break;
        }
      }
      if (targetPage) break;
    }
    
    if (!targetPage) {
      console.error("❌ Google Search Console page not found in active browser tabs!");
      await browser.close();
      return;
    }
    
    const buttons = await targetPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, [role="button"], .vR13t'));
      return btns.map(b => ({
        tagName: b.tagName,
        text: (b.textContent || '').trim().substring(0, 100),
        className: b.className,
        id: b.id
      }));
    });
    
    console.log("Found buttons:", buttons);
    
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
