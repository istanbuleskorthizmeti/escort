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
    const integrationsUrl = "https://dash.readme.com/project/istanbul-escort/v1.0/integrations";
    await page.goto(integrationsUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000);

    const inputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input')).map((i, idx) => ({
        index: idx,
        id: i.id,
        placeholder: i.placeholder,
        value: i.value
      }));
    });
    console.log("All input elements on integrations page:");
    console.log(inputs);

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
