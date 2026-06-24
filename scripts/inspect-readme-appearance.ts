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
  console.log("Opening new tab to ReadMe appearance settings...");
  const page = await context.newPage();

  try {
    const appearanceUrl = "https://dash.readme.com/project/istanbul-escort/v1.0/appearance";
    console.log(`Navigating to: ${appearanceUrl}`);
    await page.goto(appearanceUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(6000);

    // Let's check all textareas, inputs, text on this page to find Custom CSS
    const elements = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, select, textarea, button, a, h1, h2, h3'));
      return inputs.map((i, idx) => ({
        index: idx,
        tagName: i.tagName,
        id: i.id,
        name: (i as any).name || '',
        placeholder: (i as any).placeholder || '',
        text: i.textContent?.trim() || ''
      }));
    });
    console.log("Interactive elements on appearance page:", elements);

    await page.screenshot({ path: path.join(process.cwd(), 'readme-appearance.png') });
    console.log("Screenshot saved: readme-appearance.png");

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
