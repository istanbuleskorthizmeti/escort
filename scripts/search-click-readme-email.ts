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

    // 1. Navigate to search for ReadMe emails
    console.log("Searching Gmail for 'ReadMe'...");
    await gmailPage.goto("https://mail.google.com/mail/u/0/#search/ReadMe", { waitUntil: 'networkidle', timeout: 30000 });
    await gmailPage.waitForTimeout(6000);

    // 2. Click on the first search result row
    console.log("Clicking the first email row in search results...");
    const clicked = await gmailPage.evaluate(() => {
      // In Gmail search results, rows are typically <tr> elements with role="row" or contain email summaries
      const rows = Array.from(document.querySelectorAll('tr[role="row"]'));
      if (rows.length > 0) {
        // Click the first row (excluding header if any)
        const firstRow = rows[0];
        const clickTarget = firstRow.querySelector('span') || firstRow;
        (clickTarget as HTMLElement).click();
        return true;
      }
      // Fallback: check any element containing 'documentation login'
      const matches = Array.from(document.querySelectorAll('span, td'));
      const loginRow = matches.find(el => el.textContent && el.textContent.includes('documentation login link'));
      if (loginRow) {
        (loginRow as HTMLElement).click();
        return true;
      }
      return false;
    });

    console.log("Row click result:", clicked);
    await gmailPage.waitForTimeout(6000);

    // 3. Scrape email body content
    console.log("Scraping email body (.a3s)...");
    const emailData = await gmailPage.evaluate(() => {
      const bodies = Array.from(document.querySelectorAll('.a3s'));
      return bodies.map(b => ({
        text: b.innerText,
        html: b.innerHTML
      }));
    });

    console.log(`Found ${emailData.length} email bodies.`);
    let loginUrl = '';
    for (let i = 0; i < emailData.length; i++) {
      const text = emailData[i].text;
      console.log(`--- Email Body ${i} ---`);
      console.log(text.substring(0, 500));

      const htmlContent = emailData[i].html;
      // Extract links containing readme.com/to or dash.readme.com/to or customer-link
      const urls = htmlContent.match(/https?:\/\/[^\s"'<>]+/g) || [];
      const readmeLinks = Array.from(new Set(urls)).filter((url: string) => 
        url.includes('readme.com/to') || 
        url.includes('dash.readme.com') ||
        url.includes('readme.com/login')
      );
      
      console.log("Found ReadMe links:", readmeLinks);
      if (readmeLinks.length > 0) {
        loginUrl = readmeLinks[0];
        break;
      }
    }

    if (loginUrl) {
      // Decode html entities in the url if present
      loginUrl = loginUrl.replace(/&amp;/g, '&');
      console.log("🚀 LATEST LOGIN LINK FOUND:", loginUrl);

      // Now navigate to this login link using the same Gmail page context!
      // This will log the user's browser session directly into dash.readme.com!
      console.log("Navigating active tab to the login link...");
      await gmailPage.goto(loginUrl, { waitUntil: 'load', timeout: 45000 });
      await gmailPage.waitForTimeout(7000);
      console.log("Authentication complete! Current page URL is now:", gmailPage.url());
    } else {
      console.log("❌ Could not find login link in email body.");
    }
  } else {
    console.log("⚠️ Gmail page not found.");
  }

  await browser.close();
}

run().catch(console.error);
