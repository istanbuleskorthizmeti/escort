import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function configureGA(page: any, subdomain: string, gaId: string) {
  const integrationsUrl = `https://dash.readme.com/project/${subdomain}/v1.0/integrations`;
  console.log(`\n⏳ Navigating to ${subdomain} integrations settings: ${integrationsUrl}`);
  
  await page.goto(integrationsUrl, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(6000);

  // Take a before screenshot
  const beforeScreenshot = path.join(process.cwd(), `readme-${subdomain}-ga-before.png`);
  await page.screenshot({ path: beforeScreenshot });
  console.log(`📸 Screenshot before change: ${beforeScreenshot}`);

  // Fill the Google Analytics field
  console.log(`✍️ Filling google_analytics field with ${gaId}...`);
  await page.fill('#google_analytics', gaId);
  await page.evaluate(() => {
    const el = document.getElementById('google_analytics') as HTMLInputElement;
    if (el) {
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await page.waitForTimeout(2000);

  // Click the save button
  console.log(`💾 Attempting to click Save button...`);
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], [role="button"]'));
    const saveButton = buttons.find(b => {
      const text = b.textContent?.trim() || '';
      return /Save|Update|Kaydet|Save Changes|Gönder/i.test(text);
    });
    if (saveButton) {
      (saveButton as HTMLElement).click();
      return { success: true, text: saveButton.textContent?.trim() };
    }
    return { success: false };
  });

  console.log(`💾 Save click result:`, clicked);

  if (clicked.success) {
    await page.waitForTimeout(6000);
    const afterScreenshot = path.join(process.cwd(), `readme-${subdomain}-ga-after.png`);
    await page.screenshot({ path: afterScreenshot });
    console.log(`📸 Screenshot after change: ${afterScreenshot}`);
  } else {
    // Try form submission as fallback
    console.log(`⚠️ No save button found, trying form submit fallback...`);
    const formSubmitted = await page.evaluate(() => {
      const input = document.getElementById('google_analytics');
      if (input) {
        const form = input.closest('form');
        if (form) {
          form.submit();
          return true;
        }
      }
      return false;
    });
    console.log(`Form submit fallback result:`, formSubmitted);
    await page.waitForTimeout(6000);
    const afterScreenshot = path.join(process.cwd(), `readme-${subdomain}-ga-after-fallback.png`);
    await page.screenshot({ path: afterScreenshot });
    console.log(`📸 Screenshot after change (fallback): ${afterScreenshot}`);
  }
}

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  if (contexts.length === 0) {
    console.error("❌ No contexts found!");
    await browser.close();
    return;
  }

  const context = contexts[0];
  const page = await context.newPage();
  const gaId = "G-05M3C339NN";

  try {
    // 1. Configure istanbul-escort
    await configureGA(page, 'istanbul-escort', gaId);

    // 2. Configure istanbul-eskort-hizmeti
    await configureGA(page, 'istanbul-eskort-hizmeti', gaId);

    console.log("\n🎉 GA4 code integration updates completed successfully!");

  } catch (err: any) {
    console.error("❌ Error running GA4 update script:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
