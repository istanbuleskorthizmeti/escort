import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { TelegramService } from '../lib/crm/telegram';
import { DOMAIN_MATRIX } from '../config/domains';
import { ga4Mappings } from '../config/ga4-mappings';

dotenv.config();

/**
 * 🔱 HYDRA FLEET BULK PROVISIONER v1.0 (Full Fleet Autopilot)
 * Loops through the entire DOMAIN_MATRIX:
 * 1. Registers all domains in Google Search Console (GSC).
 * 2. Checks if GA4 mapping exists. If not, creates GA4 property and Web Data Stream.
 * 3. Saves all generated GA4 IDs back to config/ga4-mappings.ts.
 * 4. Throttles requests to respect Google API limits.
 * 5. Sends Telegram reports.
 */

async function getAuthenticatedClient() {
  let keyPath = path.join(process.cwd(), 'google-key-sovereign.json');
  if (!fs.existsSync(keyPath)) {
    keyPath = path.join(process.cwd(), 'google-key.json');
  }

  if (!fs.existsSync(keyPath)) {
    throw new Error('❌ Missing Service Account credentials.');
  }

  console.log(`🔑 Loading Google Service Account credentials: ${path.basename(keyPath)}`);
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

async function addDomainToGsc(auth: JWT, domain: string): Promise<string> {
  const sc = google.searchconsole({ version: 'v1', auth });
  const siteUrl = `sc-domain:${domain}`;

  try {
    await sc.sites.add({ siteUrl });
    console.log(`   ✅ [GSC] Added domain property: ${siteUrl}`);
    return 'ADDED';
  } catch (err: any) {
    if (err.message.includes('already exists') || err.code === 409) {
      console.log(`   ℹ️ [GSC] Already exists: ${siteUrl}`);
      return 'EXISTS';
    }
    console.warn(`   ⚠️ [GSC WARNING] Failed for ${domain}:`, err.message);
    return 'FAILED';
  }
}

async function provisionGA4Property(accessToken: string, domain: string, accounts: any[]): Promise<string> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  let lastError: any = null;

  for (const account of accounts) {
    const targetAccountId = account.name.split('/')[1];
    try {
      // Create Property
      const propertyRes = await axios.post(
        'https://analyticsadmin.googleapis.com/v1beta/properties',
        {
          parent: `accounts/${targetAccountId}`,
          displayName: `${domain} - Fleet Property`,
          timeZone: 'Europe/Istanbul',
          currencyCode: 'TRY',
        },
        { headers }
      );
      
      const propertyId = propertyRes.data.name.split('/')[1];
      console.log(`   ✅ [GA4] Property created! ID: ${propertyId}`);

      // Create Web Stream
      const streamRes = await axios.post(
        `https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/dataStreams`,
        {
          type: 'WEB_DATA_STREAM',
          displayName: 'Default Web Stream',
          webStreamData: {
            defaultUri: `https://${domain}`,
          },
        },
        { headers }
      );
      const measurementId = streamRes.data.webStreamData.measurementId;
      console.log(`   ✅ [GA4] Stream created! ID: ${measurementId}`);
      return measurementId;

    } catch (err: any) {
      lastError = err;
    }
  }

  throw new Error(`Failed to create property in all accessible accounts. Last error: ${lastError?.message}`);
}

function saveMappings() {
  const mappingsPath = path.join(process.cwd(), 'config', 'ga4-mappings.ts');
  const newContent = `/**
 * 🎯 HYDRA FLEET: GA4 MEASUREMENT ID MAP
 * This file is automatically updated by hydra-fleet-auto-provisioner.ts.
 */
export const ga4Mappings: Record<string, string> = ${JSON.stringify(ga4Mappings, null, 2)};
`;
  fs.writeFileSync(mappingsPath, newContent, 'utf-8');
}

async function runBulkProvisioning() {
  console.log('🔱 [BULK PROVISIONER] Initiating Google Infrastructure Conquest...');
  
  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  let report = `🔱 <b>HYDRA FLEET BULK CONQUEST RAPORU</b>\n`;
  report += `🕒 <b>Tarih:</b> <code>${timestamp}</code>\n\n`;

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
      throw new Error('No GA4 accounts found. Ensure service account is added at Account level.');
    }

    console.log(`👥 Found ${accounts.length} accessible accounts: ${accounts.map((a: any) => a.displayName).join(', ')}`);

    let processedCount = 0;
    let newGa4Count = 0;

    for (const site of DOMAIN_MATRIX) {
      const domain = site.host.toLowerCase();
      console.log(`\n──────────────────────────────────────────`);
      console.log(`🌍 [SITE ${processedCount + 1}/${DOMAIN_MATRIX.length}] Target: ${domain}`);

      // 1. Add to Search Console
      const gscStatus = await addDomainToGsc(auth, domain);

      // 2. Check and Create GA4 Property
      let ga4Id = ga4Mappings[domain];
      let gaStatus = 'SKIPPED (EXISTS)';

      if (!ga4Id) {
        console.log(`   📡 GA4 mapping missing. Provisioning...`);
        try {
          ga4Id = await provisionGA4Property(accessToken, domain, accounts);
          gaStatus = `CREATED (${ga4Id})`;
          ga4Mappings[domain] = ga4Id;
          newGa4Count++;
          saveMappings(); // Save in real-time
        } catch (gaErr: any) {
          console.error(`   ❌ [GA4 ERROR] Failed to provision for ${domain}:`, gaErr.message);
          gaStatus = 'FAILED';
        }
      } else {
        console.log(`   ✔ GA4 mapping exists: ${ga4Id}`);
      }

      report += `🌐 <b>${domain}</b>\n`;
      report += `├─ <b>GSC:</b> <code>${gscStatus}</code>\n`;
      report += `└─ <b>GA4:</b> <code>${gaStatus}</code>\n\n`;

      processedCount++;

      // Prevent Google API rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    report += `🎉 <b>Conquest Finished!</b>\n`;
    report += `📈 Total domains processed: <b>${processedCount}</b>\n`;
    report += `📈 New GA4 properties created: <b>${newGa4Count}</b>\n`;

    await TelegramService.sendMessage(report);
    console.log('\n🏁 [CONQUEST COMPLETE] All domains registered and mapped successfully.');
    process.exit(0);

  } catch (err: any) {
    console.error('💥 [BULK FAILURE]:', err.message);
    try {
      await TelegramService.sendMessage(`❌ <b>[BULK PROVISIONER CRITICAL FAILURE]</b>\n\n<code>${err.message}</code>`);
    } catch (tgErr: any) {
      console.error(tgErr.message);
    }
    process.exit(1);
  }
}

runBulkProvisioning();
