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
    // Go to project settings
    const settingsUrl = "https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/appearance/custom-html";
    console.log(`Navigating to: ${settingsUrl}`);
    await page.goto(settingsUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(6000);

    const inputs = await page.evaluate(() => {
      // Find all interactive inputs, buttons, spans, headers to see where we are
      const tags = Array.from(document.querySelectorAll('input, button, select, h1, h2, h3, a'));
      return tags.map(t => ({
        tagName: t.tagName,
        text: t.textContent?.trim(),
        id: t.id,
        className: t.className
      }));
    });
    console.log("Interactive elements on Custom HTML settings page:", inputs.slice(0, 100));

    // Read body innerText to see if there's any upgrade block or error
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log("Page text snippet:");
    console.log(pageText.substring(0, 1500));

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
