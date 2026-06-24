import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  if (contexts.length === 0) {
    console.error("❌ No contexts found!");
    return;
  }

  const context = contexts[0];
  const pages = context.pages();
  const page = pages.find(p => p.url().includes('istanbul-escort.readme.io'));
  
  if (!page) {
    console.error("❌ Page not found");
    await browser.close();
    return;
  }

  const content = await page.evaluate(() => {
    const mainContent = document.querySelector('article') || document.querySelector('.markdown-body') || document.querySelector('#content');
    return {
      url: window.location.href,
      html: mainContent ? mainContent.innerHTML : 'Main content selector not found',
      text: mainContent ? mainContent.innerText : 'Main content selector not found'
    };
  });

  console.log("URL:", content.url);
  console.log("Text inside main container:", content.text);
  console.log("HTML inside main container:", content.html.substring(0, 1000));
  await browser.close();
}

run().catch(console.error);
