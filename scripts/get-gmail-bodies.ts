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

    // Wait for a few seconds to let content settle
    await gmailPage.waitForTimeout(3000);

    // Let's scrape the email bodies if open
    const emailData = await gmailPage.evaluate(() => {
      // Gmail body container is .a3s
      const bodies = Array.from(document.querySelectorAll('.a3s'));
      return bodies.map(b => ({
        text: b.innerText,
        html: b.innerHTML
      }));
    });

    console.log(`Found ${emailData.length} email bodies in the page.`);
    for (let i = 0; i < emailData.length; i++) {
      console.log(`\n--- Body ${i} text ---`);
      console.log(emailData[i].text.substring(0, 1000));
      
      // Parse links inside HTML
      const htmlContent = emailData[i].html;
      const urls = htmlContent.match(/https?:\/\/[^\s"'<>]+/g) || [];
      console.log("URLs found in body:", Array.from(new Set(urls)));
    }
  } else {
    console.log("⚠️ Gmail page not found.");
  }

  await browser.close();
}

run().catch(console.error);
