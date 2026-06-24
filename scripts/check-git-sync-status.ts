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
  const targetPage = pages.find(p => p.url().includes('istanbul-eskort-hizmeti.readme.io/docs/getting-started'));
  
  if (!targetPage) {
    console.error("❌ Target page not found!");
    await browser.close();
    return;
  }

  try {
    const gitConnUrl = "https://istanbul-eskort-hizmeti.readme.io/docs/getting-started#/settings/git-connection";
    console.log(`Refreshing page: ${gitConnUrl}`);
    await targetPage.goto(gitConnUrl, { waitUntil: 'load', timeout: 30000 });
    await targetPage.waitForTimeout(8000);

    const info = await targetPage.evaluate(() => {
      // Find all buttons on the page
      const buttons = Array.from(document.querySelectorAll('button')).map((b, idx) => ({
        index: idx,
        text: b.textContent?.trim() || '',
        class: b.className
      }));
      return {
        url: window.location.href,
        title: document.title,
        text: document.body.innerText.substring(0, 1500),
        buttons
      };
    });

    console.log("Git Connection page info:", info);
    await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-git-conn-after.png') });
    console.log("Screenshot saved: readme-git-conn-after.png");

  } catch (err: any) {
    console.error("Error refreshing Git connection page:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
