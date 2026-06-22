import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const chromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("🚀 [TEST VERIFY DEBUG] Starting verification click debug with console listener...");
  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    executablePath: chromePath,
    viewport: { width: 1366, height: 768 }
  });

  const page = await browserContext.newPage();
  page.on('console', msg => console.log('🖥️ [CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('❌ [PAGE ERROR]', err.message));
  
  try {
    const siteUrl = "https://search.google.com/search-console/users?resource_id=https%3A%2F%2Fsites.google.com%2Fdorukcanay.digital%2Fsefakoyistanbul-drkcnay2026%2F";
    console.log(`Navigating to: ${siteUrl}`);
    await page.goto(siteUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    // Let's click the verification button and log any request exceptions/failures
    page.on('requestfailed', request => {
      console.log('🔴 Request Failed:', request.url(), request.failure()?.errorText);
    });
    page.on('requestfinished', request => {
      if (request.url().includes('verify') || request.url().includes('ownership')) {
        console.log('🟢 Request Finished:', request.url(), request.response()?.status());
      }
    });

    console.log("Locating verification button...");
    const btn = page.locator('div[role="button"]:has-text("Sahipliğinizi doğrulayın"), div:has-text("Sahipliğinizi doğrulayın"), button:has-text("Sahipliğinizi doğrulayın")').last();
    if (await btn.isVisible()) {
      console.log("Button visible. Clicking...");
      await btn.click();
      console.log("Clicked button. Waiting 10s...");
      await page.waitForTimeout(10000);
      await page.screenshot({ path: path.join(process.cwd(), 'verify-debug-after-10s.png') });
      console.log("Screenshot saved.");
    } else {
      console.log("Button not found.");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await browserContext.close();
  }
}

run();
