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
  
  // Find the Search Console tab
  let gscPage = pages.find(p => p.url().includes('search.google.com/search-console'));
  if (!gscPage) {
    console.log("Creating new tab for Search Console...");
    gscPage = await context.newPage();
  }

  try {
    const gscUrl = "https://search.google.com/search-console?resource_id=https://istanbul-eskort-hizmeti.readme.io/";
    console.log(`Navigating to: ${gscUrl}`);
    await gscPage.goto(gscUrl, { waitUntil: 'load', timeout: 45000 });
    await gscPage.waitForTimeout(8000);

    const info = await gscPage.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        text: document.body.innerText.substring(0, 1500)
      };
    });

    console.log("GSC Page info:", info);
    
    // Check if we need to click "Verify" or if we are already verified
    const isVerified = !gscPage.url().includes('not-verified');
    console.log("Is property already verified?", isVerified);

    if (!isVerified) {
      console.log("Attempting to find and click the verification buttons...");
      
      // Look for verify buttons (e.g. HTML tag or HTML file verification)
      await gscPage.evaluate(() => {
        // Find buttons containing text "Doğrula" or "Verify"
        const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
        const verifyBtn = buttons.find(b => 
          b.textContent?.toLowerCase().includes('doğrula') || 
          b.textContent?.toLowerCase().includes('verify')
        );
        if (verifyBtn) {
          (verifyBtn as HTMLElement).click();
          return "Clicked verification button!";
        }
        return "Verification button not found by text search.";
      });

      await gscPage.waitForTimeout(10000);
      
      // Let's check status again
      console.log("Post-click verification URL:", gscPage.url());
    }

    await gscPage.screenshot({ path: path.join(process.cwd(), 'gsc-verification-status.png') });
    console.log("Screenshot saved: gsc-verification-status.png");

  } catch (err: any) {
    console.error("Error verifying on GSC:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
