import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  if (contexts.length === 0) {
    console.error("❌ No contexts found on connected CDP session!");
    return;
  }

  const context = contexts[0];
  console.log("Opening a new tab in the active browser context...");
  const page = await context.newPage();

  try {
    console.log("Navigating to ReadMe API key settings in the new tab...");
    await page.goto("https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/api-key", { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(5000);

    const url = page.url();
    console.log("Current page URL:", url);
    await page.screenshot({ path: path.join(process.cwd(), 'readme-api-key-cdp.png') });
    console.log("Saved screenshot: readme-api-key-cdp.png");

    const content = await page.content();
    fs.writeFileSync('readme-api-key-page.html', content);

    // Look for api keys matching rdme_
    const keys = content.match(/rdme_[a-zA-Z0-9_]+/g);
    if (keys) {
      const uniqueKeys = Array.from(new Set(keys));
      console.log("🔑 FOUND API KEYS via CDP:", uniqueKeys);
    } else {
      console.log("❌ No rdme_ keys found. Let's inspect the page content.");
      const text = await page.evaluate(() => document.body.innerText);
      console.log("Page text snippet:", text.substring(0, 1000));
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    // Close the page we opened to clean up after ourselves
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
