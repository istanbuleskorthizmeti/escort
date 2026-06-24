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
  const targetPage = pages.find(p => p.url().includes('istanbul-escort.readme.io/docs/istanbul-besiktas-escort'));
  
  if (!targetPage) {
    console.error("❌ Target page for Beşiktaş not found!");
    await browser.close();
    return;
  }

  const info = await targetPage.evaluate(() => {
    return {
      url: window.location.href,
      title: document.title,
      text: document.body.innerText.substring(0, 3000),
      html: document.body.innerHTML.substring(0, 3000)
    };
  });

  console.log("Page Info:", info);
  await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-besiktas-error.png') });
  console.log("Screenshot saved: readme-besiktas-error.png");

  await browser.close();
}

run().catch(console.error);
