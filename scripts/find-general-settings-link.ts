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
        if (page.url().includes('dash.readme.com')) {
          targetPage = page;
          break;
        }
      }
      if (targetPage) break;
    }
    if (!targetPage) {
      console.error("❌ No ReadMe tab!");
      return;
    }
    
    // Find link containing 'General Settings' or similar
    const links = await targetPage.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map((a: any) => ({
        text: a.textContent.trim(),
        href: a.getAttribute('href') || ''
      })).filter(l => l.text.toLowerCase().includes('general') || l.text.toLowerCase().includes('settings'));
    });
    console.log("Settings links found:", links);
    
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
