import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("Connecting to Chrome...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  const url = "https://www.google.com/webmasters/verification/home?hl=en";
  console.log("Navigating to classic home:", url);
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(5000);

  console.log("Current URL:", page.url());

  const screenshotPath = path.join(process.cwd(), 'scratch', 'gsc_classic_home.png');
  await page.screenshot({ path: screenshotPath });
  console.log("Screenshot saved to:", screenshotPath);

  const text = await page.evaluate(() => document.body.innerText);
  console.log("\n--- PAGE BODY TEXT ---");
  console.log(text.substring(0, 1000));

  await page.close();
  await browser.close();
}

run().catch(console.error);
