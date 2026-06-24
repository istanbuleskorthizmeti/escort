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
  console.log("Opening new tab to ReadMe.io Custom HTML settings...");
  const page = await context.newPage();

  try {
    const settingsUrl = "https://dash.readme.com/project/istanbul-escort/v1.0/appearance/custom-html";
    console.log(`Navigating to: ${settingsUrl}`);
    await page.goto(settingsUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(6000);

    const pageText = await page.evaluate(() => document.body.innerText);
    console.log("Page text snippet:");
    console.log(pageText.substring(0, 1500));

    // Save a screenshot to see what's on the page
    await page.screenshot({ path: path.join(process.cwd(), 'readme-custom-html-real.png') });
    console.log("Screenshot saved: readme-custom-html-real.png");

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
