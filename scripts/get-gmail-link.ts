import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  let gmailPage: any = null;
  for (const ctx of contexts) {
    const pages = ctx.pages();
    for (const p of pages) {
      if (p.url().includes('mail.google.com')) {
        gmailPage = p;
        break;
      }
    }
  }

  if (gmailPage) {
    console.log("🎯 Found Gmail page:", gmailPage.url());
    // Get text content and look for ReadMe login links
    const links = await gmailPage.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      return anchors
        .map(a => a.href)
        .filter(href => href.includes('dash.readme.com/to/') || href.includes('dash.readme.com/login/'));
    });
    console.log("Found ReadMe links in Gmail page:", links);

    if (links.length > 0) {
      const targetLink = links[0];
      console.log("🚀 Latest login link found:", targetLink);
      
      // Let's launch a new context or navigate their active tab to this login link to log them in!
      console.log("Navigating to login link to authenticate session...");
      const loginContext = await browser.newContext();
      const testPage = await loginContext.newPage();
      await testPage.goto(targetLink, { waitUntil: 'load', timeout: 30000 });
      await testPage.waitForTimeout(5000);
      console.log("Final URL after login:", testPage.url());
      await testPage.screenshot({ path: path.join(process.cwd(), 'readme-after-login-test.png') });
      console.log("Saved readme-after-login-test.png");
      await loginContext.close();
    } else {
      // Let's print the page text or take a screenshot to debug
      console.log("No links found. Taking screenshot of Gmail...");
      await gmailPage.screenshot({ path: path.join(process.cwd(), 'gmail-debug.png') });
      console.log("Saved gmail-debug.png");
    }
  } else {
    console.log("⚠️ Gmail page not found.");
  }

  await browser.close();
}

run().catch(console.error);
