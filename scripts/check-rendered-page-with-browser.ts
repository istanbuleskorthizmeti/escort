import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to browser...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    const urls = [
      "https://istanbul-eskort-hizmeti.readme.io/docs/getting-started",
      "https://istanbul-eskort-hizmeti.readme.io/docs/istanbul-escort"
    ];
    for (const url of urls) {
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: 'load' });
      await page.waitForTimeout(8000); // Wait for React app to mount and render

      console.log(`Final URL: ${page.url()}`);
      console.log(`Final Title: ${await page.title()}`);

      const bodyText = await page.evaluate(() => document.body.innerText);
      const hasError = bodyText.includes('Unable to render') || bodyText.includes('not renderable');
      console.log("Does it contain render error?", hasError);
      if (hasError) {
        const idx = bodyText.indexOf('Unable to render');
        const idx2 = bodyText.indexOf('not renderable');
        const start = Math.max(0, Math.min(idx !== -1 ? idx : bodyText.length, idx2 !== -1 ? idx2 : bodyText.length) - 100);
        console.log("Snippet around error:");
        console.log(bodyText.substring(start, start + 600));
      } else {
        console.log("Page render successful!");
      }
      await page.screenshot({ path: `readme-client-${url.split('/').pop()}-check.png` });
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
