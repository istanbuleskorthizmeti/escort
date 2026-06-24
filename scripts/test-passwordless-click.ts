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
    const signupUrl = 'https://dash.readme.com/to/istanbul-escort/signup?user=info%40dorukcanay.digital';
    console.log(`🔗 Navigating to signup link: ${signupUrl}`);
    await page.goto(signupUrl, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(6000);

    console.log("🖱️ Clicking 'Passwordless Login' button...");
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent?.trim() === 'Passwordless Login');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    console.log("Clicked:", clicked);
    await page.waitForTimeout(8000);

    const currentUrl = page.url();
    console.log(`📍 Landed URL: ${currentUrl}`);

    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
    console.log(`📋 Page Text:\n${bodyText}`);

    await page.screenshot({ path: path.join(process.cwd(), 'readme-passwordless-click-result.png') });

  } catch (err: any) {
    console.error("❌ Error during debug:", err.message);
  } finally {
    await page.close();
  }
}

run().catch(console.error);
