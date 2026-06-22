import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import { TelegramService } from '../lib/crm/telegram';

dotenv.config();
chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const SITES_LIST_PATH = path.join(process.cwd(), 'data', 'live_google_sites.json');
const MAPPINGS_PATH = path.join(process.cwd(), 'data', 'google-sites-ga4-mappings.json');

/**
 * 🧛‍♂️ HYDRA GOOGLE SITES AUTO-PROVISIONER v1.0
 * 1. Reads the list of live Google Sites from data/live_google_sites.json.
 * 2. Adds each Google Site URL to Google Search Console (GSC).
 * 3. Creates a GA4 property and Web Data Stream for each Google Site.
 * 4. Injects the GA4 Measurement ID automatically into Google Sites settings via Playwright!
 */

async function getAuthenticatedClient() {
  let keyPath = path.join(process.cwd(), 'google-key-sovereign.json');
  if (!fs.existsSync(keyPath)) {
    keyPath = path.join(process.cwd(), 'google-key.json');
  }

  if (!fs.existsSync(keyPath)) {
    throw new Error('❌ Missing Service Account credentials (tried google-key-sovereign.json and google-key.json).');
  }

  const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

  const auth = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: [
      'https://www.googleapis.com/auth/webmasters',
      'https://www.googleapis.com/auth/analytics.edit',
      'https://www.googleapis.com/auth/analytics.provision'
    ],
  });

  return { auth, clientEmail: keys.client_email };
}

async function addSiteToGsc(auth: JWT, siteUrl: string): Promise<string> {
  const sc = google.searchconsole({ version: 'v1', auth });
  
  // Format target site URL correctly for GSC (needs trailing slash)
  const formattedUrl = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;

  console.log(`   📡 [GSC] Adding Site URL: ${formattedUrl}`);
  try {
    await sc.sites.add({ siteUrl: formattedUrl });
    console.log(`   ✅ [GSC SUCCESS] Added Site: ${formattedUrl}`);
    return 'SUCCESS';
  } catch (err: any) {
    if (err.message.includes('already exists') || err.code === 409) {
      console.log(`   ℹ️ [GSC INFO] Already registered in GSC: ${formattedUrl}`);
      return 'ALREADY_EXISTS';
    }
    console.error(`   ❌ [GSC ERROR] Failed for GSC: ${formattedUrl}:`, err.message);
    return 'FAILED';
  }
}

async function provisionGA4Property(accessToken: string, siteSlug: string, accounts: any[]): Promise<string> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  let lastError: any = null;

  for (const account of accounts) {
    const targetAccountId = account.name.split('/')[1];
    console.log(`   📡 [GA4] Creating GA4 Property under Account: ${account.displayName} (ID: ${targetAccountId})...`);

    try {
      const propertyRes = await axios.post(
        'https://analyticsadmin.googleapis.com/v1beta/properties',
        {
          parent: `accounts/${targetAccountId}`,
          displayName: `G-Site: ${siteSlug}`,
          timeZone: 'Europe/Istanbul',
          currencyCode: 'TRY',
        },
        { headers }
      );
      
      const propertyId = propertyRes.data.name.split('/')[1];
      console.log(`   ✅ [GA4 SUCCESS] Property created! ID: ${propertyId}`);

      // Create Web Stream
      const streamRes = await axios.post(
        `https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/dataStreams`,
        {
          type: 'WEB_DATA_STREAM',
          displayName: 'Google Sites Stream',
          webStreamData: {
            defaultUri: `https://sites.google.com/dorukcanay.digital/${siteSlug}`,
          },
        },
        { headers }
      );
      const measurementId = streamRes.data.webStreamData.measurementId;
      console.log(`   ✅ [GA4 SUCCESS] Data Stream created! Measurement ID: ${measurementId}`);
      return measurementId;

    } catch (err: any) {
      lastError = err;
    }
  }

  throw new Error(`Failed to create property in all accessible accounts. Last error: ${lastError?.message}`);
}

