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
  const page = await context.newPage();

  try {
    const dashUrl = "https://dash.readme.com/";
    console.log(`Navigating to: ${dashUrl}`);
    await page.goto(dashUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(6000);

    const info = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        text: document.body.innerText.substring(0, 2000)
      };
    });

    console.log("Dash main page info:", info);
    await page.screenshot({ path: path.join(process.cwd(), 'readme-dash-home.png') });
    console.log("Screenshot saved: readme-dash-home.png");

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
