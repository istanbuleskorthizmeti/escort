import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

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
  const pages = context.pages();
  const dashPage = pages.find(p => p.url().includes('dash.readme.com')) || pages[0];
  
  console.log(`📍 Inspecting page: ${dashPage.url()}`);
  
  try {
    // Navigate to dashboard root first to be sure
    await dashPage.goto("https://dash.readme.com/", { waitUntil: 'load', timeout: 30000 });
    await dashPage.waitForTimeout(5000);

    // Take screenshot of the main dashboard
    await dashPage.screenshot({ path: path.join(process.cwd(), 'readme-dash-debug-1.png') });

    // Look for organization switcher or profile dropdown elements
    const orgs = await dashPage.evaluate(() => {
      // Find all dropdown triggers or selectors
      const elements = Array.from(document.querySelectorAll('a, button, div, span'));
      const buttons = elements.filter(el => {
        const text = el.textContent?.trim() || '';
        return /Organization|Switch|Team|Select|Mehmet|Dorukcanay/i.test(text);
      }).map(el => ({
        tagName: el.tagName,
        text: el.textContent?.trim(),
        className: el.className,
        id: el.id
      }));
      return buttons;
    });

    console.log("📋 Potential switcher elements found:", JSON.stringify(orgs, null, 2));

    // Try clicking organization selector if we find it
    // Let's also check if there is an active user email visible in the DOM
    const userEmail = await dashPage.evaluate(() => {
      return document.body.innerHTML.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    });
    console.log("📋 Found email patterns in source:", Array.from(new Set(userEmail)));

  } catch (err: any) {
    console.error("❌ Error:", err.message);
  }
}

run().catch(console.error);
