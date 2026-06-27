import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  console.log(`Open pages: ${pages.length}`);
  
  if (pages.length > 0) {
    const page = pages[pages.length - 1]; // get the last page
    console.log(`Current page URL: ${page.url()}`);
    const screenshotPath = path.join(process.cwd(), 'scratch', 'gsc_live_state.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to: ${screenshotPath}`);
  }
  
  await browser.close();
}

run().catch(console.error);
