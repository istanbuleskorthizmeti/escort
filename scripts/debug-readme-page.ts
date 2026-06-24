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
    console.error("❌ No contexts found!");
    return;
  }

  const context = contexts[0];
  const page = await context.newPage();
  const url = `https://dash.readme.com/project/istanbul-escort/v1.0/integrations`;

  try {
    console.log(`⏳ Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    console.log("⏳ Waiting 15 seconds for lazy elements to load...");
    await page.waitForTimeout(15000);

    const currentUrl = page.url();
    const title = await page.title();
    console.log(`📍 Actual URL: ${currentUrl}`);
    console.log(`🏷️ Page Title: ${title}`);

    // Take screenshot
    const screenshotPath = path.join(process.cwd(), 'readme-debug-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved to: ${screenshotPath}`);

    // Log all input IDs and names
    const inputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input, textarea, select')).map(el => {
        return {
          tagName: el.tagName,
          id: el.id,
          name: el.getAttribute('name'),
          type: el.getAttribute('type'),
          placeholder: el.getAttribute('placeholder'),
          value: (el as any).value
        };
      });
    });

    console.log("📋 Found inputs:", JSON.stringify(inputs, null, 2));

  } catch (err: any) {
    console.error("❌ Error:", err.message);
  } finally {
    await page.close();
  }
}

run().catch(console.error);
