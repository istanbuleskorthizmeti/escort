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
    const title = await dashPage.title();
    console.log(`🏷️ Title: ${title}`);
    
    // Dump visible text of dashboard
    const bodyText = await dashPage.evaluate(() => document.body.innerText.substring(0, 1500));
    console.log(`📋 Dashboard inner text:\n${bodyText}`);

    // Take screenshot of the dashboard
    const scPath = path.join(process.cwd(), 'readme-dash-state.png');
    await dashPage.screenshot({ path: scPath });
    console.log(`📸 Screenshot saved: ${scPath}`);
    
  } catch (err: any) {
    console.error("❌ Error:", err.message);
  }
}

run().catch(console.error);
