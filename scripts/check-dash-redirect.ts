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
    console.log("Navigating to redirect URL...");
    await targetPage.goto('https://dash.readme.com/hub-go/istanbul-eskort-hizmeti?redirect=/v1.0', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log("Redirected URL:", targetPage.url());
    
    // Wait for page to fully load and grab text
    await targetPage.waitForTimeout(5000);
    console.log("URL after 5s:", targetPage.url());
    
    const links = await targetPage.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map((a: any) => ({
        text: a.textContent.trim(),
        href: a.getAttribute('href') || ''
      })).filter(l => l.text.length > 0);
    });
    console.log("Links on page:", links);
    
    const bodyText = await targetPage.evaluate(() => document.body.innerText);
    fs.writeFileSync('readme-redirect-body.txt', bodyText);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
