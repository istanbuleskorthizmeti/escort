import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const chromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("🔍 [DOM INSPECT] Starting DOM inspect...");
  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    executablePath: chromePath,
    viewport: { width: 1366, height: 768 }
  });

  const page = await browserContext.newPage();
  try {
    await page.goto("https://search.google.com/search-console", { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000);

    const elements = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      return all
        .filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && el.textContent && el.textContent.trim().length > 0;
        })
        .map(el => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          text: el.textContent?.trim().substring(0, 100),
          rect: el.getBoundingClientRect()
        }));
    });

    fs.writeFileSync(
      path.join(process.cwd(), 'gsc-dom-elements.json'),
      JSON.stringify(elements, null, 2)
    );
    console.log(`Saved ${elements.length} elements to gsc-dom-elements.json`);

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await browserContext.close();
  }
}

run();
