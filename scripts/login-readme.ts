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
    const dashboardUrl = "https://dash.readme.com/project/istanbul-escort/v1.0";
    console.log(`Navigating to: ${dashboardUrl}`);
    await page.goto(dashboardUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(6000);

    const currentUrl = page.url();
    console.log("Current URL:", currentUrl);

    if (currentUrl.includes('google.com')) {
      console.log("Detecting Google Sign-in screen. Clicking on 'info@dorukcanay.digital' account...");
      
      // Click the email or account element containing info@dorukcanay.digital
      // Google account chooser selectors can vary, we can click using text content selector
      await page.click('text=info@dorukcanay.digital', { timeout: 15000 });
      console.log("Clicked! Waiting for redirect...");
      await page.waitForTimeout(10000);
      
      console.log("Post-click URL:", page.url());
      await page.screenshot({ path: path.join(process.cwd(), 'readme-after-auth.png') });
      console.log("Screenshot saved: readme-after-auth.png");
    } else {
      console.log("Already authenticated or not on Google sign-in page.");
    }

  } catch (err: any) {
    console.error("Error during authentication:", err.message);
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
