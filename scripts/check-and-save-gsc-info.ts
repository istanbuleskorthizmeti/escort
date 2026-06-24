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
    console.log("Reading page state...");
    
    // Check if the HTML tag dropdown is open and print any input tags
    const htmlInfo = await gscPage.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const textFields = inputs.map(input => ({
        id: input.id,
        name: input.name,
        value: input.value,
        outerHTML: input.outerHTML
      }));

      // Find any element containing "google-site-verification"
      const metaTagEl = document.querySelector('input[value*="google-site-verification"]');
      
      return {
        textFields,
        metaVal: metaTagEl ? (metaTagEl as HTMLInputElement).value : null
      };
    });

    console.log("HTML Verification Info:", htmlInfo);

    await gscPage.screenshot({ path: path.join(process.cwd(), 'gsc-detailed-state.png') });
    console.log("Screenshot saved: gsc-detailed-state.png");

  } catch (err: any) {
    console.error("Error reading GSC state:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
