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
  console.log("Opening new tab to ReadMe.io project general settings...");
  const page = await context.newPage();

  try {
    const urls = [
      "https://dash.readme.com/project/istanbul-escort/v1.0/general",
      "https://dash.readme.com/project/istanbul-escort/v1.0/appearance",
      "https://dash.readme.com/project/istanbul-escort/v1.0/integrations"
    ];

    for (const url of urls) {
      console.log(`Navigating to: ${url}`);
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(4000);
      const currentUrl = page.url();
      console.log(`Current URL after loading: ${currentUrl}`);
      const text = await page.evaluate(() => document.body.innerText);
      console.log(`Text snippet: ${text.substring(0, 150)}`);
      await page.screenshot({ path: path.join(process.cwd(), `readme-settings-${url.split('/').pop()}.png`) });
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
