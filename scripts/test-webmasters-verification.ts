import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  const targetUrl = "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa/";
  // Webmasters Verification details URL
  const verificationUrl = `https://www.google.com/webmasters/verification/details?hl=tr&siteUrl=${encodeURIComponent(targetUrl)}`;

  console.log(`Navigating to: ${verificationUrl}`);
  await page.goto(verificationUrl, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(5000);

  const screenshotPath = path.join(process.cwd(), 'scratch', 'webmasters_verification.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);

  // Dump some page info/text
  const pageText = await page.evaluate(() => document.body.innerText);
  console.log("Page Text:\n", pageText.substring(0, 1000));

  await page.close();
  await browser.close();
}

run().catch(console.error);
