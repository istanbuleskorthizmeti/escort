import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
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

    // Get all text of the page
    const text = await gmailPage.evaluate(() => document.body.innerText);
    fs.writeFileSync('gmail-text-dump.txt', text);
    console.log("Saved page text dump to gmail-text-dump.txt! Text length:", text.length);

    // Let's look for readme references in the text dump
    const matches = text.match(/https?:\/\/[^\s"']+/g) || [];
    const readmeLinks = Array.from(new Set(matches)).filter((url: string) => 
      url.includes('readme')
    );
    console.log("Readme links in text:", readmeLinks);
  } else {
    console.log("⚠️ Gmail page not found.");
  }

  await browser.close();
}

run().catch(console.error);
