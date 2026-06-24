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

    await page.screenshot({ path: path.join(process.cwd(), 'readme-signup-before.png') });
    console.log("📸 Saved readme-signup-before.png");

    // Check if we are on the signup/setup password form
    const hasPasswordInput = await page.$('input[type="password"]');
    if (hasPasswordInput) {
      console.log("✍️ Signup page detected. Filling name and password...");
      
      // Try to fill Name/Firstname/Lastname if present
      const textInputs = await page.$$('input[type="text"]');
      for (const input of textInputs) {
        const placeholder = await input.getAttribute('placeholder') || '';
        const nameAttr = await input.getAttribute('name') || '';
        if (/name|first|last/i.test(placeholder) || /name|first|last/i.test(nameAttr)) {
          await input.fill('Mehmet');
        }
      }

      // Fill Password
      await page.fill('input[type="password"]', '212jeAmind!');
      await page.waitForTimeout(1000);

      console.log("💾 Submitting activation form...");
      await page.evaluate(() => {
        const btn = document.querySelector('button[type="submit"]');
        if (btn) (btn as HTMLElement).click();
      });

      await page.waitForTimeout(8000);
      await page.screenshot({ path: path.join(process.cwd(), 'readme-signup-after-submit.png') });
      console.log("📸 Saved readme-signup-after-submit.png");
    } else {
      console.log("ℹ️ No password field found. We might already be logged in or page state is different.");
    }

    // Now go to integrations
    const integrationsUrl = 'https://dash.readme.com/project/istanbul-escort/v1.0/integrations';
    console.log(`🚀 Navigating to integrations: ${integrationsUrl}`);
    await page.goto(integrationsUrl, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(8000);

    const currentUrl = page.url();
    console.log(`📍 Landed URL: ${currentUrl}`);

    if (currentUrl.includes('login') || currentUrl.includes('/to/')) {
      console.error("❌ Auth failed. Redirected to login!");
      await page.screenshot({ path: path.join(process.cwd(), 'readme-integrations-failed.png') });
      return;
    }

    const gaSelector = await page.evaluate(() => {
      const inputName = document.querySelector('input[name="integrations.google.analytics"]');
      if (inputName) return 'input[name="integrations.google.analytics"]';
      const idGa = document.getElementById('google_analytics');
      if (idGa) return '#google_analytics';
      return null;
    });

    if (!gaSelector) {
      console.error("❌ GA input field not found on integrations page!");
      await page.screenshot({ path: path.join(process.cwd(), 'readme-ga-not-found-final.png') });
      return;
    }

    const gaId = "G-TJ3T8823ZP"; // original GA4 ID for istanbul-escort
    console.log(`✍️ Restoring GA4 ID to: ${gaId}`);
    await page.fill(gaSelector, gaId);
    await page.evaluate((sel: string) => {
      const el = document.querySelector(sel) as HTMLInputElement;
      if (el) {
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, gaSelector);

    await page.waitForTimeout(2000);

    console.log("💾 Saving changes...");
    const clickedSave = await page.evaluate(() => {
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

    console.log("Save click result:", clickedSave);
    await page.waitForTimeout(6000);

    const finalVal = await page.$eval(gaSelector, (el: any) => el.value);
    console.log(`✅ GA ID successfully restored to: ${finalVal}`);

    await page.screenshot({ path: path.join(process.cwd(), 'readme-istanbul-escort-ga-restored.png') });
    console.log("📸 Saved verification screenshot: readme-istanbul-escort-ga-restored.png");

  } catch (err: any) {
    console.error("❌ Error during signup flow:", err.message);
  } finally {
    await page.close();
  }
}

run().catch(console.error);
