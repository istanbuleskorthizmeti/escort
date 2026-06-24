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
  console.log("Opening new tab for GSC HTML Tag verification...");
  const page = await context.newPage();

  try {
    const siteUrl = "https://search.google.com/search-console/not-verified?original_url=/search-console/users?resource_id%3Dhttps://istanbul-eskort-hizmeti.readme.io/&original_resource_id=https://istanbul-eskort-hizmeti.readme.io/";
    console.log(`Navigating GSC to: ${siteUrl}`);
    await page.goto(siteUrl, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(6000);

    // Step 1: Click the "HTML etiketi" (HTML tag) accordion header to expand it
    console.log("Expanding HTML tag verification section...");
    const expanded = await page.evaluate(() => {
      const headers = Array.from(document.querySelectorAll('div, span, td, tr, li'));
      const htmlTagHeader = headers.find(el => {
        const text = el.textContent || '';
        return text.trim() === 'HTML etiketi' || text.trim() === 'HTML tag';
      });
      if (htmlTagHeader) {
        (htmlTagHeader as HTMLElement).click();
        return true;
      }
      return false;
    });

    console.log("Expanded status:", expanded);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(process.cwd(), 'gsc-expanded-html-tag.png') });
    console.log("Screenshot saved: gsc-expanded-html-tag.png");

    // Step 2: Find the "DOĞRULA" (Verify) button inside the HTML tag container and click it
    console.log("Clicking the verify button inside the HTML tag section...");
    const verified = await page.evaluate(() => {
      // Find all containers/divs that might represent the expanded panels
      // We can look for buttons with text "DOĞRULA" or "VERIFY"
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
      // Let's filter buttons by their visual containment or just click the correct one.
      // Usually, the first "DOĞRULA" button is for the file, and the second is for the tag.
      // Let's find all verification buttons
      const verifyButtons = buttons.filter(btn => {
        const text = btn.textContent || '';
        return text.trim() === 'DOĞRULA' || text.trim() === 'VERIFY';
      });

      console.log(`Found ${verifyButtons.length} verify buttons.`);
      if (verifyButtons.length >= 2) {
        // The second one is usually HTML tag or other methods when expanded.
        // Let's click the second one.
        (verifyButtons[1] as HTMLElement).click();
        return { success: true, clickedIndex: 1 };
      } else if (verifyButtons.length === 1) {
        // If only one is found, let's click it
        (verifyButtons[0] as HTMLElement).click();
        return { success: true, clickedIndex: 0 };
      }
      return { success: false, clickedIndex: -1 };
    });

    console.log("Verify click outcome:", verified);
    
    if (verified.success) {
      console.log("Waiting 15 seconds for verification results...");
      await page.waitForTimeout(15000);
      await page.screenshot({ path: path.join(process.cwd(), 'gsc-final-outcome.png') });
      console.log("Screenshot saved: gsc-final-outcome.png");

      const text = await page.evaluate(() => document.body.innerText);
      console.log("Final outcome text snippet:", text.substring(0, 1000));
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
