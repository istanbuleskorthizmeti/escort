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
  console.log("Opening new tab to ReadMe integrations settings...");
  const page = await context.newPage();

  try {
    const integrationsUrl = "https://dash.readme.com/project/istanbul-escort/v1.0/integrations";
    console.log(`Navigating to: ${integrationsUrl}`);
    await page.goto(integrationsUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(6000);

    // Save initial screenshot
    await page.screenshot({ path: path.join(process.cwd(), 'readme-integrations-before-change.png') });
    console.log("Screenshot saved: readme-integrations-before-change.png");

    // Focus and fill the google_analytics field
    console.log("Filling google_analytics with: G-05M3C339NN");
    await page.fill('#google_analytics', 'G-05M3C339NN');
    await page.evaluate(() => {
      const el = document.getElementById('google_analytics') as HTMLInputElement;
      if (el) {
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await page.waitForTimeout(2000);

    // Find and click the save button
    const clicked = await page.evaluate(() => {
      // Find buttons containing text "Save", "Update", "Kaydet" or similar
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

    console.log("Save button click result:", clicked);

    if (clicked.success) {
      await page.waitForTimeout(5000);
      await page.screenshot({ path: path.join(process.cwd(), 'readme-integrations-after-change.png') });
      console.log("Screenshot saved: readme-integrations-after-change.png");
    } else {
      // Maybe it saves automatically? Or is there a different button?
      console.log("❌ No save button found, trying to press Enter or finding form submit...");
      // Let's locate the form and submit it if exists
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
      console.log("Form submit result:", formSubmitted);
      await page.waitForTimeout(5000);
      await page.screenshot({ path: path.join(process.cwd(), 'readme-integrations-after-change-form.png') });
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
