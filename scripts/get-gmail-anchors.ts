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
    
    // Let's get all anchor tags with their text content and href
    const anchors = await gmailPage.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => ({
        href: a.href,
        text: a.innerText.trim(),
        html: a.outerHTML
      }));
    });
    
    console.log(`Found ${anchors.length} anchors on Gmail page.`);
    const filtered = anchors.filter(a => 
      a.href.includes('readme') || 
      a.text.includes('Log') || 
      a.text.includes('Giriş') || 
      a.text.includes('Tıklayın') ||
      a.href.includes('click') ||
      a.href.includes('google.com/url')
    );
    console.log("Filtered anchors:", filtered);
  } else {
    console.log("⚠️ Gmail page not found.");
  }

  await browser.close();
}

run().catch(console.error);
