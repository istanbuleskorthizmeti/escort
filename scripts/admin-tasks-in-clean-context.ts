import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  
  // Get main user context (for reading Gmail)
  const mainContext = browser.contexts()[0];
  if (!mainContext) {
    console.error("❌ Main context not found!");
    await browser.close();
    return;
  }

  // Create a brand new clean context (for admin session)
  console.log("Creating a clean browser context for the admin session...");
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();

  try {
    console.log("Navigating to ReadMe login in the clean context...");
    await adminPage.goto('https://dash.readme.com/login', { waitUntil: 'load', timeout: 45000 });
    await adminPage.waitForTimeout(6000);

    // Take screenshot of login input page
    await adminPage.screenshot({ path: 'readme-login-clean.png' });

    console.log("Entering admin email: info@dorukcanay.digital...");
    // Let's find the email input field. Since it's in a clean context, the login page will be visible!
    await adminPage.fill('input[type="email"]', 'info@dorukcanay.digital').catch(async () => {
      // Fallback selectors
      await adminPage.fill('input', 'info@dorukcanay.digital');
    });
    await adminPage.waitForTimeout(1000);

    console.log("Submitting login form...");
    await adminPage.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]') || document.querySelector('button');
      if (btn) (btn as HTMLElement).click();
    });

    await adminPage.waitForTimeout(15000); // Wait for the login email to arrive
    console.log("Email requested! Reading Gmail in main context...");

    // Find the Gmail tab in the main context
    const pages = mainContext.pages();
    let gmailPage = pages.find(p => p.url().includes('mail.google.com'));
    if (!gmailPage) {
      console.log("Gmail tab not found. Creating a new tab in main context...");
      gmailPage = await mainContext.newPage();
    }

    console.log("Navigating/reloading Gmail inbox...");
    await gmailPage.goto('https://mail.google.com/mail/u/0/#inbox', { waitUntil: 'load', timeout: 45000 });
    await gmailPage.waitForSelector('tr[role="row"]', { timeout: 30000 });
    await gmailPage.waitForTimeout(5000);

    // Find and click the latest email from ReadMe
    console.log("Clicking the latest ReadMe login email...");
    const emailClicked = await gmailPage.evaluate(() => {
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

    if (!emailClicked) {
      console.error("❌ Could not find the new ReadMe login email in Gmail!");
      await adminPage.close();
      await adminContext.close();
      await browser.close();
      return;
    }

    console.log("Email clicked. Waiting for email body to render...");
    await gmailPage.waitForTimeout(5000);

    // Extract all links in the email body
    const links = await gmailPage.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      return anchors
        .map(a => ({ text: a.textContent?.trim(), href: a.href }))
        .filter(link => link.href && link.href.includes('readme'));
    });

    console.log("Found links in email:", links);

    // Find the magic login link
    const loginLink = links.find(l => l.href.includes('sign') || l.href.includes('login') || l.href.includes('auth'));
    
    if (loginLink) {
      console.log("🎯 Fresh Magic Login Link:", loginLink.href);
      
      // Navigate the ADMIN page to the magic login link
      console.log("Logging into admin page via magic link...");
      await adminPage.goto(loginLink.href, { waitUntil: 'load', timeout: 60000 });
      await adminPage.waitForTimeout(10000);

      console.log("Logged in as admin! Current URL:", adminPage.url());
      await adminPage.screenshot({ path: 'readme-admin-dashboard.png' });

      // Navigate to Settings -> General of the secondary project to launch the docs
      const projectGeneralSettingsUrl = "https://istanbul-eskort-hizmeti.readme.io/docs/getting-started#/settings/general";
      console.log(`Navigating to Settings -> General: ${projectGeneralSettingsUrl}`);
      await adminPage.goto(projectGeneralSettingsUrl, { waitUntil: 'load', timeout: 45000 });
      await adminPage.waitForTimeout(8000);
      await adminPage.screenshot({ path: 'readme-admin-general-page.png' });

      // Click "Launch Docs" button
      console.log("Attempting to click Launch Docs button...");
      const launchResult = await adminPage.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, div[role="button"], a'));
        const launchBtn = buttons.find(b => 
          b.textContent?.toLowerCase().includes('launch') || 
          b.textContent?.toLowerCase().includes('yayınla')
        );
        if (launchBtn) {
          (launchBtn as HTMLElement).click();
          return "Clicked Launch button!";
        }
        return "Launch button not found.";
      });

      console.log("Launch Action Result:", launchResult);
      await adminPage.waitForTimeout(6000);
      await adminPage.screenshot({ path: 'readme-admin-post-launch.png' });

    } else {
      console.error("❌ Magic login link not found in email body!");
    }

  } catch (err: any) {
    console.error("Error during clean context admin execution:", err.message);
  } finally {
    await adminPage.close();
    await adminContext.close();
    await browser.close();
  }
}

run().catch(console.error);
