import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    console.log("Navigating to GitHub settings...");
    await page.goto("https://github.com/settings/tokens", { waitUntil: 'load' });
    await page.waitForTimeout(5000);

    const info = await page.evaluate(() => {
      const userMeta = document.querySelector('meta[name="user-login"]');
      return {
        url: window.location.href,
        title: document.title,
        username: userMeta ? userMeta.getAttribute('content') : 'not logged in',
        bodyText: document.body.innerText.substring(0, 1000)
      };
    });

    console.log("GitHub Info:", info);
    await page.screenshot({ path: 'github-auth-status.png' });
    console.log("Screenshot saved: github-auth-status.png");
  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
