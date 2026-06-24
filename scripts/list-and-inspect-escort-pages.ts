import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  if (contexts.length === 0) {
    console.error("❌ No contexts found!");
    return;
  }

  const context = contexts[0];
  const pages = context.pages();
  console.log(`Found ${pages.length} pages.`);
  for (let i = 0; i < pages.length; i++) {
    const url = pages[i].url();
    console.log(`Page ${i}: ${url}`);
    if (url.includes('istanbul-escort.readme.io')) {
      console.log(`Analyzing Page ${i}...`);
      const errorCheck = await pages[i].evaluate(() => {
        const html = document.body.innerHTML;
        const text = document.body.innerText;
        return {
          hasErrorText: html.includes("Unable to render content") || html.includes("MDXish"),
          textSnippet: text.substring(0, 1000)
        };
      });
      console.log("Analysis result:", errorCheck);
    }
  }

  await browser.close();
}

run().catch(console.error);
