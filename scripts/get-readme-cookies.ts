import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  for (let i = 0; i < contexts.length; i++) {
    const ctx = contexts[i];
    const cookies = await ctx.cookies();
    const readmeCookies = cookies.filter(c => c.domain.includes('readme.com'));
    console.log(`Context ${i} has ${readmeCookies.length} ReadMe cookies.`);
    if (readmeCookies.length > 0) {
      fs.writeFileSync('readme-cookies.json', JSON.stringify(readmeCookies, null, 2));
      console.log("Saved readme-cookies.json!");
    }
  }

  await browser.close();
}

run().catch(console.error);
