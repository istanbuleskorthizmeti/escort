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
  console.log("Opening new tab to ReadMe.io to check the logged-in project...");
  const page = await context.newPage();

  try {
    const dashUrl = "https://dash.readme.com/";
    console.log(`Navigating to: ${dashUrl}`);
    await page.goto(dashUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(6000);

    await page.screenshot({ path: path.join(process.cwd(), 'readme-dashboard.png') });
    console.log("Screenshot saved: readme-dashboard.png");

    const pageText = await page.evaluate(() => document.body.innerText);
    console.log("Page text snippet:");
    console.log(pageText.substring(0, 1500));

    // Let's print out all href links on the page
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => ({
        href: a.href,
        text: a.textContent?.trim()
      }));
    });
    console.log("Links on dashboard page:", links);

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