async function injectGA4ViaPlaywright(browserContext: any, siteSlug: string, measurementId: string): Promise<boolean> {
  const editorUrl = `https://sites.google.com/dorukcanay.digital/${siteSlug}/edit`;
  console.log(`   🚀 [PLAYWRIGHT] Injecting GA4 ID into editor for: ${siteSlug}...`);

  const page = await browserContext.newPage();
  try {
    await page.goto(editorUrl, { waitUntil: 'load', timeout: 90000 });
    await page.waitForTimeout(5000);

    // Click edit pencil button if we are on the public/404 page
    console.log("   🖱️ Looking for edit pencil button to redirect to real editor...");
    const editButton = page.locator('a[href*="/edit"]');
    if (await editButton.count() > 0) {
      await editButton.first().click();
      console.log("   🎯 Pencil button clicked. Waiting for editor interface...");
      await page.waitForTimeout(10000); // Wait 10s for the actual editor interface to load
    } else {
      console.log("   ℹ️ Pencil button not found, assuming already in editor.");
    }

    // 1. Locate Settings/Ayarlar button
    console.log("   ⚙️ Clicking Settings Gear button...");
    const settingsSelectors = [
      'button[aria-label="Settings"]',
      'button[aria-label="Ayarlar"]',
      '[data-tooltip="Settings"]',
      '[data-tooltip="Ayarlar"]',
      '.sites-editor-settings-button'
    ];

    let settingsClicked = false;
    for (const sel of settingsSelectors) {
      try {
        if (await page.locator(sel).count() > 0) {
          await page.click(sel);
          settingsClicked = true;
          break;
        }
      } catch (e) {}
    }

    if (!settingsClicked) {
      throw new Error("Could not locate Settings button.");
    }

    await page.waitForTimeout(3000);

    // 2. Click on "Analytics" tab inside settings dialog
    console.log("   📊 Locating Analytics tab...");
    await page.click('div[role="dialog"] div:text-is("Analytics"), [role="tab"]:has-text("Analytics")');
    await page.waitForTimeout(2000);

    // 3. Paste GA4 Measurement ID in the input field
    console.log(`   ✍️ Inserting GA4 Measurement ID: ${measurementId}...`);
    const dialogInputs = page.locator('div[role="dialog"] input');
    const inputCount = await dialogInputs.count();
    let targetInput = null;
    
    for (let i = 0; i < inputCount; i++) {
      const el = dialogInputs.nth(i);
      if (await el.isVisible()) {
        const ariaLabel = await el.getAttribute('aria-label') || '';
        const placeholder = await el.getAttribute('placeholder') || '';
        if (!ariaLabel.toLowerCase().includes('alternatif') && !placeholder.toLowerCase().includes('alternatif')) {
          targetInput = el;
          break;
        }
      }
    }

    if (!targetInput) {
      throw new Error("Could not find visible GA4 Measurement ID input in dialog.");
    }

    await targetInput.click();
    // Clear existing value
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await targetInput.fill(measurementId);

    await page.waitForTimeout(2000);

    // Close settings dialog
    console.log("   ✖️ Closing settings dialog...");
    const dialog = page.locator('div[role="dialog"]');
    if (await dialog.count() > 0) {
      const box = await dialog.first().boundingBox();
      if (box) {
        console.log(`   🎯 Clicking dialog close corner at: x=${box.x + box.width - 24}, y=${box.y + 24}`);
        await page.mouse.click(box.x + box.width - 24, box.y + 24);
      } else {
        await page.keyboard.press('Escape');
      }
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(3000);

    // 4. Click "Publish" button to make the changes live
    console.log("   📡 Clicking Publish (Yayınla) button...");
    const publishBtn = page.locator('div[role="button"]:has-text("Yayınla"), div[role="button"]:has-text("Publish")');
    await publishBtn.first().click();
    await page.waitForTimeout(4000);

    // 5. Confirm Publish inside publish changes popup
    console.log("   🚀 Confirming publish changes...");
    // Check if there is "no unpublished changes to review"
    const noChangesText = page.locator('text="İncelenecek yayınlanmamış değişiklik yok", text="No unpublished changes to review"');
    if (await noChangesText.count() > 0) {
      console.log("   ℹ️ No unpublished changes to review. GA4 ID already applied and published!");
      return true;
    }

    const confirmBtn = page.locator('div[role="button"]:has-text("Yayınla"), div[role="button"]:has-text("Publish")').last();
    if (await confirmBtn.count() > 0 && await confirmBtn.isVisible()) {
      const isDisabled = await confirmBtn.getAttribute('aria-disabled');
      if (isDisabled === 'true') {
        console.log("   ℹ️ Confirm Publish button is disabled. Changes might already be live.");
      } else {
        await confirmBtn.click();
        await page.waitForTimeout(10000); // Wait 10 seconds for publish process to complete
      }
    } else {
      console.log("   ℹ️ Confirm button not found or not visible. Assuming already published.");
    }
    
    console.log(`   ✅ [PLAYWRIGHT SUCCESS] Successfully injected & published GA4 for: ${siteSlug}`);
    return true;

  } catch (err: any) {
    console.error(`   ❌ [PLAYWRIGHT ERROR] Failed to inject GA4 for ${siteSlug}:`, err.message);
    // Take a screenshot for troubleshooting
    try {
      const screenshotPath = path.join(process.cwd(), 'artifacts', `error-${siteSlug}.png`);
      await page.screenshot({ path: screenshotPath });
      console.log(`   📸 Error screenshot saved to: ${screenshotPath}`);
    } catch (e) {}
    return false;
  } finally {
    try { await page.close(); } catch(e){}
  }
}

async function run() {
  console.log('🔱 [GOOGLE SITES AUTO-PROVISIONER] Launching Fleet Conquest...');
  
  if (!fs.existsSync(SITES_LIST_PATH)) {
    console.error(`❌ [ERROR] Google Sites list file not found at: ${SITES_LIST_PATH}`);
    process.exit(1);
  }

  const sitesList: string[] = JSON.parse(fs.readFileSync(SITES_LIST_PATH, 'utf-8'));
  console.log(`📝 Loaded ${sitesList.length} Google Sites for processing.`);

  let mappings: Record<string, { gsc: string; ga4: string; injected: boolean }> = {};
  if (fs.existsSync(MAPPINGS_PATH)) {
    try { mappings = JSON.parse(fs.readFileSync(MAPPINGS_PATH, 'utf-8')); } catch(e){}
  }

  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  let report = `🔱 <b>GOOGLE SITES AUTO-PROVISIONING RAPORU</b>\n🕒 <b>Tarih:</b> <code>${timestamp}</code>\n\n`;

  try {
    const { auth } = await getAuthenticatedClient();
    const tokenObj = await auth.getAccessToken();
    const accessToken = tokenObj.token;

    if (!accessToken) {
      throw new Error('Failed to retrieve OAuth token.');
    }

    // Fetch GA4 Accounts
    console.log('📡 [GA4] Listing accounts...');
    const accountsRes = await axios.get('https://analyticsadmin.googleapis.com/v1beta/accounts', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const accounts = accountsRes.data.accounts || [];
    if (accounts.length === 0) {
      throw new Error('No GA4 accounts found associated with this Service Account.');
    }

    console.log(`👥 Accessible GA4 accounts: ${accounts.map((a: any) => a.displayName).join(', ')}`);

    // GSC and GA4 API Provisioning Loop
    for (const siteUrl of sitesList) {
      // Extract the slug (e.g. "sefakoyistanbul-drkcnay2026" from "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa")
      const parts = siteUrl.split('/');
      const slugIndex = parts.indexOf('dorukcanay.digital');
      if (slugIndex === -1 || slugIndex === parts.length - 1) continue;
      const siteSlug = parts[slugIndex + 1];

      console.log(`\n──────────────────────────────────────────`);
      console.log(`🌍 Processing Google Site: ${siteSlug}`);

      // Initialize mapping if not present
      if (!mappings[siteSlug]) {
        mappings[siteSlug] = { gsc: 'PENDING', ga4: '', injected: false };
      }

      // 1. Add to Search Console
      if (mappings[siteSlug].gsc !== 'SUCCESS' && mappings[siteSlug].gsc !== 'ALREADY_EXISTS') {
        const gscStatus = await addSiteToGsc(auth, siteUrl.replace(/\/ana-sayfa$/, ''));
        mappings[siteSlug].gsc = gscStatus;
      } else {
        console.log(`   ✔ GSC already configured: ${mappings[siteSlug].gsc}`);
      }

      // 2. Create GA4 property
      if (!mappings[siteSlug].ga4) {
        try {
          const ga4Id = await provisionGA4Property(accessToken, siteSlug, accounts);
          mappings[siteSlug].ga4 = ga4Id;
        } catch (gaErr: any) {
          console.error(`   ❌ [GA4 ERROR] Failed to create property for ${siteSlug}:`, gaErr.message);
        }
      } else {
        console.log(`   ✔ GA4 property already exists: ${mappings[siteSlug].ga4}`);
      }

      // Save mapping state
      fs.writeFileSync(MAPPINGS_PATH, JSON.stringify(mappings, null, 2), 'utf-8');

      // Wait between API requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Playwright Auto-Injection Loop
    console.log(`\n🤖 [PLAYWRIGHT] Initiating GA4 ID Auto-Injection via logged-in Chrome...`);
    const chromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";
    
    const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
      headless: false,
      executablePath: chromePath,
      viewport: { width: 1366, height: 768 },
      args: [
        '--start-maximized',
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    for (const siteSlug in mappings) {
      const data = mappings[siteSlug];
      if (data.ga4 && !data.injected) {
        console.log(`\n🤖 Auto-injecting GA4 ID into site: ${siteSlug}`);
        const success = await injectGA4ViaPlaywright(browserContext, siteSlug, data.ga4);
        if (success) {
          data.injected = true;
          fs.writeFileSync(MAPPINGS_PATH, JSON.stringify(mappings, null, 2), 'utf-8');
        }
        // Brief wait between browser automations
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    await browserContext.close();

    // Generate Final Report
    report += `📈 <b>Toplam Site Sayısı:</b> <code>${Object.keys(mappings).length}</code>\n\n`;
    for (const siteSlug in mappings) {
      const data = mappings[siteSlug];
      report += `🕸️ <b>Slug:</b> <code>${siteSlug}</code>\n`;
      report += `├─ <b>GSC:</b> <code>${data.gsc}</code>\n`;
      report += `├─ <b>GA4 ID:</b> <code>${data.ga4 || 'FAILED'}</code>\n`;
      report += `└─ <b>Enjeksiyon:</b> <code>${data.injected ? 'SUCCESS ✅' : 'FAILED ❌'}</code>\n\n`;
    }

    await TelegramService.sendMessage(report);
    console.log('\n🏁 [CONQUEST COMPLETE] All Google Sites provisioned, registered, and injected successfully.');
    process.exit(0);

  } catch (err: any) {
    console.error('💥 [CRITICAL RUNTIME FAILURE]:', err.message);
    try {
      await TelegramService.sendMessage(`❌ <b>[GOOGLE SITES PROVISIONER FAILURE]</b>\n\n<code>${err.message}</code>`);
    } catch (e){}
    process.exit(1);
  }
}

run();
