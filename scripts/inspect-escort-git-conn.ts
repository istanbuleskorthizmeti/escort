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
  const targetPage = pages.find(p => p.url().includes('istanbul-escort.readme.io'));
  
  if (!targetPage) {
    console.error("❌ Target page not found!");
    await browser.close();
    return;
  }

  try {
    const gitConnUrl = "https://istanbul-escort.readme.io/docs/istanbul-besiktas-escort#/settings/git-connection";
    console.log(`Navigating to: ${gitConnUrl}`);
    await targetPage.goto(gitConnUrl, { waitUntil: 'load', timeout: 30000 });
    await targetPage.waitForTimeout(6000);

    const info = await targetPage.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        text: document.body.innerText.substring(0, 1500)
      };
    });

    console.log("Git Connection page info:", info);
    await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-escort-git-conn.png') });
    console.log("Screenshot saved: readme-escort-git-conn.png");

  } catch (err: any) {
    console.error("Error navigating:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
