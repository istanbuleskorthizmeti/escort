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
    console.log("Found Gmail tab. Clicking the latest ReadMe login link email...");

    // Click on the email row with subject "Here’s your documentation login link!"
    const clicked = await gmailPage.evaluate(() => {
      // Find rows in gmail
      const rows = Array.from(document.querySelectorAll('tr[role="row"]'));
      const readmeRow = rows.find(row => {
        const text = row.textContent || '';
        return text.includes('ReadMe') && text.includes('login link');
      });

      if (readmeRow) {
        // Click on the row's subject element or the row itself
        const clickTarget = readmeRow.querySelector('.y6') || readmeRow;
        (clickTarget as HTMLElement).click();
        return "Clicked email row!";
      }
      return "ReadMe login link email row not found!";
    });

    console.log("Email click action:", clicked);
    await gmailPage.waitForTimeout(5000);

    // Now extract all links in the email body
    const links = await gmailPage.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      return anchors
        .map(a => ({ text: a.textContent?.trim(), href: a.href }))
        .filter(link => link.href && link.href.includes('readme'));
    });

    console.log("Found links in email:", links);

    // Let's find the login link (usually it's a button or link with text containing 'Log In' or similar)
    const loginLink = links.find(l => l.href.includes('login') || l.href.includes('auth') || l.text?.toLowerCase().includes('log in') || l.text?.toLowerCase().includes('giriş'));
    
    if (loginLink) {
      console.log("🎯 Magic Login Link URL:", loginLink.href);
      
      // Let's open it in a new page to log in as admin!
      const adminPage = await context.newPage();
      console.log("Navigating to login link in new tab...");
      await adminPage.goto(loginLink.href, { waitUntil: 'load', timeout: 60000 });
      await adminPage.waitForTimeout(8000);
      console.log("Logged in! Current URL:", adminPage.url());
      await adminPage.screenshot({ path: 'readme-logged-in-admin.png' });
      await adminPage.close();
    } else {
      console.warn("Could not find direct magic login link in the list of links:", links);
    }

  } catch (err: any) {
    console.error("Error reading login email:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
