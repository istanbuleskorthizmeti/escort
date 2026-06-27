import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

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
  
  // Find the active page or the page that matches 'istanbul-eskort-hizmeti.readme.io/docs/istanbul-escort'
  const targetPage = pages.find(p => p.url().includes('istanbul-eskort-hizmeti.readme.io/docs/istanbul-escort'));
  
  if (!targetPage) {
    console.error("❌ Active target page not found in open tabs!");
    // List open tabs
    pages.forEach(p => console.log(`- ${p.url()}`));
    await browser.close();
    return;
  }

  console.log(`🔍 Found target page: ${targetPage.url()}`);
  
  // Get text of the main content area
  const content = await targetPage.evaluate(() => {
    const mainEl = document.querySelector('article') || document.querySelector('.markdown-body') || document.body;
    return mainEl ? mainEl.innerText : 'No main element found';
  });

  console.log("\n📄 --- PAGE CONTENT ---");
  console.log(content.substring(0, 2000));
  console.log("-----------------------\n");

  await browser.close();
}

run().catch(console.error);
