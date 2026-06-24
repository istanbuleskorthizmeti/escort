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
  console.log(`📋 Total open pages in active context: ${pages.length}`);

  let targetPage = null;

  for (const p of pages) {
    const url = p.url();
    const title = await p.title().catch(() => '');
    console.log(`- Page URL: ${url} | Title: ${title}`);
    if (url.includes('dash.readme.com') || url.includes('readme.io')) {
      targetPage = p;
    }
  }

  if (!targetPage) {
    console.log("⚠️ No active ReadMe tab found in existing tabs. Using the first page or opening a new one...");
    targetPage = pages[0] || (await context.newPage());
  }

  const gaId = "G-TJ3T8823ZP"; // original GA4 ID for istanbul-escort
  const subdomain = "istanbul-escort";
  const integrationsUrl = `https://dash.readme.com/project/${subdomain}/v1.0/integrations`;

  console.log(`🚀 Using page: ${targetPage.url()} to navigate to ${integrationsUrl}`);
  
  try {
    await targetPage.goto(integrationsUrl, { waitUntil: 'load', timeout: 30000 });
    await targetPage.waitForTimeout(5000);

    const currentUrl = targetPage.url();
    console.log(`📍 Landed on: ${currentUrl}`);

    if (currentUrl.includes('login') || currentUrl.includes('/to/')) {
      console.error("❌ Authentication required! The tab is redirected to a login page.");
      // Take screenshot of the login page
      await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-login-required.png') });
      return;
    }

    // Try finding the input field
    const gaSelector = await targetPage.evaluate(() => {
      const inputName = document.querySelector('input[name="integrations.google.analytics"]');
      if (inputName) return 'input[name="integrations.google.analytics"]';
      const idGa = document.getElementById('google_analytics');
      if (idGa) return '#google_analytics';
      return null;
    });

    if (!gaSelector) {
      console.error("❌ Google Analytics input field not found on this page!");
      await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-not-found-debug.png') });
      return;
    }

    console.log(`🎯 Found field: ${gaSelector}. Setting value to: ${gaId}`);
    await targetPage.fill(gaSelector, gaId);
    await targetPage.evaluate((sel: string) => {
      const el = document.querySelector(sel) as HTMLInputElement;
      if (el) {
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, gaSelector);

    await targetPage.waitForTimeout(2000);

    console.log("💾 Clicking Save/Update button...");
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

    console.log("Click result:", clicked);
    await targetPage.waitForTimeout(5000);

    const finalVal = await targetPage.$eval(gaSelector, (el: any) => el.value);
    console.log(`✅ Persisted GA ID: ${finalVal}`);

    await targetPage.screenshot({ path: path.join(process.cwd(), `readme-${subdomain}-ga-restored.png`) });
    console.log("📸 Saved verification screenshot!");

  } catch (err: any) {
    console.error("❌ Error running script:", err.message);
  }
}

run().catch(console.error);
