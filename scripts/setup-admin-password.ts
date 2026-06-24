import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  
  // Create clean context
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const signupUrl = 'https://dash.readme.com/to/istanbul-escort/signup?user=info%40dorukcanay.digital';
    console.log(`Navigating to signup URL in clean context: ${signupUrl}`);
    await page.goto(signupUrl, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(6000);

    await page.screenshot({ path: path.join(process.cwd(), 'readme-signup-initial.png') });
    console.log("Initial signup screenshot saved.");

    // Check if there are password inputs
    const inputsInfo = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      return inputs.map(i => ({
        type: i.type,
        name: i.name,
        placeholder: i.placeholder,
        id: i.id
      }));
    });

    console.log("Signup inputs found:", inputsInfo);

    // Let's fill out the inputs if they exist
    // Usually name, password, etc.
    await page.evaluate(() => {
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const pwInput = document.querySelector('input[name="password"], input[type="password"]') as HTMLInputElement;
      
      if (nameInput) {
        nameInput.value = 'Dorukcan AY Admin';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (pwInput) {
        pwInput.value = 'DorukcanayAdmin2026!';
        pwInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(process.cwd(), 'readme-signup-filled.png') });

    // Click submit/register button
    console.log("Submitting password creation form...");
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]') || document.querySelector('button');
      if (btn) (btn as HTMLElement).click();
    });

    await page.waitForTimeout(10000);
    console.log("Post-signup URL:", page.url());
    await page.screenshot({ path: path.join(process.cwd(), 'readme-signup-result.png') });

  } catch (err: any) {
    console.error("Error setting up password:", err.message);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
}

run().catch(console.error);
