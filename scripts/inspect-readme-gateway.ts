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
  console.log("Opening new tab to ReadMe gateway URL...");
  const page = await context.newPage();

  try {
    const gatewayUrl = "https://dash.readme.com/hub-go/istanbul-escort?redirect=/v1.0";
    console.log(`Navigating to: ${gatewayUrl}`);
    await page.goto(gatewayUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(10000);

    const currentUrl = page.url();
    console.log("Current URL after redirection:", currentUrl);

    await page.screenshot({ path: path.join(process.cwd(), 'readme-gateway-after.png') });
    console.log("Screenshot saved: readme-gateway-after.png");

    const pageText = await page.evaluate(() => document.body.innerText);
    console.log("Page text snippet:");
    console.log(pageText.substring(0, 1000));

    // Let's print out all links on this page
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => ({
        href: a.href,
        text: a.textContent?.trim()
      }));
    });
    console.log("Links on redirected page:", links);

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
