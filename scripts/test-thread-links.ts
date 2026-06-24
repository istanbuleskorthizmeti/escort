import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

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
  const gmailPage = pages.find(p => p.url().includes('mail.google.com'));

  if (!gmailPage) {
    console.error("❌ Gmail page not found!");
    await browser.close();
    return;
  }

  try {
    console.log("Extracting all magic links in Gmail DOM (including collapsed/hidden)...");

    const links = await gmailPage.evaluate(() => {
      // Find all anchors on the page
      const anchors = Array.from(document.querySelectorAll('a'));
      return anchors
        .map(a => a.href)
        .filter(href => href && href.includes('dash.readme.com/sign'));
    });

    console.log("All matching links found in DOM:", links);
    const uniqueLinks = Array.from(new Set(links));
    console.log("Unique links:", uniqueLinks);

    if (uniqueLinks.length > 0) {
      // The last one is the most recent message in the thread!
      const newestLink = uniqueLinks[uniqueLinks.length - 1];
      console.log("🎯 Potential Newest Magic Link:", newestLink);
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
