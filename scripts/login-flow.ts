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
    console.log("Navigating to login page...");
    await page.goto("https://dash.readme.com/login", { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(3000);

    console.log("Clicking 'Continue with Google'...");
    await page.click('button:has-text("Continue with Google")', { timeout: 15000 });
    await page.waitForTimeout(8000);

    const postGoogleUrl = page.url();
    console.log("URL after clicking Google login:", postGoogleUrl);

    if (postGoogleUrl.includes('google.com')) {
      console.log("On Google accounts page, looking for info@dorukcanay.digital...");
      
      // Look for the specific account text and click it
      await page.click('text=info@dorukcanay.digital', { timeout: 15000 });
      console.log("Clicked account. Waiting for redirect...");
      await page.waitForTimeout(10000);
    }

    console.log("Final URL:", page.url());
    const finalInfo = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        text: document.body.innerText.substring(0, 1000)
      };
    });
    console.log("Final Page Info:", finalInfo);
    
    await page.screenshot({ path: path.join(process.cwd(), 'readme-login-final.png') });
    console.log("Screenshot saved: readme-login-final.png");

  } catch (err: any) {
    console.error("Error during authentication flow:", err.message);
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
