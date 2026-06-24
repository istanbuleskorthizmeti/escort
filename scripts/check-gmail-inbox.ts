import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

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
    console.log("Found Gmail tab. Refreshing inbox...");
    // Just click the Inbox button or wait a bit
    await gmailPage.waitForTimeout(5000);

    const emailList = await gmailPage.evaluate(() => {
      // Find email subject lines and senders
      const emails = Array.from(document.querySelectorAll('tr[role="row"]')).map(row => {
        const sender = row.querySelector('.yW')?.textContent?.trim() || '';
        const subject = row.querySelector('.y6')?.textContent?.trim() || '';
        const date = row.querySelector('.xW')?.textContent?.trim() || '';
        return { sender, subject, date };
      });
      return {
        url: window.location.href,
        emails: emails.slice(0, 10)
      };
    });

    console.log("Gmail Inbox:", emailList);
    await gmailPage.screenshot({ path: path.join(process.cwd(), 'gmail-inbox.png') });
    console.log("Screenshot saved: gmail-inbox.png");

  } catch (err: any) {
    console.error("Error checking Gmail:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
