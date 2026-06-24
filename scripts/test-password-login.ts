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

    console.log("✍️ Filling login form...");
    await page.fill('input[type="email"], input[name="email"]', 'info@dorukcanay.digital');
    await page.waitForTimeout(1000);

    // Find password field and fill it
    const passInput = await page.$('input[type="password"], input[name="password"]');
    if (passInput) {
      await passInput.fill('212jeAmind!');
      await page.waitForTimeout(1000);
      
      console.log("💾 Submitting form...");
      await page.evaluate(() => {
        const btn = document.querySelector('button[type="submit"]');
        if (btn) (btn as HTMLElement).click();
      });
      
      await page.waitForTimeout(8000);
      
      const currentUrl = page.url();
      console.log(`📍 Current URL: ${currentUrl}`);
      
      await page.screenshot({ path: path.join(process.cwd(), 'readme-password-login-result.png') });
      console.log("📸 Saved screenshot: readme-password-login-result.png");
    } else {
      console.error("❌ Password input field not found!");
    }

  } catch (err: any) {
    console.error("❌ Error:", err.message);
  } finally {
    await page.close();
  }
}

run().catch(console.error);
