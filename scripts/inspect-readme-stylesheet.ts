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
    const stylesheetUrl = "https://dash.readme.com/project/istanbul-escort/v1.0/appearance-stylesheet";
    console.log(`Navigating to: ${stylesheetUrl}`);
    await page.goto(stylesheetUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(6000);

    const info = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        text: document.body.innerText.substring(0, 1000)
      };
    });

    console.log("Page info:", info);
    await page.screenshot({ path: path.join(process.cwd(), 'readme-stylesheet.png') });
    console.log("Screenshot saved: readme-stylesheet.png");

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
