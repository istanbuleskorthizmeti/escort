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
    const siteUrl = "https://search.google.com/search-console/sitemaps?resource_id=https://istanbul-eskort-hizmeti.readme.io/";
    console.log(`Navigating to: ${siteUrl}`);
    await page.goto(siteUrl, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(10000);

    const screenshotPath = path.join(process.cwd(), 'gsc-sitemaps-status.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);

    const text = await page.evaluate(() => document.body.innerText);
    console.log("\n📋 Page Text Content (first 1500 chars):\n", text.substring(0, 1500));

    // Try to find if there are any specific errors or detailed messages
    const errorElements = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr, div'));
      return rows
        .map(r => r.textContent || '')
        .filter(t => t.includes('Couldn\'t fetch') || t.includes('Getirilemedi') || t.includes('Hata') || t.includes('Error'))
        .slice(0, 5);
    });
    console.log("\n⚠️ Error elements found:", errorElements);

  } catch (err: any) {
    console.error("❌ Error during GSC sitemaps inspection:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
