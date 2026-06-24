import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

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
    
    const links = await targetPage.evaluate(() => {
      const elms = Array.from(document.querySelectorAll('a'));
      return elms.map(el => ({
        text: el.innerText,
        href: el.getAttribute('href') || '',
        class: el.className,
        outerHTML: el.outerHTML
      }));
    });
    
    let out = `Found ${links.length} links:\n`;
    links.forEach((l: any, idx: number) => {
      out += `Link ${idx}: text="${l.text}" href="${l.href}" class="${l.class}"\n  HTML: ${l.outerHTML}\n\n`;
    });
    
    fs.writeFileSync('gsc-robots-links-all.txt', out);
    console.log("Saved gsc-robots-links-all.txt");
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
