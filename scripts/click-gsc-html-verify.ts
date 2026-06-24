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
    console.log("Locating and clicking GSC HTML Tag verification...");

    // Click HTML etiketi option to expand
    await gscPage.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div'));
      const htmlOption = items.find(item => item.textContent?.trim() === 'HTML etiketi');
      if (htmlOption) {
        const header = htmlOption.closest('[role="button"]') || htmlOption;
        (header as HTMLElement).click();
      }
    });

    await gscPage.waitForTimeout(2000);

    // Locate the verify button within the HTML tag container and click it
    const clickResult = await gscPage.evaluate(() => {
      const htmlOption = Array.from(document.querySelectorAll('div')).find(div => div.textContent?.trim() === 'HTML etiketi');
      if (htmlOption) {
        const container = htmlOption.closest('div[role="listitem"]') || htmlOption.closest('div');
        if (container) {
          const verifyBtn = Array.from(container.querySelectorAll('button, div[role="button"]')).find(b => 
            b.textContent?.toLowerCase().includes('doğrula') || 
            b.textContent?.toLowerCase().includes('verify')
          );
          if (verifyBtn) {
            (verifyBtn as HTMLElement).click();
            return "Clicked HTML Tag verification button!";
          }
        }
      }
      return "HTML Tag verification button not found!";
    });

    console.log("Click result:", clickResult);
    await gscPage.waitForTimeout(8000);

    console.log("Post-verification URL:", gscPage.url());
    await gscPage.screenshot({ path: path.join(process.cwd(), 'gsc-after-html-verify.png') });
    console.log("Screenshot saved: gsc-after-html-verify.png");

  } catch (err: any) {
    console.error("Error verifying HTML tag on GSC:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
