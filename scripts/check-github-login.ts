import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  if (contexts.length === 0) {
    console.error("❌ No contexts found!");
    return;
  }

  const context = contexts[0];
  const page = await context.newPage();

  try {
    console.log("Navigating to github.com...");
    await page.goto("https://github.com/", { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(3000);

    const loggedInUser = await page.evaluate(() => {
      // Look for meta tag or user links
      const metaUser = document.querySelector('meta[name="user-login"]');
      if (metaUser) {
        return metaUser.getAttribute('content');
      }
      // Check for user-profile-link or avatar dropdown
      const avatarBtn = document.querySelector('button[aria-label="Open user navigation menu"]');
      if (avatarBtn) {
        return 'Logged in, but username hidden';
      }
      return 'Not logged in';
    });

    console.log("GitHub Login Status:", loggedInUser);
    
    if (loggedInUser !== 'Not logged in') {
      // Take screenshot of the header area or save DOM to see the user
      await page.screenshot({ path: 'github-status.png' });
      console.log("Screenshot saved: github-status.png");
    }

  } catch (err: any) {
    console.error("Error checking GitHub:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
