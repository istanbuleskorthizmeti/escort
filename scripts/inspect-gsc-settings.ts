import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

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
      console.error("❌ Google Search Console page not found!");
      return;
    }
    
    console.log(`🎯 Found GSC page. Navigating to Settings...`);
    const settingsUrl = 'https://search.google.com/search-console/settings?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F';
    await targetPage.goto(settingsUrl, { waitUntil: 'networkidle', timeout: 45000 });
    await targetPage.waitForTimeout(5000);
    
    await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-settings-page.png') });
    console.log("📸 Saved gsc-settings-page.png");
    
    const bodyText = await targetPage.evaluate(() => document.body.innerText);
    fs.writeFileSync('gsc-settings-text.txt', bodyText);
    console.log("📝 Saved gsc-settings-text.txt");
    
    // Look for robots.txt or crawl status links
    const links = await targetPage.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map((a: any) => ({
        text: a.textContent.trim(),
        href: a.getAttribute('href') || ''
      })).filter(l => l.text.toLowerCase().includes('robots') || l.href.toLowerCase().includes('robots'));
    });
    console.log("Robots.txt links on Settings page:", links);
    
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
