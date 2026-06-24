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
    const siteUrl = "https://istanbul-escort.readme.io/";
    console.log(`Navigating to public site: ${siteUrl}`);
    await page.goto(siteUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    const hasTag = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return {
        scripts: scripts.map(s => s.src || s.textContent?.substring(0, 150)),
        gtagExists: typeof (window as any).gtag !== 'undefined',
        dataLayer: (window as any).dataLayer
      };
    });

    console.log("Scripts found on page:", hasTag.scripts.filter(s => s && s.includes('google')));
    console.log("gtag exists:", hasTag.gtagExists);
    console.log("dataLayer:", hasTag.dataLayer);

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
