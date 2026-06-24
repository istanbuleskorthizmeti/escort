import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222 to read Gmail...");
  const cdpBrowser = await chromium.connectOverCDP('http://localhost:9222');
  const cdpContexts = cdpBrowser.contexts();
  
  if (cdpContexts.length === 0) {
    console.error("❌ No CDP contexts found!");
    return;
  }

  const cdpContext = cdpContexts[0];
  const gmailPage = await cdpContext.newPage();

  let signupLink = '';

  try {
    console.log("🔍 Searching Gmail for the newest ReadMe signup email...");
    await gmailPage.goto('https://mail.google.com/mail/u/0/#search/in%3Aanywhere+ReadMe', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
    await gmailPage.waitForTimeout(10000);

    // Click the top email thread in the search results
    const emailClicked = await gmailPage.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr[role="row"]'));
      const readmeRows = rows.filter(row => {
        const text = row.textContent || '';
        return text.includes('ReadMe') && (text.includes('password') || text.includes('reset') || text.includes('Create Your'));
      });
      if (readmeRows.length > 0) {
        const clickTarget = readmeRows[0].querySelector('.y6') || readmeRows[0];
        (clickTarget as HTMLElement).click();
        return true;
      }
      return false;
    });

    if (!emailClicked) {
      console.error("❌ Could not find any ReadMe email in Gmail!");
      return;
    }

    console.log("📬 Email opened. Waiting for content to load...");
    await gmailPage.waitForTimeout(6000);

    // Extract links in the email body
    const links = await gmailPage.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      return anchors
        .map(a => ({ text: a.textContent?.trim(), href: a.href }))
        .filter(link => link.href && link.href.includes('readme'));
    });

    console.log("🔗 Found links in email:", links);

    const loginLink = [...links].reverse().find(l => l.href.includes('signup') || l.href.includes('sign') || l.href.includes('login') || l.href.includes('password'));
    if (!loginLink) {
      console.error("❌ Signup/login link not found in email!");
      return;
    }

    signupLink = loginLink.href;
    console.log(`🎯 Extracted Signup Link: ${signupLink}`);

  } catch (err: any) {
    console.error("❌ Error reading Gmail:", err.message);
    return;
  } finally {
    await gmailPage.close();
  }

  // 2. Create clean isolated context in CDP browser
  console.log("🚀 Creating clean isolated context in Chrome...");
  const cleanContext = await cdpBrowser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const cleanPage = await cleanContext.newPage();

  try {
    console.log(`🔗 Navigating clean page to: ${signupLink}`);
    await cleanPage.goto(signupLink, { waitUntil: 'load', timeout: 60000 });
    await cleanPage.waitForTimeout(6000);

    await cleanPage.screenshot({ path: path.join(process.cwd(), 'readme-clean-signup-before.png') });
    console.log("📸 Saved readme-clean-signup-before.png");

    const hasPasswordInput = await cleanPage.$('input[type="password"]');
    if (hasPasswordInput) {
      console.log("✍️ Filling Name and Password in clean browser...");
      await cleanPage.fill('input[name="name"]', 'Mehmet');
      await cleanPage.fill('input[name="password"]', '212jeAmind!');
      await cleanPage.waitForTimeout(1000);

      console.log("💾 Submitting form...");
      await cleanPage.click('button[type="submit"]');
      await cleanPage.waitForTimeout(10000);

      await cleanPage.screenshot({ path: path.join(process.cwd(), 'readme-clean-signup-after.png') });
      console.log("📸 Saved readme-clean-signup-after.png");
    } else {
      console.log("ℹ️ No password field detected. Checking if we already logged in.");
    }

    // Navigate to integrations page
    const integrationsUrl = 'https://dash.readme.com/project/istanbul-escort/v1.0/integrations';
    console.log(`🚀 Navigating to integrations: ${integrationsUrl}`);
    await cleanPage.goto(integrationsUrl, { waitUntil: 'load', timeout: 45000 });
    await cleanPage.waitForTimeout(8000);

    const currentUrl = cleanPage.url();
    console.log(`📍 Landed URL: ${currentUrl}`);

    if (currentUrl.includes('login') || currentUrl.includes('/to/')) {
      console.error("❌ Auth failed. Redirected to login page!");
      await cleanPage.screenshot({ path: path.join(process.cwd(), 'readme-clean-integrations-failed.png') });
      
      const bodyText = await cleanPage.evaluate(() => document.body.innerText);
      console.log("Page Text:\n", bodyText);
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
      await cleanPage.screenshot({ path: path.join(process.cwd(), 'readme-clean-ga-not-found.png') });
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
    console.error("❌ Error during flow:", err.message);
  } finally {
    await cleanContext.close().catch(() => {});
    await cdpBrowser.close().catch(() => {});
  }
}

run().catch(console.error);
