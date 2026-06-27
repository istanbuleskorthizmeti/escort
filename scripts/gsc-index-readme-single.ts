import { chromium } from 'playwright';
import * as path from 'path';

async function run() {
  const targetUrl = "https://istanbul-eskort-hizmeti.readme.io/docs/tekirdag-cerkezkoy-escort";
  const propertyId = "https://istanbul-eskort-hizmeti.readme.io/";
  const dashboardUrl = `https://search.google.com/search-console?resource_id=${encodeURIComponent(propertyId)}`;

  console.log("🔗 Connecting to existing Chrome instance on port 9222...");
  
  let browser;
  try {
    browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  } catch (err: any) {
    console.error("❌ Failed to connect to Chrome on port 9222. Make sure Chrome is running with remote-debugging-port=9222.");
    process.exit(1);
  }

  const context = browser.contexts()[0];
  if (!context) {
    console.error("❌ No active browser context found!");
    process.exit(1);
  }

  console.log(`🚀 Starting UI-based URL inspection for: ${targetUrl}`);
  const page = await context.newPage();

  try {
    console.log(`🔗 Navigating to dashboard: ${dashboardUrl}`);
    await page.goto(dashboardUrl, { waitUntil: 'load', timeout: 45000 });
    
    console.log("⌛ Waiting for initial page load (8s)...");
    await page.waitForTimeout(8000);

    // Locate top search input box
    const searchInput = page.locator('input.Ax4B8.ZAGvjd').first();
    if (await searchInput.count() > 0) {
      console.log("🔍 Found search bar. Clicking, filling URL, and pressing Enter to start inspection...");
      await searchInput.click();
      await page.waitForTimeout(500);
      await searchInput.fill(targetUrl);
      await page.waitForTimeout(500);
      await page.keyboard.press('Enter');
      
      console.log("⌛ Waiting 30 seconds for GSC to retrieve inspection status...");
      await page.waitForTimeout(30000);
    } else {
      console.error("❌ GSC Search bar not found. Make sure you are logged in and GSC has loaded.");
      await page.screenshot({ path: path.join(process.cwd(), 'gsc-inspect-searchbar-error.png') });
      return;
    }

    // Check visible body text to see if already requested or indexed
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.includes("eklenmesi istendi") || bodyText.includes("oluşturulması istendi") || bodyText.includes("Indexing requested")) {
      console.log("ℹ️ Indexing already requested. Skipping.");
      await page.screenshot({ path: path.join(process.cwd(), 'gsc-index-readme-already-requested.png') });
      return;
    }
    if (bodyText.includes("Google'da kayıtlı") || bodyText.includes("is on Google")) {
      console.log("ℹ️ URL is already indexed on Google. Skipping.");
      await page.screenshot({ path: path.join(process.cwd(), 'gsc-index-readme-already-indexed.png') });
      return;
    }

    // Find the visible button to request indexing
    const buttons = page.locator('div[role="button"]');
    const btnCount = await buttons.count();
    let targetBtn = null;
    for (let idx = 0; idx < btnCount; idx++) {
      const el = buttons.nth(idx);
      const visible = await el.isVisible();
      const text = await el.innerText();
      if (visible && (
        text.toLowerCase().includes("eklenmesini iste") || 
        text.toLowerCase().includes("istek gönder") || 
        text.toLowerCase().includes("request indexing") ||
        text.toUpperCase().includes("DİZİNE EKLENMESİNİ İSTE")
      )) {
        targetBtn = el;
        break;
      }
    }

    if (targetBtn) {
      console.log("🎯 Found 'Request Indexing' button. Clicking...");
      await targetBtn.click();

      console.log("⌛ Submitting request (this runs a live test which takes ~2 mins)...");
      
      // Wait in intervals and check status
      let submitted = false;
      for (let check = 0; check < 15; check++) {
        await page.waitForTimeout(10000);
        console.log(`   ... ${(check + 1) * 10} seconds elapsed`);
        
        // Check if confirmation dialog / toast shows up
        const gotItBtn = page.locator('span:has-text("Anladım"), span:has-text("Got it"), div[role="button"]:has-text("Got it"), div[role="button"]:has-text("Anladım")');
        if (await gotItBtn.count() > 0 && await gotItBtn.first().isVisible()) {
          console.log("🎉 [SUCCESS] Indexing request submitted successfully! Clicking 'Got it'...");
          await gotItBtn.first().click();
          submitted = true;
          break;
        }

        // Check if quota limit modal shows up
        const quotaExceeded = page.locator('div:has-text("Kota Aşıldı"), div:has-text("Quota exceeded"), div:has-text("günlük kota"), div:has-text("quota")');
        if (await quotaExceeded.count() > 0 && await quotaExceeded.first().isVisible()) {
          console.error("❌ Daily GSC indexing quota reached!");
          await page.screenshot({ path: path.join(process.cwd(), 'gsc-index-readme-quota-exceeded.png') });
          break;
        }
      }

      if (!submitted) {
        console.log("⚠️ Submission timeout reached. Saving screenshot for review...");
        await page.screenshot({ path: path.join(process.cwd(), 'gsc-index-readme-timeout.png') });
      }
    } else {
      console.log("ℹ️ 'Request Indexing' button not found (possibly already submitted or not available).");
      await page.screenshot({ path: path.join(process.cwd(), 'gsc-index-readme-no-button.png') });
    }

  } catch (err: any) {
    console.error("❌ Error occurred:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
