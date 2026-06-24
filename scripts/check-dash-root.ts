import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

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
        if (url.includes('dash.readme.com')) {
          targetPage = page;
          break;
        }
      }
      if (targetPage) break;
    }
    
    if (!targetPage) {
      console.error("❌ ReadMe dashboard page not found!");
      await browser.close();
      return;
    }
    
    console.log(`🎯 Navigating to dash.readme.com...`);
    await targetPage.goto('https://dash.readme.com/', { waitUntil: 'networkidle', timeout: 45000 });
    await targetPage.waitForTimeout(5000);
    
    await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-dash-root.png') });
    console.log("📸 Saved readme-dash-root.png");
    console.log("Current URL after navigation:", targetPage.url());
    
    const links = await targetPage.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map((a: any) => ({
        text: a.textContent.trim(),
        href: a.getAttribute('href') || ''
      })).filter(l => l.text.length > 0);
    });
    console.log("Found links on root:", links);
    
  } catch (err: any) {
    console.error("❌ Error:", err.message);
  }
}

run();
