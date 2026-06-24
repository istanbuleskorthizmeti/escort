import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🚀 Launching authenticated browser session using scraped cookies...");
  if (!fs.existsSync('readme-cookies.json')) {
    console.error("❌ readme-cookies.json not found!");
    return;
  }

  const cookies = JSON.parse(fs.readFileSync('readme-cookies.json', 'utf8'));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addCookies(cookies);

  const page = await context.newPage();
  try {
    console.log("Navigating to ReadMe API key settings...");
    await page.goto("https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/api-key", { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(5000);

    const url = page.url();
    console.log("Current page URL:", url);
    await page.screenshot({ path: path.join(process.cwd(), 'readme-api-key-auth.png') });
    console.log("Saved screenshot: readme-api-key-auth.png");

    const content = await page.content();
    fs.writeFileSync('readme-api-key-page.html', content);

    // Look for api keys matching rdme_
    const keys = content.match(/rdme_[a-zA-Z0-9_]+/g);
    if (keys) {
      const uniqueKeys = Array.from(new Set(keys));
      console.log("🔑 FOUND API KEYS:", uniqueKeys);
    } else {
      console.log("❌ No rdme_ keys found. Let's inspect the page content.");
      const text = await page.evaluate(() => document.body.innerText);
      console.log("Page text snippet:", text.substring(0, 1000));
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await browser.close();
  }
}

run();
