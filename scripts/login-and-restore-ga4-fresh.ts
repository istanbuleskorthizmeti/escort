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
  
  // 1. Create action page
  const actionPage = await context.newPage();

  try {
    console.log("🧼 Logging out of current session on dash.readme.com...");
    await actionPage.goto('https://dash.readme.com/logout', { waitUntil: 'load', timeout: 30000 }).catch(() => {});
    await actionPage.waitForTimeout(4000);

    console.log("🔑 Navigating to ReadMe login page...");
    await actionPage.goto('https://dash.readme.com/login', { waitUntil: 'load', timeout: 30000 });
    await actionPage.waitForTimeout(5000);

    console.log("✍️ Entering admin email: info@dorukcanay.digital...");
    await actionPage.fill('input[type="email"], input[name="email"]', 'info@dorukcanay.digital');
    await actionPage.waitForTimeout(2000);

    console.log("💾 Submitting login request...");
    await actionPage.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) (btn as HTMLElement).click();
    });

    console.log("⏳ Waiting 25 seconds for magic link email to arrive in Gmail...");
    await actionPage.waitForTimeout(25000);

    // 2. Find or open Gmail page
    let gmailPage = pages.find(p => p.url().includes('mail.google.com'));
    if (!gmailPage) {
      console.log("⚠️ Gmail page not found in open tabs. Opening a new Gmail tab...");
      gmailPage = await context.newPage();
      await gmailPage.goto('https://mail.google.com/mail/u/0/#inbox', { waitUntil: 'load', timeout: 45000 });
      await gmailPage.waitForTimeout(8000);
    } else {
      console.log("📥 Reloading existing Gmail page...");
      await gmailPage.reload({ waitUntil: 'load', timeout: 45000 });
      await gmailPage.waitForTimeout(8000);
    }

    console.log("🔍 Locating the UNREAD ReadMe login email...");
    const emailClicked = await gmailPage.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr[role="row"]'));
      // Find rows that contain 'ReadMe' and 'login link'
      // Prioritize unread rows (class 'zE') over read rows (class 'yO')
      const readmeRows = rows.filter(row => {
        const text = row.textContent || '';
        return text.includes('ReadMe') && text.includes('login link');
      });

      // Find the first unread row
      let targetRow = readmeRows.find(row => row.classList.contains('zE'));
      
      // Fallback to the very first matching row if no unread row is found
      if (!targetRow && readmeRows.length > 0) {
        targetRow = readmeRows[0];
      }

      if (targetRow) {
        const clickTarget = targetRow.querySelector('.y6') || targetRow;
        (clickTarget as HTMLElement).click();
        return { success: true, isUnread: targetRow.classList.contains('zE') };
      }
      return { success: false };
    });

    console.log("Email click result:", emailClicked);

    if (!emailClicked || !emailClicked.success) {
      console.error("❌ Could not find the new ReadMe login email in Gmail!");
      await actionPage.close();
      return;
    }

    console.log("📬 Email clicked. Waiting 6 seconds for content to load...");
    await gmailPage.waitForTimeout(6000);

    // Extract links in the email body
    const links = await gmailPage.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      return anchors
        .map(a => ({ text: a.textContent?.trim(), href: a.href }))
        .filter(link => link.href && link.href.includes('readme'));
    });

    console.log("🔗 Found links in email:", links);

    // Find the login link URL
    const loginLink = links.find(l => l.href.includes('sign') || l.href.includes('login') || l.href.includes('auth'));
    
    if (!loginLink) {
      console.error("❌ Magic login link not found in email body!");
      await actionPage.close();
      return;
    }

    console.log(`🎯 Navigating action page to magic link: ${loginLink.href}`);
    await actionPage.goto(loginLink.href, { waitUntil: 'load', timeout: 60000 });
    await actionPage.waitForTimeout(10000);

    console.log(`📍 Logged in! Current URL: ${actionPage.url()}`);

    // 3. Navigate to integrations
    const integrationsUrl = 'https://dash.readme.com/project/istanbul-escort/v1.0/integrations';
    console.log(`🚀 Navigating to integrations: ${integrationsUrl}`);
    await actionPage.goto(integrationsUrl, { waitUntil: 'load', timeout: 45000 });
    await actionPage.waitForTimeout(8000);

    const checkUrl = actionPage.url();
    console.log(`📍 Landed on: ${checkUrl}`);

    if (checkUrl.includes('login') || checkUrl.includes('/to/')) {
      console.error("❌ Redirected to login again. Authentication failed!");
      await actionPage.screenshot({ path: path.join(process.cwd(), 'readme-login-failed-screenshot.png') });
      await actionPage.close();
      return;
    }

    // Check selectors
    const gaSelector = await actionPage.evaluate(() => {
      const inputName = document.querySelector('input[name="integrations.google.analytics"]');
      if (inputName) return 'input[name="integrations.google.analytics"]';
      const idGa = document.getElementById('google_analytics');
      if (idGa) return '#google_analytics';
      return null;
    });

    if (!gaSelector) {
      console.error("❌ GA input selector not found on integrations page!");
      await actionPage.screenshot({ path: path.join(process.cwd(), 'readme-ga-not-found.png') });
      await actionPage.close();
      return;
    }

    const gaId = "G-TJ3T8823ZP"; // original GA4 ID for istanbul-escort
    console.log(`✍️ Restoring GA4 ID to: ${gaId}`);
    await actionPage.fill(gaSelector, gaId);
    await actionPage.evaluate((sel: string) => {
      const el = document.querySelector(sel) as HTMLInputElement;
      if (el) {
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, gaSelector);

    await actionPage.waitForTimeout(2000);

    console.log("💾 Saving changes...");
    const clickedSave = await actionPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], [role="button"]'));
      const saveButton = buttons.find(b => {
        const text = b.textContent?.trim() || '';
        return /Save|Update|Kaydet|Save Changes|Gönder/i.test(text);
      });
      if (saveButton) {
        (saveButton as HTMLElement).click();
        return { success: true, text: saveButton.textContent?.trim() };
      }
      return { success: false };
    });

    console.log("Save click result:", clickedSave);
    await actionPage.waitForTimeout(6000);

    const finalVal = await actionPage.$eval(gaSelector, (el: any) => el.value);
    console.log(`✅ GA ID is now set to: ${finalVal}`);

    await actionPage.screenshot({ path: path.join(process.cwd(), 'readme-istanbul-escort-ga-restored.png') });
    console.log("📸 Saved verification screenshot: readme-istanbul-escort-ga-restored.png");

  } catch (err: any) {
    console.error("❌ Error during flow:", err.message);
  } finally {
    await actionPage.close();
  }
}

run().catch(console.error);
