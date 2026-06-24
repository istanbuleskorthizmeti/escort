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
    const inspectUrl = "https://search.google.com/search-console/inspect?resource_id=https://istanbul-eskort-hizmeti.readme.io/&url=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2Fsitemap.xml";
    console.log(`Navigating to GSC Inspection page:\n${inspectUrl}`);
    await page.goto(inspectUrl, { waitUntil: 'load', timeout: 45000 });
    
    console.log("Waiting 10 seconds for initial inspection retrieval data...");
    await page.waitForTimeout(10000);
    
    await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemap-inspect-initial.png') });
    console.log("📸 Screenshot saved: gsc-sitemap-inspect-initial.png");

    console.log("Locating and clicking 'Test Live URL' button...");
    const clickedLiveTest = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="button"], div, span'));
      const target = buttons.find(b => {
        const text = b.textContent || '';
        return /Canlı URL'yi test et|Test Live URL/i.test(text.trim()) && text.trim().length < 30;
      });
      if (target) {
        (target as HTMLElement).click();
        return { success: true, text: target.textContent?.trim() };
      }
      return { success: false };
    });

    console.log("Click Live Test button result:", clickedLiveTest);

    if (clickedLiveTest.success) {
      console.log("⏳ Live Test triggered! Waiting 80 seconds for crawl to execute...");
      await page.waitForTimeout(80000);
      
      await page.screenshot({ path: path.join(process.cwd(), 'gsc-sitemap-inspect-live.png') });
      console.log("📸 Screenshot saved: gsc-sitemap-inspect-live.png");
      
      const pageText = await page.evaluate(() => document.body.innerText);
      console.log("\n📋 Live Test Outcome Snippet:\n", pageText.substring(0, 1500));
    } else {
      console.log("❌ Could not trigger Live Test button. Let's dump page text:");
      const pageText = await page.evaluate(() => document.body.innerText);
      console.log(pageText.substring(0, 1000));
    }

  } catch (err: any) {
    console.error("❌ Error during GSC Live Test:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
