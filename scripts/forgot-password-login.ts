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
  
  const actionPage = await context.newPage();

  try {
    console.log("🧼 Logging out first...");
    await actionPage.goto('https://dash.readme.com/logout', { waitUntil: 'load', timeout: 30000 }).catch(() => {});
    await actionPage.waitForTimeout(3000);

    console.log("🔑 Navigating to login page...");
    await actionPage.goto('https://dash.readme.com/login', { waitUntil: 'load', timeout: 30000 });
    await actionPage.waitForTimeout(5000);

    console.log("🔗 Clicking 'Forgot your password?'...");
    const clickedForgot = await actionPage.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const forgotLink = links.find(l => l.textContent?.includes('Forgot') || l.href.includes('forgot') || l.href.includes('password'));
      if (forgotLink) {
        forgotLink.click();
        return { success: true, href: forgotLink.href };
      }
      return { success: false };
    });

    console.log("Forgot link click result:", clickedForgot);
    await actionPage.waitForTimeout(5000);
    console.log(`📍 Current URL after click: ${actionPage.url()}`);

    console.log("✍️ Entering email: info@dorukcanay.digital...");
    await actionPage.waitForSelector('input[type="email"], input[name="email"]', { timeout: 15000 });
    await actionPage.fill('input[type="email"], input[name="email"]', 'info@dorukcanay.digital');
    await actionPage.waitForTimeout(1000);

    console.log("💾 Submitting forgot password request...");
    await actionPage.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) (btn as HTMLElement).click();
    });

    console.log("⏳ Waiting 25 seconds for the reset email to arrive in Gmail...");
    await actionPage.waitForTimeout(25000);

    // 2. Open Gmail and search for ReadMe emails
    let gmailPage = pages.find(p => p.url().includes('mail.google.com'));
    if (!gmailPage) {
      console.log("⚠️ Gmail page not found in open tabs. Opening a new Gmail tab...");
      gmailPage = await context.newPage();
    }
    
    let emailClicked = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      console.log(`🔍 Searching Gmail (Attempt ${attempt}/5)...`);
      await gmailPage.goto('https://mail.google.com/mail/u/0/#search/in%3Aanywhere+ReadMe', { waitUntil: 'load', timeout: 45000 });
      await gmailPage.waitForTimeout(8000);

      emailClicked = await gmailPage.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('tr[role="row"]'));
        // Find rows containing 'ReadMe' and ('reset' or 'password' or 'login')
        const readmeRows = rows.filter(row => {
          const text = row.textContent || '';
          return text.includes('ReadMe') && (text.includes('password') || text.includes('reset') || text.includes('link'));
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
        console.log("✅ New unread email found and clicked!");
        break;
      }
      console.log("⚠️ No new unread ReadMe email found yet. Waiting 6 seconds...");
      await gmailPage.waitForTimeout(6000);
    }

    if (!emailClicked) {
      console.log("⚠️ Falling back to the latest email in search results...");
      emailClicked = await gmailPage.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('tr[role="row"]'));
        const readmeRow = rows.find(row => {
          const text = row.textContent || '';
          return text.includes('ReadMe') && (text.includes('password') || text.includes('reset') || text.includes('link'));
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
      console.error("❌ Could not find any ReadMe password reset/login email in Gmail!");
      await actionPage.close();
      return;
    }

    console.log("📬 Email opened. Waiting 6 seconds for content to load...");
    await gmailPage.waitForTimeout(6000);

    // Extract links in the email body
    const links = await gmailPage.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      return anchors
        .map(a => ({ text: a.textContent?.trim(), href: a.href }))
        .filter(link => link.href && link.href.includes('readme'));
    });

    console.log("🔗 Found links in email:", links);

    // Find the reset/login URL
    const loginLink = [...links].reverse().find(l => l.href.includes('sign') || l.href.includes('login') || l.href.includes('auth') || l.href.includes('password'));
    
    if (!loginLink) {
      console.error("❌ Reset/login link not found in email body!");
      await actionPage.close();
      return;
    }

    console.log(`🎯 Navigating action page to login link: ${loginLink.href}`);
    await actionPage.goto(loginLink.href, { waitUntil: 'load', timeout: 60000 });
    await actionPage.waitForTimeout(10000);

    console.log(`📍 Logged in successfully! Current URL: ${actionPage.url()}`);

    // 3. Update GA4 ID on istanbul-escort project
    const integrationsUrl = 'https://dash.readme.com/project/istanbul-escort/v1.0/integrations';
    console.log(`🚀 Navigating to integrations: ${integrationsUrl}`);
    await actionPage.goto(integrationsUrl, { waitUntil: 'load', timeout: 45000 });
    await actionPage.waitForTimeout(8000);

    const checkUrl = actionPage.url();
    console.log(`📍 Landed URL: ${checkUrl}`);

    if (checkUrl.includes('login') || checkUrl.includes('/to/')) {
      console.error("❌ Redirected back to login page. Auth failed!");
      await actionPage.screenshot({ path: path.join(process.cwd(), 'readme-forgot-login-failed.png') });
      await actionPage.close();
      return;
    }

    const gaSelector = await actionPage.evaluate(() => {
      const inputName = document.querySelector('input[name="integrations.google.analytics"]');
      if (inputName) return 'input[name="integrations.google.analytics"]';
      const idGa = document.getElementById('google_analytics');
      if (idGa) return '#google_analytics';
      return null;
    });

    if (!gaSelector) {
      console.error("❌ GA input field not found on integrations page!");
      await actionPage.screenshot({ path: path.join(process.cwd(), 'readme-forgot-ga-not-found.png') });
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
    console.log(`✅ GA ID successfully restored to: ${finalVal}`);

    await actionPage.screenshot({ path: path.join(process.cwd(), 'readme-istanbul-escort-ga-restored.png') });
    console.log("📸 Saved verification screenshot: readme-istanbul-escort-ga-restored.png");

  } catch (err: any) {
    console.error("❌ Error during flow:", err.message);
  } finally {
    await actionPage.close();
  }
}

run().catch(console.error);
