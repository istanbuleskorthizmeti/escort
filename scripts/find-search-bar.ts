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
        if (page.url().includes('search.google.com/search-console')) {
          targetPage = page;
          break;
        }
      }
      if (targetPage) break;
    }
    if (!targetPage) {
      console.error("GSC page not found!");
      return;
    }
    
    console.log(`🎯 Found page: ${targetPage.url()}`);
    
    const inputs = await targetPage.evaluate(() => {
      const elms = Array.from(document.querySelectorAll('input'));
      return elms.map(el => ({
        tag: el.tagName,
        type: el.type,
        placeholder: el.getAttribute('placeholder') || '',
        ariaLabel: el.getAttribute('aria-label') || '',
        class: el.className,
        outerHTML: el.outerHTML
      }));
    });
    
    console.log(`Found ${inputs.length} inputs:`);
    inputs.forEach((inp: any, idx: number) => {
      console.log(`Input ${idx}: placeholder="${inp.placeholder}" ariaLabel="${inp.ariaLabel}" class="${inp.class}"`);
      console.log(`  HTML: ${inp.outerHTML.substring(0, 300)}`);
    });
    
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
