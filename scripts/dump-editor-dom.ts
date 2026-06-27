import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const CHROME_PATH = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";
const SITE_URL = "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa";

async function dumpDom() {
  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    executablePath: CHROME_PATH,
    viewport: { width: 1366, height: 768 }
  });

  const page = await browserContext.newPage();
  try {
    console.log(`Navigating to public URL: ${SITE_URL}`);
    await page.goto(SITE_URL, { waitUntil: 'load', timeout: 120000 });
    await page.waitForTimeout(5000);

    // Edit button click
    console.log("Clicking edit pencil button...");
    await page.mouse.click(1325, 725);
    await page.waitForTimeout(15000);

    const pages = await browserContext.pages();
    const editorPage = pages.find(p => p.url().includes('sites.google.com') && p.url().includes('/edit')) || pages[pages.length - 1];

    console.log(`Auditing editor page: ${editorPage.url()}`);
    
    // Dump all buttons, tooltips, and aria-labels
    const buttonData = await editorPage.evaluate(() => {
      const elList = Array.from(document.querySelectorAll('button, div[role="button"], [aria-label], [data-tooltip]'));
      return elList.map(el => ({
        tagName: el.tagName,
        text: el.textContent?.trim().slice(0, 50),
        ariaLabel: el.getAttribute('aria-label'),
        dataTooltip: el.getAttribute('data-tooltip'),
        class: el.getAttribute('class')
      }));
    });

    console.log(`Found ${buttonData.length} matching elements:`);
    console.log(JSON.stringify(buttonData.slice(0, 50), null, 2));

  } catch (e: any) {
    console.error("Error:", e.message);
  } finally {
    await browserContext.close();
  }
}

dumpDom();
