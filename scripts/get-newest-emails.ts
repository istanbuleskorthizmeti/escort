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
  
  let gmailPage = pages.find(p => p.url().includes('mail.google.com'));
  if (!gmailPage) {
    gmailPage = await context.newPage();
  }

  try {
    console.log("🔍 Searching Gmail for 'ReadMe' in all folders...");
    await gmailPage.goto('https://mail.google.com/mail/u/0/#search/in%3Aanywhere+ReadMe', { waitUntil: 'load', timeout: 45000 });
    await gmailPage.waitForTimeout(8000);

    const emailList = await gmailPage.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr[role="row"]'));
      return rows.slice(0, 5).map((row, index) => {
        const text = row.textContent || '';
        const isUnread = row.classList.contains('zE');
        const dateElement = row.querySelector('.xW');
        const dateText = dateElement ? dateElement.textContent?.trim() : '';
        return {
          index,
          isUnread,
          date: dateText,
          snippet: text.replace(/\s+/g, ' ').substring(0, 150)
        };
      });
    });

    console.log("📋 Top 5 ReadMe emails in Gmail:");
    console.log(JSON.stringify(emailList, null, 2));

  } catch (err: any) {
    console.error("❌ Error:", err.message);
  } finally {
    await gmailPage.close();
  }
}

run().catch(console.error);
