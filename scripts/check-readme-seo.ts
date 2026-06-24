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
        if (url.includes('dash.readme.com/project/istanbul-eskort-hizmeti')) {
          targetPage = page;
          break;
        }
      }
      if (targetPage) break;
    }
    
    if (!targetPage) {
      console.error("❌ ReadMe dashboard page not found in active browser tabs!");
      await browser.close();
      return;
    }
    
    console.log(`🎯 Found ReadMe page. Navigating to project overview home...`);
    await targetPage.goto('https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/', { waitUntil: 'networkidle', timeout: 45000 });
    await targetPage.waitForTimeout(5000);
    
    await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-overview-loaded.png') });
    console.log("📸 Saved readme-overview-loaded.png");
    
    // Click on Configuration to expand it
    console.log("Clicking 'Configuration' sidebar header...");
    const configHeader = targetPage.locator('a').filter({ hasText: 'Configuration' });
    if (await configHeader.count() > 0) {
      await configHeader.first().click();
      console.log("Clicked Configuration. Waiting 3 seconds...");
      await targetPage.waitForTimeout(3000);
      
      await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-config-expanded.png') });
      console.log("📸 Saved readme-config-expanded.png");
      
      // Get all links in the sidebar
      const links = await targetPage.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a'));
        return anchors.map((a: any) => ({
          text: a.textContent.trim(),
          href: a.getAttribute('href') || ''
        })).filter(l => l.text.length > 0);
      });
      console.log("=== ALL LINKS IN DOM ===");
      console.log(links);
    } else {
      console.log("❌ 'Configuration' link not found!");
    }
    
  } catch (err: any) {
    console.error("❌ Error in checking ReadMe settings:", err.message);
  }
}

run();
