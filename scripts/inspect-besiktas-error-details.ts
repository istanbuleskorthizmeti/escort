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
  const targetPage = pages.find(p => p.url().includes('istanbul-escort.readme.io/docs/istanbul-besiktas-escort'));
  
  if (!targetPage) {
    console.error("❌ Target page not found!");
    await browser.close();
    return;
  }

  const errorCheck = await targetPage.evaluate(() => {
    const html = document.body.innerHTML;
    const errorText = "Unable to render content";
    const errorText2 = "MDXish";
    return {
      hasErrorText: html.includes(errorText) || html.includes(errorText2),
      selectorExists: !!document.querySelector('.Hub-error') || !!document.querySelector('[data-testid="error-state"]')
    };
  });

  console.log("Error check results:", errorCheck);
  await browser.close();
}

run().catch(console.error);
