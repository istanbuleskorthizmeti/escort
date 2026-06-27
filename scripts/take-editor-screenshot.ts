import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const CHROME_PATH = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function diagScreenshot() {
  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    executablePath: CHROME_PATH,
    viewport: { width: 1366, height: 768 }
  });

  const page = await browserContext.newPage();
  try {
    const editorUrl = "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/edit";
    console.log(`Navigating to ${editorUrl}...`);
    await page.goto(editorUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(10000);
    
    console.log(`Current URL: ${page.url()}`);
    const screenshotPath = path.join(process.cwd(), 'artifacts', 'editor_diag.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to ${screenshotPath}`);
  } catch (e: any) {
    console.error("Error:", e.message);
  } finally {
    await browserContext.close();
  }
}

diagScreenshot();
