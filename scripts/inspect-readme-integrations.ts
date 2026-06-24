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
  
  // Find the page for istanbul-eskort-hizmeti
  let targetPage = pages.find(p => p.url().includes('istanbul-eskort-hizmeti.readme.io'));
  if (!targetPage) {
    console.log("Creating new page...");
    targetPage = await context.newPage();
  }

  try {
    const integrationsUrl = "https://istanbul-eskort-hizmeti.readme.io/docs/getting-started#/settings/integrations";
    console.log(`Navigating to: ${integrationsUrl}`);
    await targetPage.goto(integrationsUrl, { waitUntil: 'load', timeout: 30000 });
    await targetPage.waitForTimeout(6000);

    const info = await targetPage.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        text: document.body.innerText.substring(0, 1500)
      };
    });

    console.log("Integrations page info:", info);
    await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-integrations.png') });
    console.log("Screenshot saved: readme-integrations.png");

  } catch (err: any) {
    console.error("Error navigating:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
