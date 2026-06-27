import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  const url = "https://www.google.com/webmasters/verification/home?hl=tr";
  console.log(`Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(5000);

  const screenshotPath = path.join(process.cwd(), 'scratch', 'webmasters_home.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);

  // Dump page innerText
  const text = await page.evaluate(() => document.body.innerText);
  console.log("Webmasters Home Page Text:\n", text.substring(0, 1500));

  await page.close();
  await browser.close();
}

run().catch(console.error);
