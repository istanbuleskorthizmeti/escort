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
  const gaId = "G-TJ3T8823ZP"; // original GA4 ID for istanbul-escort
  const subdomain = "istanbul-escort";

  // Try inline settings url first, then fallback to dashboard integrations url
  const urls = [
    `https://${subdomain}.readme.io/docs/getting-started#/settings/integrations`,
    `https://istanbul-escort.readme.io/docs/istanbul-esenyurt-mehtercesme-escort#/settings/integrations`,
    `https://dash.readme.com/project/${subdomain}/v1.0/integrations`
  ];

  let success = false;

  for (const url of urls) {
    if (success) break;
    console.log(`\n⏳ Navigating to: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(6000);

      const currentUrl = page.url();
      const currentTitle = await page.title();
      console.log(`📍 Landed on URL: ${currentUrl}`);
      console.log(`🏷️ Page Title: ${currentTitle}`);

      // Check selectors
      const gaSelector = await page.evaluate(() => {
        const inputName = document.querySelector('input[name="integrations.google.analytics"]');
        if (inputName) return 'input[name="integrations.google.analytics"]';
        const idGa = document.getElementById('google_analytics');
        if (idGa) return '#google_analytics';
        return null;
      });

      if (!gaSelector) {
        console.log(`⚠️ GA input not found on ${url}. Trying next...`);
        continue;
      }

      console.log(`🎯 Found GA input using selector: ${gaSelector}`);

      // Fill GA4 ID
      await page.fill(gaSelector, gaId);
      await page.evaluate((sel: string) => {
        const el = document.querySelector(sel) as HTMLInputElement;
        if (el) {
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, gaSelector);

      await page.waitForTimeout(2000);

      // Save
      console.log("💾 Clicking Save button...");
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

      console.log("Save click result:", clicked);
      await page.waitForTimeout(6000);

      const checkValue = await page.$eval(gaSelector, (el: any) => el.value);
      console.log(`✅ Current input value after save: ${checkValue}`);
      
      const screenshotPath = path.join(process.cwd(), `readme-${subdomain}-ga-restored.png`);
      await page.screenshot({ path: screenshotPath });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);

      success = true;
    } catch (err: any) {
      console.error(`❌ Error on URL ${url}:`, err.message);
    }
  }

  await page.close();
}

run().catch(console.error);
