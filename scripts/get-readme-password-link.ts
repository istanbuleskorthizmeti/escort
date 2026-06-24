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
    console.log("Navigating to Gmail inbox...");
    await gmailPage.goto('https://mail.google.com/mail/u/0/#inbox', { waitUntil: 'load', timeout: 30000 });
    await gmailPage.waitForSelector('tr[role="row"]', { timeout: 30000 });
    await gmailPage.waitForTimeout(3000);

    // Find and click the "Create Your password" email
    console.log("Clicking 'Create Your password' email...");
    const clicked = await gmailPage.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr[role="row"]'));
      const row = rows.find(r => r.textContent?.includes('Create Your password'));
      if (row) {
        const clickTarget = row.querySelector('.y6') || row;
        (clickTarget as HTMLElement).click();
        return true;
      }
      return false;
    });

    if (!clicked) {
      console.error("❌ 'Create Your password' email not found!");
      await browser.close();
      return;
    }

    await gmailPage.waitForTimeout(5000);

    // Extract links
    const links = await gmailPage.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      return anchors
        .map(a => ({ text: a.textContent?.trim(), href: a.href }))
        .filter(l => l.href && l.href.includes('readme'));
    });

    console.log("Found links in password email:", links);

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
