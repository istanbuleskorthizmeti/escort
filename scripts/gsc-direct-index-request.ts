import { chromium } from 'playwright';
import * as path from 'path';

const googleSites = [
  "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v/ana-sayfa/"
];

async function startGscDirectIndexing() {
  console.log("🔗 Connecting to existing Chrome instance on port 9222...");
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  
  if (!context) {
    console.error("❌ No active browser context found!");
    return;
  }

  console.log(`🚀 Starting UI-based URL inspection for ${googleSites.length} sites...`);

  for (let i = 0; i < googleSites.length; i++) {
    const pageUrl = googleSites[i];
    // Property resource_id in GSC is registered as the subfolder path ending in /ana-sayfa/
    const basePropertyUrl = pageUrl.endsWith('/') ? pageUrl : `${pageUrl}/`;

    // Construct direct GSC property dashboard link
    const dashboardUrl = `https://search.google.com/search-console?resource_id=${encodeURIComponent(basePropertyUrl)}`;

    console.log(`\n--------------------------------------------------`);
    console.log(`📍 [${i + 1}/${googleSites.length}] Processing: ${pageUrl}`);
    console.log(`🔗 Navigating to dashboard: ${dashboardUrl}`);

    const page = await context.newPage();
    try {
      await page.goto(dashboardUrl, { waitUntil: 'load', timeout: 45000 });
      console.log("   ⌛ Waiting for initial page load (8s)...");
      await page.waitForTimeout(8000);

      // Locate top search input box
      const searchInput = page.locator('input.Ax4B8.ZAGvjd').first();
      if (await searchInput.count() > 0) {
        console.log("   🔍 Found search bar. Clicking, filling URL, and pressing Enter to start inspection...");
        await searchInput.click();
        await page.waitForTimeout(500);
        await searchInput.fill(pageUrl);
        await page.waitForTimeout(500);
        await page.keyboard.press('Enter');
        
      console.log("   ⌛ Waiting 30 seconds for GSC to retrieve inspection status...");
        await page.waitForTimeout(30000);
      }

      // Check visible body text to skip already requested or indexed URLs
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (bodyText.includes("eklenmesi istendi") || bodyText.includes("oluşturulması istendi")) {
        console.log("   ℹ️ Indexing already requested. Skipping.");
        await page.screenshot({ path: path.join(process.cwd(), `gsc-index-already-requested-${i}.png`) });
        continue;
      }
      if (bodyText.includes("Google'da kayıtlı") || bodyText.includes("is on Google")) {
        console.log("   ℹ️ URL is already indexed on Google. Skipping.");
        await page.screenshot({ path: path.join(process.cwd(), `gsc-index-already-indexed-${i}.png`) });
        continue;
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
        console.log("   🎯 Found visible 'Request Indexing' button. Clicking...");
        await targetBtn.click();

        console.log("   ⌛ Submitting request (this runs a live test which takes ~2 mins)...");
        
        // Wait in intervals and check status
        let submitted = false;
        for (let check = 0; check < 15; check++) {
          await page.waitForTimeout(10000);
          console.log(`      ... ${(check + 1) * 10} seconds elapsed`);
          
          // Check if confirmation dialog / toast shows up
          const gotItBtn = page.locator('span:has-text("Anladım"), span:has-text("Got it"), div[role="button"]:has-text("Got it"), div[role="button"]:has-text("Anladım")');
          if (await gotItBtn.count() > 0 && await gotItBtn.first().isVisible()) {
            console.log("   ✅ Indexing request submitted successfully! Clicking 'Got it'...");
            await gotItBtn.first().click();
            submitted = true;
            break;
          }

          // Check if quota limit modal shows up
          const quotaExceeded = page.locator('div:has-text("Kota Aşıldı"), div:has-text("Quota exceeded"), div:has-text("günlük kota"), div:has-text("quota")');
          if (await quotaExceeded.count() > 0 && await quotaExceeded.first().isVisible()) {
            console.log("   ❌ Daily GSC indexing quota reached! Closing modal and aborting process.");
            await page.screenshot({ path: path.join(process.cwd(), `gsc-index-quota-exceeded.png`) });
            
            // Try to click "Kapat" or "Close" button to leave GSC clean
            const closeBtn = page.locator('div[role="button"]:has-text("Kapat"), div[role="button"]:has-text("Close"), span:has-text("Kapat")').first();
            if (await closeBtn.count() > 0 && await closeBtn.isVisible()) {
              await closeBtn.click();
            }
            throw new Error("QUOTA_EXCEEDED");
          }
        }

        if (!submitted) {
          console.log("   ⚠️ Submission timeout reached. Saving screenshot for review...");
          await page.screenshot({ path: path.join(process.cwd(), `gsc-index-timeout-${i}.png`) });
        }
      } else {
        console.log("   ℹ️ 'Request Indexing' button not found or already indexed.");
        // Save screenshot to confirm state
        await page.screenshot({ path: path.join(process.cwd(), `gsc-index-state-${i}.png`) });
      }

    } catch (err: any) {
      if (err.message === "QUOTA_EXCEEDED") {
        console.log("\n🛑 Aborting GSC URL inspection sequence: Google Search Console Daily Quota Exceeded.");
        break;
      }
      console.error(`   ❌ Failed processing site ${pageUrl}:`, err.message);
    } finally {
      await page.close();
    }
  }

  console.log("\n🏆 Direct GSC UI Indexing session complete.");
}

startGscDirectIndexing().catch(console.error);
