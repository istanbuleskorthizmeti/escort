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
  
  const gscPage = pages.find(p => p.url().includes('search.google.com/search-console'));
  if (!gscPage) {
    console.error("❌ GSC page not found!");
    await browser.close();
    return;
  }

  try {
    console.log("Expanding GSC verification options...");

    // Click on HTML etiketi to expand it
    await gscPage.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div'));
      const htmlTagOption = items.find(item => item.textContent?.trim() === 'HTML etiketi');
      if (htmlTagOption) {
        const header = htmlTagOption.closest('[role="button"]') || htmlTagOption;
        (header as HTMLElement).click();
      }
    });

    await gscPage.waitForTimeout(2000);

    // Let's print the page content to see the meta tag details
    const metaTagText = await gscPage.evaluate(() => {
      return document.body.innerText;
    });

    console.log("Expanded HTML tag details:");
    const metaMatch = metaTagText.match(/<meta name="google-site-verification" content="([^"]+)"/);
    if (metaMatch) {
      console.log("🎯 Required meta tag content:", metaMatch[0]);
    } else {
      // Print nearby text
      const idx = metaTagText.indexOf('HTML etiketi');
      if (idx > -1) {
        console.log(metaTagText.substring(idx, idx + 600));
      }
    }

    // Now let's expand and try Google Analytics verification
    console.log("Clicking Google Analytics option...");
    await gscPage.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div'));
      const gaOption = items.find(item => item.textContent?.trim() === 'Google Analytics');
      if (gaOption) {
        const header = gaOption.closest('[role="button"]') || gaOption;
        (header as HTMLElement).click();
      }
    });

    await gscPage.waitForTimeout(2000);

    // Click verify inside Google Analytics section
    console.log("Clicking DOĞRULA button inside Google Analytics section...");
    const verifyResult = await gscPage.evaluate(() => {
      // Find all buttons
      const buttons = Array.from(document.querySelectorAll('button, div[role="button"]'));
      
      // Let's find the GA section container
      const gaHeader = Array.from(document.querySelectorAll('div')).find(div => div.textContent?.trim() === 'Google Analytics');
      if (gaHeader) {
        const container = gaHeader.closest('div[role="listitem"]') || gaHeader.closest('div');
        if (container) {
          const verifyBtn = Array.from(container.querySelectorAll('button, div[role="button"]')).find(b => 
            b.textContent?.toLowerCase().includes('doğrula') || 
            b.textContent?.toLowerCase().includes('verify')
          );
          if (verifyBtn) {
            (verifyBtn as HTMLElement).click();
            return "Clicked GA verify button!";
          }
        }
      }
      
      return "GA verify button not found!";
    });

    console.log("Verify click action:", verifyResult);

    await gscPage.waitForTimeout(8000);

    console.log("Post-verification URL:", gscPage.url());
    await gscPage.screenshot({ path: path.join(process.cwd(), 'gsc-after-ga-verify.png') });
    console.log("Screenshot saved: gsc-after-ga-verify.png");

  } catch (err: any) {
    console.error("Error expanding options:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
