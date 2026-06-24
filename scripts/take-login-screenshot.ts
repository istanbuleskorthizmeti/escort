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
    console.log("🧼 Logging out first...");
    await page.goto('https://dash.readme.com/logout', { waitUntil: 'load', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);

    console.log("🔑 Navigating to login page...");
    await page.goto('https://dash.readme.com/login', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    console.log("✍️ Entering email...");
    await page.fill('input[type="email"], input[name="email"]', 'info@dorukcanay.digital');
    await page.waitForTimeout(1000);

    // Take screenshot BEFORE submit
    await page.screenshot({ path: path.join(process.cwd(), 'readme-login-before-submit.png') });
    console.log("📸 Saved readme-login-before-submit.png");

    console.log("💾 Clicking submit...");
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) (btn as HTMLElement).click();
    });

    await page.waitForTimeout(6000);

    // Take screenshot AFTER submit
    await page.screenshot({ path: path.join(process.cwd(), 'readme-login-after-submit.png') });
    console.log("📸 Saved readme-login-after-submit.png");

    const currentUrl = page.url();
    const title = await page.title();
    console.log(`📍 Landed URL: ${currentUrl}`);
    console.log(`🏷️ Page Title: ${title}`);

    // Print body text to see if there is a success or error message
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
    console.log(`📋 Page Text:\n${bodyText}`);

  } catch (err: any) {
    console.error("❌ Error:", err.message);
  } finally {
    await page.close();
  }
}

run().catch(console.error);
