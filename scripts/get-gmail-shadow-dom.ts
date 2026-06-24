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

    // Extract all URLs using plain JS string to avoid compiler decorations
    const urls: string[] = await gmailPage.evaluate(`(() => {
      const foundUrls = [];
      function traverse(node) {
        if (!node) return;
        if (node.tagName === 'A' && node.href) {
          foundUrls.push(node.href);
        }
        if (node.shadowRoot) {
          traverse(node.shadowRoot);
        }
        if (node.childNodes) {
          for (let i = 0; i < node.childNodes.length; i++) {
            traverse(node.childNodes[i]);
          }
        }
      }
      traverse(document.body);
      return foundUrls;
    })()`);

    console.log(`Found ${urls.length} absolute URLs in DOM + Shadow DOMs.`);
    const readmeUrls = Array.from(new Set(urls)).filter(url => url.includes('readme'));
    console.log("Readme URLs:", readmeUrls);
  } else {
    console.log("⚠️ Gmail page not found.");
  }

  await browser.close();
}

run().catch(console.error);
