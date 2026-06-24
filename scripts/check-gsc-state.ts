import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  if (contexts.length === 0) {
    console.error("❌ No contexts found!");
    return;
  }

  const context = contexts[0];
  const pages = context.pages();
  
  const gscPage = pages.find(p => p.url().includes('search.google.com/search-console'));
  if (!gscPage) {
    console.error("❌ GSC page not found!");
    await browser.close();
    return;
  }

  try {
    console.log("Found GSC tab. Checking current state...");
    const url = gscPage.url();
    const text = await gscPage.innerText('body');
    const title = await gscPage.title();

    console.log("URL:", url);
    console.log("Title:", title);
    console.log("Page Text Snippet:", text.substring(0, 1000));

    await gscPage.screenshot({ path: path.join(process.cwd(), 'gsc-current-state.png') });
    console.log("Screenshot saved: gsc-current-state.png");

  } catch (err: any) {
    console.error("Error checking GSC:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
