import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const CHROME_PATH = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function runDiag() {
  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    executablePath: CHROME_PATH,
    viewport: { width: 1366, height: 768 }
  });

  const page = await browserContext.newPage();
  try {
    const siteUrl = "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa";
    console.log(`Navigating to public page: ${siteUrl}`);
    await page.goto(siteUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000);

    console.log("Looking for edit pencil button...");
    const editSelectors = [
      'div[role="button"][aria-label*="edit" i]',
      'div[role="button"][aria-label*="düzenle" i]',
      'a[href*="/edit"]',
      'a[aria-label*="edit" i]'
    ];

    let clicked = false;
    for (const sel of editSelectors) {
      const loc = page.locator(sel);
      if (await loc.count() > 0) {
        console.log(`Clicking: ${sel}`);
        await loc.first().click();
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      console.log("Fallback click at bottom-right corner...");
      await page.mouse.click(1325, 725);
    }

    console.log("Waiting 15 seconds for redirection/editor to load...");
    await page.waitForTimeout(15000);

    const pages = await browserContext.pages();
    console.log(`Total open pages: ${pages.length}`);
    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      const url = p.url();
      console.log(`Page #${i}: ${url}`);
      try {
        const scPath = path.join(process.cwd(), 'artifacts', `page_${i}_screenshot.png`);
        await p.screenshot({ path: scPath });
        console.log(`Saved screenshot for Page #${i} to ${scPath}`);
      } catch (e: any) {
        console.log(`Could not screenshot Page #${i}: ${e.message}`);
      }
    }
  } catch (e: any) {
    console.error("Error:", e.message);
  } finally {
    await browserContext.close();
  }
}

runDiag();
