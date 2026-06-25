import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const contexts = browser.contexts();
  
  if (contexts.length === 0) {
    console.error("❌ No contexts found!");
    return;
  }

  const context = contexts[0];
  const pages = context.pages();
  
  // Create a page to request the login link
  const requestPage = await context.newPage();

  try {
    console.log("Logging out of current session first...");
    await requestPage.goto('https://dash.readme.com/logout', { waitUntil: 'load', timeout: 30000 }).catch(() => {});
    await requestPage.waitForTimeout(3000);

    console.log("Navigating to ReadMe dash login page...");
    await requestPage.goto('https://dash.readme.com/login', { waitUntil: 'load', timeout: 30000 });
    await requestPage.waitForTimeout(5000);


    console.log("Entering admin email: info@dorukcanay.digital...");
    // Find email input and enter email
    await requestPage.waitForSelector('input[type="email"], input[name="email"]', { timeout: 30000 });
    await requestPage.fill('input[type="email"], input[name="email"]', 'info@dorukcanay.digital');
    await requestPage.waitForTimeout(1000);

    console.log("Submitting login form...");
    // Click submit/next button
    await requestPage.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) (btn as HTMLElement).click();
    });

    await requestPage.waitForTimeout(15000); // Wait for the email to arrive
    console.log("Email requested! Checking Gmail...");

    // Now switch to or open Gmail page and search for 'ReadMe'
    let gmailPage = pages.find(p => p.url().includes('mail.google.com'));
    if (!gmailPage) {
      console.log("⚠️ Gmail page not found in open tabs. Opening a new Gmail tab...");
      gmailPage = await context.newPage();
    }
    console.log("🔍 Searching Gmail for 'ReadMe'...");
    await gmailPage.goto('https://mail.google.com/mail/u/0/#search/ReadMe', { waitUntil: 'load', timeout: 45000 });
    await gmailPage.waitForTimeout(8000);

    // Find and click the latest email from ReadMe (prioritize unread rows with class zE)
    let emailClicked = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      console.log(`🔍 Checking Gmail search results (Attempt ${attempt}/5)...`);
      if (attempt > 1) {
        await gmailPage.goto('https://mail.google.com/mail/u/0/#search/ReadMe', { waitUntil: 'load', timeout: 45000 });
        await gmailPage.waitForTimeout(6000);
      }

      emailClicked = await gmailPage.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('tr[role="row"]'));
        const readmeRows = rows.filter(row => {
          const text = row.textContent || '';
          return text.includes('ReadMe') && text.includes('login link');
        });

        const unreadRow = readmeRows.find(row => row.classList.contains('zE'));
        if (unreadRow) {
          const clickTarget = unreadRow.querySelector('.y6') || unreadRow;
          (clickTarget as HTMLElement).click();
          return true;
        }
        return false;
      });

      if (emailClicked) {
        console.log("✅ Found and clicked new unread ReadMe email!");
        break;
      }
      console.log("⚠️ No new unread ReadMe email found yet. Waiting 6 seconds...");
      await gmailPage.waitForTimeout(6000);
    }

    if (!emailClicked) {
      console.log("⚠️ No unread ReadMe email found. Falling back to the latest email in search results...");
      emailClicked = await gmailPage.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('tr[role="row"]'));
        const readmeRow = rows.find(row => {
          const text = row.textContent || '';
          return text.includes('ReadMe') && text.includes('login link');
        });
        if (readmeRow) {
          const clickTarget = readmeRow.querySelector('.y6') || readmeRow;
          (clickTarget as HTMLElement).click();
          return true;
        }
        return false;
      });
    }

    if (!emailClicked) {
      console.error("❌ Could not find any ReadMe login email in Gmail!");
      await requestPage.close();
      return;
    }

    console.log("Email clicked. Waiting for content to load...");
    await gmailPage.waitForTimeout(5000);

    // Extract all links in the email body
    const links = await gmailPage.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      return anchors
        .map(a => ({ text: a.textContent?.trim(), href: a.href }))
        .filter(link => link.href && link.href.includes('readme'));
    });

    console.log("Found links in email:", links);

    // Locate the latest magic login URL (last in the thread)
    const loginLink = [...links].reverse().find(l => l.href.includes('sign') || l.href.includes('login') || l.href.includes('auth'));
    
    if (loginLink) {
      console.log("🎯 Fresh Magic Login Link:", loginLink.href);
      
      // Navigate requestPage to it
      console.log("Navigating to fresh login link...");
      await requestPage.goto(loginLink.href, { waitUntil: 'load', timeout: 60000 });
      await requestPage.waitForTimeout(10000);

      console.log("Logged in! Current URL:", requestPage.url());
      await requestPage.screenshot({ path: path.join(process.cwd(), 'readme-logged-in-fresh.png') });
    } else {
      console.error("❌ Magic login link not found in email body!");
    }

  } catch (err: any) {
    console.error("Error during request-new-readme-login:", err.message);
  } finally {
    await requestPage.close();
  }
}

run().catch(console.error);
