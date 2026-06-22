import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const chromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("🚀 [TEST VERIFY] Starting verification click test...");
  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    executablePath: chromePath,
    viewport: { width: 1366, height: 768 }
  });

  const page = await browserContext.newPage();
  try {
    const siteUrl = "https://search.google.com/search-console/users?resource_id=https%3A%2F%2Fsites.google.com%2Fdorukcanay.digital%2Fsefakoyistanbul-drkcnay2026%2F";
    console.log(`Navigating to: ${siteUrl}`);
    await page.goto(siteUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    await page.screenshot({ path: path.join(process.cwd(), 'verify-before.png') });
    console.log("Screenshot before click saved to verify-before.png");

    // Click the button using evaluate click on the exact element
    const clicked = await page.evaluate(() => {
      // Find all buttons, links, or divs with role button
      const elements = Array.from(document.querySelectorAll('button, [role="button"], a, span'));
      const target = elements.find(el => {
        const text = el.textContent || '';
        return /Sahipliğinizi doğrulayın|Verify ownership/i.test(text.trim()) && text.trim().length < 40;
      });
      if (target) {
        (target as HTMLElement).click();
        return { success: true, tagName: target.tagName, text: target.textContent?.trim() };
      }
      return { success: false };
    });

    console.log("Click result:", clicked);

    if (clicked.success) {
      console.log("Clicked! Waiting 8 seconds for modal...");
      await page.waitForTimeout(8000);
      await page.screenshot({ path: path.join(process.cwd(), 'verify-after-8s.png') });
      console.log("Screenshot after 8s saved to verify-after-8s.png");

      console.log("Waiting another 10 seconds for verification outcome...");
      await page.waitForTimeout(10000);
      await page.screenshot({ path: path.join(process.cwd(), 'verify-after-18s.png') });
      console.log("Screenshot after 18s saved to verify-after-18s.png");

      // Check if there is any success or error text visible
      const modalText = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]') || document.body;
        return dialog.textContent || '';
      });
      console.log("Modal/Page text after verification attempt:");
      console.log(modalText.substring(0, 1000));
    } else {
      console.log("Could not find the verification button.");
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await browserContext.close();
  }
}

run();
