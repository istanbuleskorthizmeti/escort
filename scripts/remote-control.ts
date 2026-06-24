import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  console.log(`Connected! Found ${contexts.length} contexts.`);

  let readmePage: any = null;
  let gscPage: any = null;

  for (const ctx of contexts) {
    const pages = ctx.pages();
    console.log(`Context has ${pages.length} pages:`);
    for (const p of pages) {
      const url = p.url();
      console.log(` - ${url}`);
      if (url.includes('dash.readme.com')) {
        readmePage = p;
      }
      if (url.includes('search.google.com/search-console')) {
        gscPage = p;
      }
    }
  }

  // 1. Scraping ReadMe API Key
  if (readmePage) {
    console.log("🎯 Found ReadMe page. Navigating to API Key settings...");
    try {
      await readmePage.goto("https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/api-key", { waitUntil: 'load', timeout: 30000 });
      await readmePage.waitForTimeout(5000);
      const content = await readmePage.content();
      const keys = content.match(/rdme_[a-zA-Z0-9_]+/g);
      if (keys) {
        console.log("🔑 FOUND API KEYS via CDP:", keys);
        // Write the first API key to env file or print it
        const uniqueKeys = Array.from(new Set(keys));
        console.log("Unique Keys:", uniqueKeys);
      } else {
        console.log("❌ No API keys found in text.");
      }
    } catch (e: any) {
      console.log("⚠️ Error scraping ReadMe keys:", e.message);
    }
  } else {
    console.log("⚠️ ReadMe page not found in open tabs.");
  }

  // 2. Making the project Public in ReadMe
  if (readmePage) {
    console.log("🎯 Attempting to make ReadMe project Public...");
    try {
      await readmePage.goto("https://dash.readme.com/project/istanbul-eskort-hizmeti/v1.0/general", { waitUntil: 'load', timeout: 30000 });
      await readmePage.waitForTimeout(5000);
      await readmePage.screenshot({ path: path.join(process.cwd(), 'readme-general-settings.png') });
      console.log("Saved readme-general-settings.png");
    } catch (e: any) {
      console.log("⚠️ Error accessing general settings:", e.message);
    }
  }

  // 3. Triggering GSC Verification
  if (gscPage) {
    console.log("🎯 Found GSC page. Attempting verification...");
    try {
      // Let's go to the specific resource URL for istanbul-eskort-hizmeti
      const gscUrl = `https://search.google.com/search-console/users?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F`;
      console.log(`Navigating GSC tab to: ${gscUrl}`);
      await gscPage.goto(gscUrl, { waitUntil: 'load', timeout: 30000 });
      await gscPage.waitForTimeout(5000);
      await gscPage.screenshot({ path: path.join(process.cwd(), 'gsc-before-verify.png') });
      console.log("Saved gsc-before-verify.png");
    } catch (e: any) {
      console.log("⚠️ Error during GSC verification:", e.message);
    }
  } else {
    console.log("⚠️ GSC page not found in open tabs.");
  }

  console.log("🔌 Disconnecting from Chrome...");
}

run().catch(console.error);
