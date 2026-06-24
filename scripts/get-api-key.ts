import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const chromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("🚀 Starting Playwright ReadMe Scraper...");
  if (!fs.existsSync(USER_DATA_DIR)) {
    console.log("⚠️ USER_DATA_DIR does not exist!");
  }
  
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    executablePath: chromePath,
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  try {
    console.log("Navigating to ReadMe dashboard...");
    await page.goto("https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/landing", { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(5000);

    console.log("Current URL:", page.url());
    await page.screenshot({ path: path.join(process.cwd(), 'readme-landing.png') });
    console.log("Saved screenshot: readme-landing.png");

    if (page.url().includes('login') || page.url().includes('to/')) {
      console.log("❌ Playwright is not logged in to ReadMe on this profile.");
      
      // Let's list other pages or cookies
      const cookies = await context.cookies();
      console.log(`Found ${cookies.length} cookies.`);
      return;
    }

    // Attempt to navigate to API Key page
    console.log("Navigating to API Key settings...");
    await page.goto("https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/api-key", { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);
    
    await page.screenshot({ path: path.join(process.cwd(), 'readme-api-key.png') });
    console.log("Saved screenshot: readme-api-key.png");

    const content = await page.content();
    // Search for rdme_ in the content
    const match = content.match(/rdme_[a-zA-Z0-9_]+/g);
    if (match) {
      console.log("🔑 FOUND API KEYS:", match);
    } else {
      console.log("❌ No API key found on page. Let's try to extract inputs/code blocks.");
      const text = await page.evaluate(() => document.body.innerText);
      console.log("Page Text length:", text.length);
      fs.writeFileSync('readme-api-key-text.txt', text);
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await context.close();
  }
}

run();
