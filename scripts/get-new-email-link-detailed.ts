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

    const frames = gmailPage.frames();
    console.log(`Found ${frames.length} frames.`);

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      try {
        const html = await frame.content();
        if (html.includes('readme') || html.includes('dash.readme') || html.includes('login') || html.includes('code')) {
          console.log(`\n--- Frame ${i} URLs ---`);
          // Extract all hrefs using evaluate to be robust
          const hrefs: string[] = await frame.evaluate(() => {
            return Array.from(document.querySelectorAll('a')).map(a => a.href);
          });
          
          const filtered = hrefs.filter(h => 
            !h.includes('google.com') && 
            !h.includes('gstatic.com') && 
            h.length > 0
          );
          console.log(filtered);
        }
      } catch (e: any) {
        console.log(`Could not read Frame ${i}: ${e.message}`);
      }
    }
  } else {
    console.log("⚠️ Gmail page not found.");
  }

  await browser.close();
}

run().catch(console.error);
