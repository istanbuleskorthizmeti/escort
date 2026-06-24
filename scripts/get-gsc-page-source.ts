import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

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
  
  const gscPage = pages.find(p => p.url().includes('search.google.com/search-console'));
  if (!gscPage) {
    console.error("❌ GSC page not found!");
    await browser.close();
    return;
  }

  try {
    console.log("Reading full body HTML of GSC page...");
    const html = await gscPage.content();
    
    // Save to a file for analysis
    fs.writeFileSync('gsc-page-source.html', html, 'utf8');
    console.log("Saved page source to gsc-page-source.html");

    // Search for google-site-verification strings
    const regex = /google-site-verification[^<\n]*/gi;
    const matches = html.match(regex);
    console.log("Matches found:", matches);

  } catch (err: any) {
    console.error("Error reading GSC html:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
