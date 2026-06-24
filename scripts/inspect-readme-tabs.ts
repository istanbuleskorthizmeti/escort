import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  for (const ctx of contexts) {
    const pages = ctx.pages();
    for (const p of pages) {
      const url = p.url();
      if (url.includes('dash.readme.com')) {
        console.log(`\n🎯 Found ReadMe Tab: ${url}`);
        const title = await p.title();
        console.log(`Title: "${title}"`);
        
        // Take a screenshot of the tab as is (without navigating!)
        const safeName = url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 100);
        const screenshotPath = path.join(process.cwd(), `${safeName}.png`);
        try {
          await p.screenshot({ path: screenshotPath });
          console.log(`Saved screenshot: ${screenshotPath}`);
        } catch (e: any) {
          console.log(`Could not screenshot: ${e.message}`);
        }

        // Dump body text snippet
        try {
          const text = await p.evaluate(() => document.body.innerText);
          console.log(`Body text snippet (first 300 chars):\n${text.substring(0, 300)}`);
        } catch (e: any) {
          console.log(`Could not get body text: ${e.message}`);
        }
      }
    }
  }

  await browser.close();
}

run().catch(console.error);
