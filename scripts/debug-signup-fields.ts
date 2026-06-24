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
    const signupUrl = 'https://dash.readme.com/to/istanbul-escort/signup?user=info%40dorukcanay.digital';
    console.log(`🔗 Navigating to signup link: ${signupUrl}`);
    await page.goto(signupUrl, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(6000);

    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log(`📋 Body Text:\n${bodyText}\n`);

    const inputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input')).map(input => ({
        type: input.type,
        name: input.name,
        id: input.id,
        placeholder: input.placeholder,
        value: input.value,
        className: input.className
      }));
    });
    console.log("📋 Input Fields:", inputs);

    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).map(btn => ({
        type: btn.type,
        text: btn.textContent?.trim(),
        className: btn.className
      }));
    });
    console.log("📋 Buttons:", buttons);

  } catch (err: any) {
    console.error("❌ Error:", err.message);
  } finally {
    await page.close();
  }
}

run().catch(console.error);
