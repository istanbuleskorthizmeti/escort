import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔗 Connecting...");
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let targetPage: any = null;
    for (const context of contexts) {
      const pages = context.pages();
      for (const page of pages) {
        if (page.url().includes('search.google.com/search-console/sitemaps')) {
          targetPage = page;
          break;
        }
      }
      if (targetPage) break;
    }
    if (!targetPage) {
      console.error("❌ Google Search Console page not found!");
      return;
    }
    
    console.log(`🎯 Found page: ${targetPage.url()}`);
    
    const elementsInfo = await targetPage.evaluate(() => {
      const all = Array.from(document.querySelectorAll('button, [role="button"], div, span'));
      return all.map((el: any) => {
        const txt = el.textContent ? el.textContent.trim() : '';
        return {
          tagName: el.tagName,
          text: txt,
          className: el.className || '',
          id: el.id || '',
          outerHTML: el.outerHTML.substring(0, 150)
        };
      }).filter(item => {
        const lower = item.text.toLowerCase();
        return lower.includes('gönder') || lower.includes('gonder') || lower.includes('submit');
      });
    });
    
    console.log("=== Matching Elements ===");
    console.log(JSON.stringify(elementsInfo, null, 2));
    
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
