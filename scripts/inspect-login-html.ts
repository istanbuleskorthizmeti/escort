import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
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

  try {
    console.log("Navigating to login page...");
    await page.goto('https://dash.readme.com/login', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(6000);

    const html = await page.content();
    fs.writeFileSync('readme-login-page.html', html, 'utf8');
    console.log("Saved login page source to readme-login-page.html");

    // Print all inputs and buttons
    const elements = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, button, a')).map(el => ({
        tag: el.tagName,
        type: (el as any).type,
        id: el.id,
        name: (el as any).name,
        placeholder: (el as any).placeholder,
        text: el.textContent?.trim(),
        outerHTML: el.outerHTML
      }));
      return elements;
    });

    console.log("Form elements found on page:", elements);

  } catch (err: any) {
    console.error("Error inspecting login page:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
