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
    console.log("Logging out first...");
    await page.goto('https://dash.readme.com/logout', { waitUntil: 'load', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);

    console.log("Navigating to login page...");
    await page.goto('https://dash.readme.com/login', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    await page.screenshot({ path: 'readme-login-initial.png' });
    console.log("Screenshot saved: readme-login-initial.png");

    console.log("Entering email...");
    await page.fill('input[type="email"]', 'info@dorukcanay.digital');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'readme-login-filled.png' });
    console.log("Screenshot saved: readme-login-filled.png");

    console.log("Clicking submit...");
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) {
        (btn as HTMLElement).click();
      }
    });

    await page.waitForTimeout(6000);
    await page.screenshot({ path: 'readme-login-post-submit.png' });
    console.log("Screenshot saved: readme-login-post-submit.png");

    const text = await page.innerText('body');
    console.log("Page Text:", text.substring(0, 1000));

  } catch (err: any) {
    console.error("Error during debug-readme-login:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
