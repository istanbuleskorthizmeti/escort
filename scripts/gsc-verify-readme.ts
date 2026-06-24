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
  console.log("Opening new tab in user's browser context for GSC...");
  const page = await context.newPage();

  try {
    const siteUrl = "https://search.google.com/search-console/not-verified?original_url=/search-console/users?resource_id%3Dhttps://istanbul-eskort-hizmeti.readme.io/&original_resource_id=https://istanbul-eskort-hizmeti.readme.io/";
    console.log(`Navigating GSC to: ${siteUrl}`);
    await page.goto(siteUrl, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(6000);

    await page.screenshot({ path: path.join(process.cwd(), 'gsc-verify-before.png') });
    console.log("Screenshot saved: gsc-verify-before.png");

    // Click the verify button
    const clickResult = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, [role="button"], a, span'));
      // Find elements that say Verify, Doğrula, Sahipliği doğrula, or Sahipliğinizi doğrulayın
      const target = elements.find(el => {
        const text = el.textContent || '';
        return /Doğrula|Verify|Sahipliği|Sahipliğinizi/i.test(text.trim()) && text.trim().length < 40;
      });
      if (target) {
        (target as HTMLElement).click();
        return { success: true, text: target.textContent?.trim() };
      }
      return { success: false };
    });

    console.log("Verify button click result:", clickResult);

    if (clickResult.success) {
      console.log("Verify clicked! Waiting 12 seconds for outcomes...");
      await page.waitForTimeout(12000);
      await page.screenshot({ path: path.join(process.cwd(), 'gsc-verify-after.png') });
      console.log("Screenshot saved: gsc-verify-after.png");

      const text = await page.evaluate(() => document.body.innerText);
      console.log("Outcome text snippet:", text.substring(0, 1000));
    } else {
      console.log("❌ Could not find GSC verification button on page.");
      const text = await page.evaluate(() => document.body.innerText);
      console.log("Page text snippet:", text.substring(0, 500));
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
