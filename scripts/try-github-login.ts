import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  try {
    console.log("Navigating to GitHub Login Page...");
    await page.goto("https://github.com/login", { waitUntil: 'load' });
    await page.waitForTimeout(3000); // Wait for Chrome autofill

    const autofillData = await page.evaluate(() => {
      const userField = document.querySelector('input[name="login"]') as HTMLInputElement;
      const passField = document.querySelector('input[name="password"]') as HTMLInputElement;
      return {
        userVal: userField ? userField.value : 'no user field',
        passVal: passField ? (passField.value ? '*** (has value)' : 'empty') : 'no pass field'
      };
    });

    console.log("Autofill Check:", autofillData);
  } catch (err: any) {
    console.error("Error checking autofill:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
