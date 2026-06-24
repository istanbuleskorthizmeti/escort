import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

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
    
    // Let's list all frames
    const frames = gmailPage.frames();
    console.log(`Found ${frames.length} frames.`);

    let allLinks: string[] = [];

    // Extract links from main frame
    try {
      const mainLinks = await gmailPage.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(a => a.href);
      });
      allLinks.push(...mainLinks);
    } catch (e) {}

    // Extract links from all sub-frames
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      try {
        const frameLinks = await frame.evaluate(() => {
          return Array.from(document.querySelectorAll('a')).map(a => a.href);
        });
        allLinks.push(...frameLinks);
      } catch (e) {}
    }

    const filtered = Array.from(new Set(allLinks)).filter(href => 
      href.includes('dash.readme.com') || 
      href.includes('readme.com/to/') ||
      href.includes('readme.com/login/')
    );

    console.log("All matching links found:", filtered);
    if (filtered.length > 0) {
      console.log("🚀 LATEST LOGIN LINK:", filtered[0]);
    }
  } else {
    console.log("⚠️ Gmail page not found.");
  }

  await browser.close();
}

run().catch(console.error);
