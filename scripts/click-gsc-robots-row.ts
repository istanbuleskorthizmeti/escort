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
        if (page.url().includes('search.google.com/search-console/settings/robots-txt')) {
          targetPage = page;
          break;
        }
      }
      if (targetPage) break;
    }
    if (!targetPage) {
      console.error("❌ GSC Robots.txt settings page not found!");
      return;
    }
    
    console.log(`🎯 Found GSC Robots.txt page. Clicking on the row...`);
    const row = targetPage.locator('text=https://istanbul-eskort-hizmeti.readme.io/robots.txt');
    if (await row.count() > 0) {
      await row.first().click();
      console.log("Clicked row. Waiting 5 seconds...");
      await targetPage.waitForTimeout(5000);
      
      await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-robots-details.png') });
      console.log("📸 Saved gsc-robots-details.png");
      
      const text = await targetPage.evaluate(() => document.body.innerText);
      fs.writeFileSync('gsc-robots-details.txt', text);
      console.log("📝 Saved gsc-robots-details.txt");
    } else {
      console.log("❌ Row not found by exact text, trying general table row click...");
      const tr = targetPage.locator('tr').filter({ hasText: 'robots.txt' });
      if (await tr.count() > 0) {
        await tr.first().click();
        console.log("Clicked row via TR. Waiting 5 seconds...");
        await targetPage.waitForTimeout(5000);
        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-robots-details.png') });
        const text = await targetPage.evaluate(() => document.body.innerText);
        fs.writeFileSync('gsc-robots-details.txt', text);
      } else {
        console.log("❌ No table row found!");
      }
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
