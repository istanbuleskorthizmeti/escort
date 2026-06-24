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

  // Capture console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try {
    const siteUrl = "https://istanbul-escort.readme.io/docs/istanbul-escort";
    console.log(`Navigating to public page: ${siteUrl}`);
    await page.goto(siteUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(6000);

    const info = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script')).map(s => ({
        src: s.src,
        textSnippet: s.textContent?.substring(0, 150)
      }));
      return {
        url: window.location.href,
        scripts,
        gtagExists: typeof (window as any).gtag !== 'undefined',
        dataLayerExists: typeof (window as any).dataLayer !== 'undefined'
      };
    });

    console.log("Page URL loaded:", info.url);
    console.log("All scripts on page:", info.scripts);
    console.log("gtag exists:", info.gtagExists);
    console.log("dataLayer exists:", info.dataLayerExists);

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
