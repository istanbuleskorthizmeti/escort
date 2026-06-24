import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const cdpBrowser = await chromium.connectOverCDP('http://localhost:9222');
  const cdpContexts = cdpBrowser.contexts();
  
  if (cdpContexts.length === 0) {
    console.error("❌ No CDP contexts found!");
    return;
  }

  const cdpContext = cdpContexts[0];
  
  // 1. Create a clean context in Chrome
  console.log("🚀 Creating clean isolated context...");
  const cleanContext = await cdpBrowser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const cleanPage = await cleanContext.newPage();

  try {
    console.log("🔑 Navigating clean page to project landing page...");
    await cleanPage.goto('https://dash.readme.com/to/istanbul-escort', { waitUntil: 'load', timeout: 30000 });
    await cleanPage.waitForTimeout(5000);

    console.log("✍️ Entering email: info@dorukcanay.digital...");
    await cleanPage.fill('input[type="email"], input[name="email"]', 'info@dorukcanay.digital');
    await cleanPage.waitForTimeout(1000);

    console.log("💾 Clicking 'Send Login Link'...");
    await cleanPage.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) (btn as HTMLElement).click();
    });

    console.log("⏳ Waiting 25 seconds for the magic link email to arrive in Gmail...");
    await cleanPage.waitForTimeout(25000);

    // 2. Open Gmail in the default CDP context to extract the link
    console.log("📬 Opening Gmail to extract magic link...");
    const gmailPage = await cdpContext.newPage();
    
    let emailClicked = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      console.log(`🔍 Searching Gmail (Attempt ${attempt}/5)...`);
      await gmailPage.goto('https://mail.google.com/mail/u/0/#search/in%3Aanywhere+ReadMe', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
      await gmailPage.waitForTimeout(10000);

      emailClicked = await gmailPage.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('tr[role="row"]'));
        const readmeRows = rows.filter(row => {
          const text = row.textContent || '';
          return text.includes('ReadMe') && (text.includes('login link') || text.includes('Here’s your documentation'));
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
      console.log("⚠️ No new unread login email found yet. Waiting 6 seconds...");
      await gmailPage.waitForTimeout(6000);
    }

    if (!emailClicked) {
      console.log("⚠️ Falling back to the latest email in search results...");
      emailClicked = await gmailPage.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('tr[role="row"]'));
        const readmeRow = rows.find(row => {
          const text = row.textContent || '';
          return text.includes('ReadMe') && (text.includes('login link') || text.includes('Here’s your documentation'));
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
      await gmailPage.close();
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
    await gmailPage.close();

    const loginLink = [...links].reverse().find(l => l.href.includes('sign') || l.href.includes('login') || l.href.includes('auth'));
    if (!loginLink) {
      console.error("❌ Magic login link not found in email!");
      return;
    }

    const magicUrl = loginLink.href;
    console.log(`🎯 Navigating clean page to magic link: ${magicUrl}`);
    await cleanPage.goto(magicUrl, { waitUntil: 'load', timeout: 60000 });
    await cleanPage.waitForTimeout(10000);

    console.log(`📍 Logged in successfully! Current URL: ${cleanPage.url()}`);

    // 3. Update GA4 ID on istanbul-escort project
    const integrationsUrl = 'https://istanbul-escort.readme.io/docs/getting-started#/settings/integrations';
    console.log(`🚀 Navigating to integrations page: ${integrationsUrl}`);
    await cleanPage.goto(integrationsUrl, { waitUntil: 'load', timeout: 45000 }).catch(async () => {
      const fallbackUrl = 'https://istanbul-escort.readme.io/docs/istanbul-besiktas-escort#/settings/integrations';
      console.log(`Retrying with fallback url: ${fallbackUrl}`);
      await cleanPage.goto(fallbackUrl, { waitUntil: 'load', timeout: 45000 });
    });
    await cleanPage.waitForTimeout(10000);

    const checkUrl = cleanPage.url();
    console.log(`📍 Landed URL: ${checkUrl}`);

    if (checkUrl.includes('login') || checkUrl.includes('/to/')) {
      console.error("❌ Redirected back to login page. Auth failed!");
      await cleanPage.screenshot({ path: path.join(process.cwd(), 'readme-magic-login-failed.png') });
      return;
    }

    const gaSelector = await cleanPage.evaluate(() => {
      const inputName = document.querySelector('input[name="integrations.google.analytics"]');
      if (inputName) return 'input[name="integrations.google.analytics"]';
      const idGa = document.getElementById('google_analytics');
      if (idGa) return '#google_analytics';
      return null;
    });

    if (!gaSelector) {
      console.error("❌ GA input field not found on integrations page!");
      await cleanPage.screenshot({ path: path.join(process.cwd(), 'readme-magic-ga-not-found.png') });
      return;
    }

    const gaId = "G-TJ3T8823ZP"; // original GA4 ID for istanbul-escort
    console.log(`✍️ Restoring GA4 ID to: ${gaId}`);
    await cleanPage.fill(gaSelector, gaId);
    await cleanPage.evaluate((sel: string) => {
      const el = document.querySelector(sel) as HTMLInputElement;
      if (el) {
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, gaSelector);

    await cleanPage.waitForTimeout(2000);

    console.log("💾 Saving changes...");
    const clickedSave = await cleanPage.evaluate(() => {
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
    await cleanPage.waitForTimeout(6000);

    const finalVal = await cleanPage.$eval(gaSelector, (el: any) => el.value);
    console.log(`✅ GA ID successfully restored to: ${finalVal}`);

    await cleanPage.screenshot({ path: path.join(process.cwd(), 'readme-istanbul-escort-ga-restored.png') });
    console.log("📸 Saved verification screenshot: readme-istanbul-escort-ga-restored.png");

  } catch (err: any) {
    console.error("❌ Error during magic login flow:", err.message);
  } finally {
    await cleanContext.close().catch(() => {});
    await cdpBrowser.close().catch(() => {});
  }
}

run().catch(console.error);
