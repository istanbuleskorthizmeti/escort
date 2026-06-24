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
    const appearanceUrl = "https://dash.readme.com/project/istanbul-escort/v1.0/appearance";
    await page.goto(appearanceUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(6000);

    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => ({
        href: a.href,
        text: a.textContent?.trim() || ''
      }));
    });

    console.log("All Links on Page:");
    console.log(links.filter(l => l.text.length > 0 || l.href.includes('css') || l.href.includes('style')));

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
