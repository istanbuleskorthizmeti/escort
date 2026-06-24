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

    // Navigate to label:anywhere search
    console.log("Searching Gmail anywhere for 'readme'...");
    await gmailPage.goto("https://mail.google.com/mail/u/0/#search/label%3Aanywhere+readme", { waitUntil: 'networkidle', timeout: 30000 });
    await gmailPage.waitForTimeout(6000);

    // Click the first search result row
    console.log("Clicking the first email row in search results...");
    const clicked = await gmailPage.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr[role="row"]'));
      if (rows.length > 0) {
        const firstRow = rows[0];
        const clickTarget = firstRow.querySelector('span') || firstRow;
        (clickTarget as HTMLElement).click();
        return true;
      }
      return false;
    });

    console.log("Row click result:", clicked);
    await gmailPage.waitForTimeout(6000);

    // Get all frame HTML and text content
    const mainHtml = await gmailPage.content();
    const urls = mainHtml.match(/https?:\/\/[^\s"'<>]+/g) || [];
    const readmeLinks = Array.from(new Set(urls)).filter((url: string) => 
      url.includes('readme.com/to/') || 
      url.includes('dash.readme.com') ||
      url.includes('readme.com/login')
    );

    console.log("Found ReadMe links in page HTML:", readmeLinks);
  } else {
    console.log("⚠️ Gmail page not found.");
  }

  await browser.close();
}

run().catch(console.error);
