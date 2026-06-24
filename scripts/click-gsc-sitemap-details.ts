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
    await page.waitForTimeout(6000);

    // Find the row containing '/sitemap.xml' and click it
    console.log("Clicking on /sitemap.xml row...");
    const clicked = await page.evaluate(() => {
      // Find all elements containing /sitemap.xml
      const elements = Array.from(document.querySelectorAll('*'));
      const target = elements.find(el => {
        const text = el.textContent || '';
        return text.trim() === '/sitemap.xml' && el.children.length === 0;
      });
      if (target) {
        // Find nearest clickable parent or row
        let parent: HTMLElement | null = target as HTMLElement;
        while (parent && parent.tagName !== 'TR' && !parent.getAttribute('role')?.includes('button')) {
          parent = parent.parentElement;
        }
        if (parent) {
          parent.click();
          return { success: true, clickedTagName: parent.tagName };
        }
        (target as HTMLElement).click();
        return { success: true, clickedTagName: target.tagName };
      }
      return { success: false };
    });

    console.log("Click action result:", clicked);

    console.log("Waiting 6 seconds for drawer/details to load...");
    await page.waitForTimeout(6000);

    const screenshotPath = path.join(process.cwd(), 'gsc-sitemap-details.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Details screenshot saved: ${screenshotPath}`);

    const text = await page.evaluate(() => document.body.innerText);
    console.log("\n📋 Page Text Content (first 2500 chars):\n", text.substring(0, 2500));

  } catch (err: any) {
    console.error("❌ Error during GSC sitemap details check:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
