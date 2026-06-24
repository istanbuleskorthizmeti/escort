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
  const pages = context.pages();
  console.log(`📋 Total open pages: ${pages.length}`);

  // Find Tab #5 or any page whose URL contains 'istanbul-escort'
  const targetPage = pages.find(p => p.url().includes('istanbul-escort'));

  if (!targetPage) {
    console.error("❌ Active istanbul-escort tab not found in Chrome!");
    return;
  }

  console.log(`🎯 Found active tab: ${targetPage.url()}`);
  const targetUrl = 'https://istanbul-escort.readme.io/docs/getting-started#/settings/integrations';
  const gaId = "G-TJ3T8823ZP"; // original GA4 ID for istanbul-escort

  try {
    console.log(`🔄 Navigating tab back to: ${targetUrl}`);
    await targetPage.goto(targetUrl, { waitUntil: 'load', timeout: 30000 });
    await targetPage.waitForTimeout(6000);

    const currentUrl = targetPage.url();
    console.log(`📍 Current URL after navigation: ${currentUrl}`);

    // Try finding the input field
    const gaSelector = await targetPage.evaluate(() => {
      const inputName = document.querySelector('input[name="integrations.google.analytics"]');
      if (inputName) return 'input[name="integrations.google.analytics"]';
      const idGa = document.getElementById('google_analytics');
      if (idGa) return '#google_analytics';
      return null;
    });

    if (!gaSelector) {
      console.error("❌ Google Analytics input field not found on the tab!");
      await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-active-tab-error.png') });
      return;
    }

    console.log(`✍️ Updating GA4 ID to: ${gaId}`);
    await targetPage.fill(gaSelector, gaId);
    await targetPage.evaluate((sel: string) => {
      const el = document.querySelector(sel) as HTMLInputElement;
      if (el) {
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, gaSelector);

    await targetPage.waitForTimeout(2000);

    console.log("💾 Clicking Save button...");
    const clicked = await targetPage.evaluate(() => {
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

    console.log("Save click result:", clicked);
    await targetPage.waitForTimeout(5000);

    const finalVal = await targetPage.$eval(gaSelector, (el: any) => el.value);
    console.log(`✅ Current input value: ${finalVal}`);

    await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-istanbul-escort-ga-restored.png') });
    console.log("📸 Saved verification screenshot: readme-istanbul-escort-ga-restored.png");

  } catch (err: any) {
    console.error("❌ Error:", err.message);
  }
}

run().catch(console.error);
