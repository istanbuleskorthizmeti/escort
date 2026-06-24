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
    
    console.log(`🎯 Found GSC page. Navigating to Robots.txt report...`);
    const robotsTxtReportUrl = 'https://search.google.com/search-console/settings/robots-txt?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F';
    await targetPage.goto(robotsTxtReportUrl, { waitUntil: 'networkidle', timeout: 45000 });
    await targetPage.waitForTimeout(5000);
    
    await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-robots-page.png') });
    console.log("📸 Saved gsc-robots-page.png");
    
    const bodyText = await targetPage.evaluate(() => document.body.innerText);
    fs.writeFileSync('gsc-robots-text.txt', bodyText);
    console.log("📝 Saved gsc-robots-text.txt");
    
    // Output relevant text lines
    const lines = bodyText.split('\n');
    console.log("=== ROBOTS.TXT REPORT SUMMARY ===");
    for (const line of lines) {
      console.log(line);
    }
    
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
