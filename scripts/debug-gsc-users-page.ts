import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("Connecting to Chrome...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  const targetUrl = "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa/";
  const usersUrl = `https://search.google.com/search-console/users?resource_id=${encodeURIComponent(targetUrl)}`;

  console.log(`Navigating to users settings: ${usersUrl}`);
  await page.goto(usersUrl, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(5000);

  console.log("Current URL:", page.url());

  const screenshotPath = path.join(process.cwd(), 'scratch', 'gsc_users_debug.png');
  await page.screenshot({ path: screenshotPath });
  console.log("Screenshot saved to:", screenshotPath);

  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log("\n--- PAGE BODY TEXT ---");
  console.log(bodyText.substring(0, 1000));

  await page.close();
  await browser.close();
}

run().catch(console.error);
