import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

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
    
    // Dump all text and HTML sources of the page and check for readme
    const rawHtml = await gmailPage.content();
    console.log("Main frame HTML length:", rawHtml.length);
    
    // Regex search for readme.com/to or dash.readme.com
    const matches = rawHtml.match(/https?:\/\/[^\s"'<>]+/g) || [];
    const filtered = Array.from(new Set(matches)).filter((url: string) => 
      url.includes('readme')
    );
    
    console.log("Found URLs matching readme:", filtered);
  } else {
    console.log("⚠️ Gmail page not found.");
  }

  await browser.close();
}

run().catch(console.error);
