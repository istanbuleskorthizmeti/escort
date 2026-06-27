import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    console.log("Navigating to ReadMe Dashboard...");
    await page.goto("https://dash.readme.com/", { waitUntil: 'load' });
    await page.waitForTimeout(5000);

    const info = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        bodyText: document.body.innerText.substring(0, 1000)
      };
    });

    console.log("ReadMe Dash Info:", info);
  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
