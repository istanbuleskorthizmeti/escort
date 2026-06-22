import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');

async function testClick() {
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
  const siteUrl = "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/edit";
  
  await page.goto(siteUrl, { waitUntil: 'load', timeout: 120000 });
  await page.waitForTimeout(5000);

  console.log("🔍 Current URL:", page.url());

  // Find and click the pencil edit button
  console.log("🖱️ Looking for edit pencil button...");
  const selectors = [
    'div[role="button"][aria-label*="edit" i]',
    'div[role="button"][aria-label*="düzenle" i]',
    'a[href*="/edit"]',
    'a[aria-label*="edit" i]',
    'a[aria-label*="düzenle" i]',
    'button[aria-label*="edit" i]',
    'button[aria-label*="düzenle" i]',
    '[data-tooltip*="edit" i]',
    '[data-tooltip*="düzenle" i]',
    'div[role="button"]:has(.material-icons-extended)' // Material pencil icon
  ];

  let clicked = false;
  for (const sel of selectors) {
    try {
      const locator = page.locator(sel);
      if (await locator.count() > 0) {
        console.log(`🎯 Clicking selector: ${sel}`);
        await locator.first().click();
        clicked = true;
        break;
      }
    } catch (e) {}
  }

  if (!clicked) {
    // If no selectors match, let's try clicking the bottom right quadrant of the screen using coordinates!
    // The button is in the bottom right corner (approx x: 1320, y: 720 on 1366x768 screen)
    console.log("🖱️ Coordinate fallback: clicking bottom-right corner...");
    await page.mouse.click(1325, 725);
    clicked = true;
  }

  await page.waitForTimeout(10000);
  console.log("🌐 URL after click:", page.url());

  await browserContext.close();
}

testClick();
