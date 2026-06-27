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
    console.log("Found Gmail tab. Searching for 'token'...");
    
    await gmailPage.goto("https://mail.google.com/mail/u/0/#search/token", { waitUntil: 'networkidle' });
    await gmailPage.waitForTimeout(5000);

    const emailList = await gmailPage.evaluate(() => {
      const emails = Array.from(document.querySelectorAll('tr[role="row"]')).map(row => {
        const sender = row.querySelector('.yW')?.textContent?.trim() || '';
        const subject = row.querySelector('.y6')?.textContent?.trim() || '';
        const date = row.querySelector('.xW')?.textContent?.trim() || '';
        return { sender, subject, date };
      });
      return emails.slice(0, 10);
    });

    console.log("Token Search Results in Gmail:", emailList);

  } catch (err: any) {
    console.error("Error searching Gmail:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
