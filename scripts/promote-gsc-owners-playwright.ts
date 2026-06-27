import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

const SERVICE_ACCOUNTS = [
  'e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com',
  'eimza-362@model-osprey-500119-v9.iam.gserviceaccount.com',
  'eimza-390@starry-hearth-500119-u2.iam.gserviceaccount.com'
];

const GSC_PROPERTIES = [
  "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa/"
];

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  console.log(`Loaded ${GSC_PROPERTIES.length} properties for owner promotion.`);

  for (const propertyUrl of GSC_PROPERTIES) {
    console.log(`\n⚙️ Processing property: ${propertyUrl}`);
    const usersUrl = `https://search.google.com/search-console/users?resource_id=${encodeURIComponent(propertyUrl)}`;

    try {
      await page.goto(usersUrl, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(3000);

      // Check current users list
      const pageText = await page.evaluate(() => document.body.innerText);

      for (const sa of SERVICE_ACCOUNTS) {
        // Regex to check if the service account is already "Sahibi"
        const isAlreadyOwner = pageText.includes(sa) && 
          (pageText.includes(`${sa}\tSahibi`) || pageText.includes(`${sa} Sahibi`) || 
           (new RegExp(`${sa}\\s+Sahibi`)).test(pageText));

        if (isAlreadyOwner) {
          console.log(`   ℹ️ ${sa} is already Owner (Sahibi). Skipping.`);
          continue;
        }

        console.log(`   👉 Promoting ${sa} to Owner...`);
        
        // Click "+ KULLANICI EKLE" (visible only)
        const addButton = page.locator('div[role="button"]').filter({ hasText: /Kullanıcı ekle/i }).filter({ visible: true }).first();
        await addButton.click();
        await page.waitForTimeout(1500);

        // Fill email input inside the dialog (visible only)
        const emailInput = page.locator('div[role="dialog"] input[aria-label="Geçerli bir Google hesabı e-postası girin"]').filter({ visible: true }).first();
        await emailInput.fill(sa);
        await page.waitForTimeout(500);

        // Click permission dropdown (jsname="BA389" inside dialog, visible only)
        const dropdown = page.locator('div[role="dialog"] div[jsname="BA389"]').filter({ visible: true }).first();
        await dropdown.click();
        await page.waitForTimeout(500);

        // Click "Sahibi" option in dialog options (visible only)
        const ownerOption = page.locator('div[role="dialog"] div[role="option"]').filter({ hasText: 'Sahibi' }).filter({ visible: true }).first();
        await ownerOption.click();
        await page.waitForTimeout(500);

        // Click "EKLE" (Add) button (data-id="EBS5u" inside dialog, visible only)
        const saveButton = page.locator('div[role="dialog"] div[data-id="EBS5u"]').filter({ visible: true }).first();
        await saveButton.click();
        
        console.log("   💾 Saving...");
        await page.waitForTimeout(5000);
      }
    } catch (err: any) {
      console.error(`   ❌ Failed processing property ${propertyUrl}:`, err.message);
    }
  }

  await page.close();
  await browser.close();
  console.log("\n🏁 [PROMOTION COMPLETE] All service accounts promoted to Owner.");
}

run().catch(console.error);
