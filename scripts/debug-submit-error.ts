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

    console.log("✍️ Filling Name and Password...");
    await page.fill('input[name="name"]', 'Mehmet');
    await page.fill('input[name="password"]', '212jeAmind!');
    await page.waitForTimeout(1000);

    console.log("💾 Submitting Form...");
    await page.click('button[type="submit"]');
    
    console.log("⏳ Waiting 8 seconds for page to transition or show error...");
    await page.waitForTimeout(8000);

    const currentUrl = page.url();
    console.log(`📍 Resulting URL: ${currentUrl}`);

    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log(`📋 Resulting Page Text:\n${bodyText}\n`);

    const errorElements = await page.evaluate(() => {
      // Find all elements that might contain error messages
      const els = Array.from(document.querySelectorAll('*'));
      return els
        .filter(el => {
          const className = el.className || '';
          const id = el.id || '';
          return /error|message|invalid|fail|warning|alert/i.test(String(className)) || /error|message|invalid|fail|warning|alert/i.test(String(id));
        })
        .map(el => ({
          tag: el.tagName,
          className: el.className,
          text: el.textContent?.trim()
        }))
        .filter(el => el.text && el.text.length > 0);
    });
    console.log("📋 Found potential error elements:", errorElements);

  } catch (err: any) {
    console.error("❌ Error during debug:", err.message);
  } finally {
    await page.close();
  }
}

run().catch(console.error);
