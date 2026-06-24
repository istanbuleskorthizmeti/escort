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

    await page.screenshot({ path: path.join(process.cwd(), 'readme-custom-html-before.png') });
    console.log("Screenshot saved: readme-custom-html-before.png");

    // Let's locate the Custom HTML editor or head injection block
    // Often there's a field for inserting scripts/meta into the page head.
    const hasHeadEditor = await page.evaluate(() => {
      // Find text areas or textareas containing head or custom HTML
      const textAreas = Array.from(document.querySelectorAll('textarea'));
      console.log(`Found ${textAreas.length} textareas.`);
      return textAreas.map((t, idx) => ({
        index: idx,
        placeholder: t.placeholder,
        value: t.value.substring(0, 100)
      }));
    });
    console.log("Textareas on page:", hasHeadEditor);

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
