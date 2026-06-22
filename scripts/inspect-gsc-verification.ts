import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const chromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    executablePath: chromePath,
    viewport: { width: 1366, height: 768 }
  });

  const page = await browserContext.newPage();
  try {
    const siteUrl = "https://search.google.com/search-console/users?resource_id=https%3A%2F%2Fsites.google.com%2Fdorukcanay.digital%2Fsefakoyistanbul-drkcnay2026%2F";
    console.log(`Navigating to: ${siteUrl}`);
    await page.goto(siteUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    // List all elements that might be the verification button
    const buttonsInfo = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      return all
        .filter(el => {
          const text = el.textContent || '';
          return text.includes('SAHİPLİĞİNİZİ DOĞRULAYIN') || text.includes('Sahipliğinizi doğrulayın');
        })
        .map(el => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          role: el.getAttribute('role'),
          text: el.textContent?.trim().substring(0, 50),
          rect: el.getBoundingClientRect(),
          isVisible: (el as HTMLElement).offsetWidth > 0 && (el as HTMLElement).offsetHeight > 0
        }));
    });

    console.log("Matching elements found:", JSON.stringify(buttonsInfo, null, 2));

    if (buttonsInfo.length > 0) {
      // Find the first visible element that is actually clickable (tagName button or role button, or the smallest element containing the text)
      const target = buttonsInfo.find(b => b.isVisible && (b.tagName === 'BUTTON' || b.role === 'button' || b.tagName === 'SPAN'));
      if (target) {
        console.log("Clicking target:", target);
        // Let's click it using mouse coordinates to make sure it triggers!
        const x = target.rect.left + target.rect.width / 2;
        const y = target.rect.top + target.rect.height / 2;
        console.log(`Clicking coordinates: x=${x}, y=${y}`);
        await page.mouse.click(x, y);
        
        console.log("Waiting 15 seconds to capture screenshot after click...");
        await page.waitForTimeout(15000);
        await page.screenshot({ path: path.join(process.cwd(), 'verification-clicked.png') });
        console.log("Screenshot saved to verification-clicked.png");
      } else {
        console.log("No visible clickable target found.");
      }
    } else {
      console.log("No matching elements containing verification text found.");
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await browserContext.close();
  }
}

run();
