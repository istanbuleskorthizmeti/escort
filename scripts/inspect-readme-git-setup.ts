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
  
  // Find page by page ID or by checking if the URL contains docs/getting-started
  const targetPage = pages.find(p => p.url().includes('istanbul-eskort-hizmeti.readme.io/docs/getting-started'));
  
  if (!targetPage) {
    console.error("❌ Target page docs/getting-started not found!");
    await browser.close();
    return;
  }

  console.log(`Found target page: ${targetPage.url()}`);
  
  const info = await targetPage.evaluate(() => {
    return {
      url: window.location.href,
      title: document.title,
      text: document.body.innerText.substring(0, 2000)
    };
  });

  console.log("Page info:", info);
  await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-git-setup.png') });
  console.log("Screenshot saved: readme-git-setup.png");

  await browser.close();
}

run().catch(console.error);
