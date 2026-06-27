import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to browser...");
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const siteUrl = "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa/";
    const targetUrl = `https://www.google.com/webmasters/verification/add-owner?hl=en&siteUrl=${encodeURIComponent(siteUrl)}`;
    
    console.log(`Navigating to: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'load' });
    await page.waitForTimeout(6000);

    const title = await page.title();
    console.log("Page Title:", title);
    
    await page.screenshot({ path: 'gsc-add-owner-test.png' });
    console.log("Screenshot saved: gsc-add-owner-test.png");

    const html = await page.content();
    console.log("Contains input for newOwner?", html.includes('newOwner') || html.includes('email') || html.includes('input'));

  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
