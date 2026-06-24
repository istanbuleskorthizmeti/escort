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
        if (page.url().includes('dash.readme.com') || page.url().includes('istanbul-eskort-hizmeti.readme.io')) {
          targetPage = page;
          break;
        }
      }
      if (targetPage) break;
    }
    if (!targetPage) {
      console.error("❌ No ReadMe/GSC tab!");
      return;
    }
    
    console.log(`🎯 Found page: ${targetPage.url()}`);
    await targetPage.bringToFront();
    
    // Navigate to project hub to ensure we are in the admin dashboard context
    console.log("Navigating to hub entry point...");
    await targetPage.goto('https://dash.readme.com/hub-go/istanbul-eskort-hizmeti?redirect=/v1.0', { waitUntil: 'networkidle', timeout: 45000 });
    await targetPage.waitForTimeout(5000);
    console.log(`URL before shortcut: ${targetPage.url()}`);
    
    // Press Control+,
    console.log("Pressing Control+, shortcut...");
    await targetPage.keyboard.press('Control+,');
    
    console.log("Waiting 5 seconds for page transition...");
    await targetPage.waitForTimeout(5000);
    
    console.log(`URL after shortcut: ${targetPage.url()}`);
    await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-general-settings-via-shortcut.png') });
    console.log("📸 Saved readme-general-settings-via-shortcut.png");
    
    const bodyText = await targetPage.evaluate(() => document.body.innerText);
    fs.writeFileSync('readme-shortcut-body.txt', bodyText);
    
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
