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
    console.log("🔑 Navigating to forgot password page...");
    await page.goto('https://dash.readme.com/forgot', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    console.log("✍️ Entering email...");
    await page.fill('input[type="email"], input[name="email"]', 'info@dorukcanay.digital');
    await page.waitForTimeout(1000);

    // Save screenshot before click
    await page.screenshot({ path: path.join(process.cwd(), 'readme-forgot-before.png') });

    console.log("💾 Clicking submit button...");
    // Let's use Playwright's click on the button
    const btn = await page.$('button[type="submit"], button:has-text("Send"), button:has-text("Reset")');
    if (btn) {
      await btn.click();
      console.log("Click triggered.");
    } else {
      console.log("Button selector failed, trying evaluate click...");
      await page.evaluate(() => {
        const b = document.querySelector('button[type="submit"]');
        if (b) (b as HTMLElement).click();
      });
    }

    await page.waitForTimeout(8000);

    // Save screenshot after click
    await page.screenshot({ path: path.join(process.cwd(), 'readme-forgot-after.png') });
    console.log("📸 Saved screenshots.");

    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
    console.log(`📋 Page Text:\n${bodyText}`);

  } catch (err: any) {
    console.error("❌ Error:", err.message);
  } finally {
    await page.close();
  }
}

run().catch(console.error);
