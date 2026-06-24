import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

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
    const urls = [
      "https://istanbul-escort.readme.io/docs/istanbul-escort",
      "https://istanbul-escort.readme.io/docs/istanbul-esenyurt-cumhuriyet-escort",
      "https://istanbul-escort.readme.io/docs/istanbul-besiktas-escort"
    ];

    for (const url of urls) {
      console.log(`Navigating to: ${url}`);
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(5000);
      
      const content = await page.evaluate(() => {
        const html = document.body.innerHTML;
        const text = document.body.innerText;
        return {
          hasError: html.includes("Unable to render content") || text.includes("Unable to render content"),
          title: document.title,
          textSnippet: text.substring(0, 500)
        };
      });
      console.log(`URL: ${url} ->`, content);
    }
  } catch (err: any) {
    console.error("Error during check:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
