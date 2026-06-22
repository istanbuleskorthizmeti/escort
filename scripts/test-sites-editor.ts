import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');

async function testEditor() {
  console.log("🚀 [DIAGNOSTIC] Launching Chrome in non-headless mode...");
  const chromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";
  
  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    executablePath: chromePath,
    viewport: { width: 1366, height: 768 },
    args: [
      '--start-maximized',
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browserContext.newPage();
  
  // Try to load one of the Google Sites editor URLs
  const siteUrl = "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/edit";
  console.log(`📡 Loading editor: ${siteUrl}`);
  
  await page.goto(siteUrl, { waitUntil: 'load', timeout: 120000 });
  await page.waitForTimeout(10000); // Wait 10 seconds to inspect visually and check redirection

  console.log("📸 Editor page loaded. Closing browser...");
  await browserContext.close();
}

testEditor();
