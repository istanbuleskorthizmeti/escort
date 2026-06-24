import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  let loginPage: any = null;
  for (const ctx of contexts) {
    const pages = ctx.pages();
    for (const p of pages) {
      if (p.url().includes('dash.readme.com/to/istanbul-eskort-hizmeti')) {
        loginPage = p;
        break;
      }
    }
  }

  if (loginPage) {
    console.log("🎯 Found login page:", loginPage.url());
    
    // Check if email input exists and fill it
    await loginPage.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      if (emailInput) {
        emailInput.value = 'info@dorukcanay.digital';
        // Trigger change events
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
        console.log("Filled email input with info@dorukcanay.digital");
      }
    });

    // Take screenshot before click
    await loginPage.screenshot({ path: path.join(process.cwd(), 'login-before-click.png') });
    console.log("Saved login-before-click.png");

    // Click "Send Login Link" button
    const buttonClicked = await loginPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const sendButton = buttons.find(b => b.innerText.includes('Send Login Link') || b.innerText.includes('Link'));
      if (sendButton) {
        sendButton.click();
        return true;
      }
      return false;
    });

    console.log("Button clicked status:", buttonClicked);
    await loginPage.waitForTimeout(5000);
    await loginPage.screenshot({ path: path.join(process.cwd(), 'login-after-click.png') });
    console.log("Saved login-after-click.png");
  } else {
    console.log("⚠️ Login page not found.");
  }

  await browser.close();
}

run().catch(console.error);
