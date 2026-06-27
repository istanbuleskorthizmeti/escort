import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    await page.goto("https://github.com/", { waitUntil: 'load' });
    const info = await page.evaluate(() => {
      const metaUser = document.querySelector('meta[name="user-login"]');
      const metaUserVal = metaUser ? metaUser.getAttribute('content') : null;
      
      const headerNav = document.body.innerHTML.includes('Sign in') ? 'Sign-in button found' : 'No sign-in button';
      
      return {
        url: window.location.href,
        title: document.title,
        userLoginMeta: metaUserVal,
        headerNav
      };
    });

    console.log("GitHub Info:", info);
  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
