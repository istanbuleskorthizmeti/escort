import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');

async function inspectPencil() {
  console.log("🚀 [DIAGNOSTIC] Inspecting elements on Google Sites Edit page...");
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

  // Find all elements that are buttons or links or have click events
  const elements = await page.evaluate(() => {
    const list: any[] = [];
    // Search all clickable or visual elements in bottom right area
    const all = document.querySelectorAll('a, button, div[role="button"], [class*="edit"], [id*="edit"]');
    all.forEach(el => {
      const rect = el.getBoundingClientRect();
      // Check if it is in the bottom right corner (e.g. x > 1000, y > 500)
      if (rect.right > 1000 && rect.bottom > 500) {
        list.push({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          ariaLabel: el.getAttribute('aria-label'),
          text: (el as HTMLElement).innerText || '',
          rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height }
        });
      }
    });
    return list;
  });

  console.log("🔍 Elements found in bottom-right quadrant:", JSON.stringify(elements, null, 2));

  await browserContext.close();
}

inspectPencil();
