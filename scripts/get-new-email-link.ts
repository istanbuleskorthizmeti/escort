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
    console.log("🎯 Found Gmail page. Navigating to inbox to refresh...");
    await gmailPage.goto("https://mail.google.com/mail/u/0/#inbox", { waitUntil: 'networkidle', timeout: 30000 });
    await gmailPage.waitForTimeout(5000);

    console.log("Searching for ReadMe email in list...");
    
    const clicked = await gmailPage.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr'));
      const readmeRow = rows.find(r => r.innerText.includes('ReadMe') || r.innerText.includes('documentation login link'));
      if (readmeRow) {
        // Find elements inside the row to click specifically, like the span with the text
        const clickTarget = readmeRow.querySelector('span') || readmeRow;
        (clickTarget as HTMLElement).click();
        return true;
      }
      return false;
    });

    console.log("Clicked email row:", clicked);
    await gmailPage.waitForTimeout(5000);

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

    const filtered = Array.from(new Set(urls)).filter(url => 
      url.includes('dash.readme.com/to/') || 
      url.includes('readme.com/to/')
    );

    console.log("Fresh ReadMe login links found:", filtered);
    if (filtered.length > 0) {
      console.log("🚀 LATEST LOGIN LINK FOUND:", filtered[0]);
    }
  } else {
    console.log("⚠️ Gmail page not found.");
  }

  await browser.close();
}

run().catch(console.error);
