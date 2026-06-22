import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const chromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("🔍 [DIAGNOSE] Launching Chrome to inspect GSC verification details...");
  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    executablePath: chromePath,
    viewport: { width: 1366, height: 768 }
  });

  const page = await browserContext.newPage();
  try {
    const siteUrl = "https://search.google.com/search-console/settings/ownership?resource_id=https%3A%2F%2Fsites.google.com%2Fdorukcanay.digital%2Fsefakoyistanbul-drkcnay2026%2F";
    console.log(`Navigating to: ${siteUrl}`);
    await page.goto(siteUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    await page.screenshot({ path: path.join(process.cwd(), 'ownership-page.png') });
    console.log("Screenshot of ownership page saved to ownership-page.png");

    // Let's log the text on the page to see if we can find any verification methods
    const pageText = await page.evaluate(() => document.body.textContent || '');
    console.log("Page contains 'Google Analytics'?", pageText.includes('Google Analytics') || pageText.includes('Analytics'));

    // Find any buttons or cards for Google Analytics
    const methods = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div, span, button'));
      return cards
        .filter(c => {
          const text = c.textContent || '';
          return (text.includes('Analytics') || text.includes('Tag Manager') || text.includes('HTML')) && text.length < 100;
        })
        .map(c => ({
          tagName: c.tagName,
          text: c.textContent?.trim(),
          role: c.getAttribute('role'),
          rect: c.getBoundingClientRect()
        }));
    });
    console.log("Verification methods found:", methods);

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await browserContext.close();
  }
}

run();
