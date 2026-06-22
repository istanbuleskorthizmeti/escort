import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { TelegramService } from '../lib/crm/telegram';
import { ga4Mappings } from '../config/ga4-mappings';

dotenv.config();

/**
 * 🧛‍♂️ HYDRA FLEET AUTO-PROVISIONER v1.0 (Google Search Console & GA4 Autopilot)
 * 1. Authenticates using your sovereign Google Service Account key.
 * 2. Adds domains automatically to Google Search Console (GSC).
 * 3. Creates properties and web streams automatically in Google Analytics 4 (GA4).
 * 4. Saves generated GA4 Measurement IDs to config/ga4-mappings.ts dynamically.
 * 5. Sends live deployment reports to Telegram.
 */

async function getAuthenticatedClient() {
  let keyPath = path.join(process.cwd(), 'google-key-sovereign.json');
  if (!fs.existsSync(keyPath)) {
    keyPath = path.join(process.cwd(), 'google-key.json');
  }

  if (!fs.existsSync(keyPath)) {
    throw new Error('❌ Missing Service Account credentials (tried google-key-sovereign.json and google-key.json).');
  }

  console.log(`🔑 Loading Google Service Account credentials from: ${path.basename(keyPath)}`);
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

  console.log(`📡 [GSC] Adding domain property: ${siteUrl}`);
  try {
    await sc.sites.add({
      siteUrl: siteUrl,
    });
    console.log(`✅ [GSC SUCCESS] Added domain property: ${siteUrl}`);
    return 'SUCCESS';
  } catch (err: any) {
    if (err.message.includes('already exists') || err.code === 409) {
      console.log(`ℹ️ [GSC INFO] Domain property already exists: ${siteUrl}`);
      return 'ALREADY_EXISTS';
    }
    console.error(`❌ [GSC ERROR] Failed to add domain ${domain}:`, err.message);
    throw err;
  }
}

async function provisionGA4Property(accessToken: string, domain: string, accountId?: string): Promise<string> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  let accounts: any[] = [];

  if (accountId) {
    accounts = [{ name: `accounts/${accountId}`, displayName: `CLI Override (${accountId})` }];
  } else {
    console.log('📡 [GA4] Fetching list of available Analytics Accounts...');
    try {
      const accountsRes = await axios.get('https://analyticsadmin.googleapis.com/v1beta/accounts', { headers });
      accounts = accountsRes.data.accounts || [];
      if (accounts.length === 0) {
        throw new Error('No GA4 accounts found associated with this Google Service Account. Please add the Service Account email as Administrator/Editor in your GA4 Account settings.');
      }
      console.log(`✅ [GA4] Found ${accounts.length} accessible accounts: ${accounts.map((a: any) => `${a.displayName} (ID: ${a.name.split('/')[1]})`).join(', ')}`);
    } catch (err: any) {
      console.error('❌ [GA4] Failed to fetch accounts:', err.response?.data || err.message);
      throw err;
    }
  }

  let lastError: any = null;

  for (const account of accounts) {
    const targetAccountId = account.name.split('/')[1];
    console.log(`📡 [GA4] Attempting to create GA4 Property under Account: ${account.displayName} (ID: ${targetAccountId})...`);

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
      console.log(`✅ [GA4 SUCCESS] Property created successfully! ID: ${propertyId}`);

      // Create Web Stream
      console.log(`📡 [GA4] Creating Web Data Stream for: https://${domain}...`);
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
      console.log(`✅ [GA4 SUCCESS] Data Stream created! Measurement ID: ${measurementId}`);
      return measurementId;

    } catch (err: any) {
      const errDetail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      console.warn(`⚠️ [GA4 INFO] Account ${account.displayName} (ID: ${targetAccountId}) failed:`, errDetail);
      lastError = err;
      // Continue loop to try next account
    }
  }

  throw new Error(`Failed to provision GA4 Property across all available accounts. Last error: ${lastError?.message || lastError}`);
}

function updateGa4MappingsFile(domain: string, measurementId: string) {
  const mappingsPath = path.join(process.cwd(), 'config', 'ga4-mappings.ts');
  console.log(`💾 [CONFIG] Updating GA4 mapping config at: ${mappingsPath}`);

  // Update in-memory mapping object
  ga4Mappings[domain] = measurementId;

  // Construct new file contents
  const newContent = `/**
 * 🎯 HYDRA FLEET: GA4 MEASUREMENT ID MAP
 * This file is automatically updated by hydra-fleet-auto-provisioner.ts.
 */
export const ga4Mappings: Record<string, string> = ${JSON.stringify(ga4Mappings, null, 2)};
`;

  fs.writeFileSync(mappingsPath, newContent, 'utf-8');
  console.log(`✅ [CONFIG SUCCESS] Mappings successfully updated with: ${domain} => ${measurementId}`);
}

async function run() {
  const args = process.argv.slice(2);
  const domain = args[0];
  const cliAccountId = args[1]; // Optional Account ID parameter

  if (!domain) {
    console.error('❌ [ERROR] Missing domain argument. Usage: npx tsx scripts/hydra-fleet-auto-provisioner.ts <domain-name> [analytics-account-id]');
    process.exit(1);
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  
  console.log(`⚡ [AUTO-PROVISIONER] Starting Auto-Provisioning for: ${cleanDomain} at ${timestamp}...`);

  try {
    // 1. Authenticate
    const { auth } = await getAuthenticatedClient();
    const tokenObj = await auth.getAccessToken();
    const accessToken = tokenObj.token;

    if (!accessToken) {
      throw new Error('Failed to retrieve OAuth access token.');
    }

    // 2. Add Domain to GSC
    const gscStatus = await addDomainToGsc(auth, cleanDomain);

    // 3. Create GA4 Property and Web Stream
    const measurementId = await provisionGA4Property(accessToken, cleanDomain, cliAccountId);

    // 4. Update Mappings
    updateGa4MappingsFile(cleanDomain, measurementId);

    // 5. Send Telegram Report
    const reportMsg = `
🔱 <b>HYDRA AUTO-PROVISIONER COMPLETED</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🎯 <b>Domain:</b> <code>${cleanDomain}</code>
🕒 <b>Tarih:</b> <code>${timestamp}</code>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🟢 <b>Google Search Console Status:</b> <code>${gscStatus}</code>
📬 <b>GSC Property:</b> <code>sc-domain:${cleanDomain}</code>
🟢 <b>GA4 Measurement ID:</b> <code>${measurementId}</code>
📊 <b>Status:</b> <code>Successfully Registered & Mapped</code>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>Autopilot Active. Domain ready for direct traffic.</i>
`.trim();

    await TelegramService.sendMessage(reportMsg);
    console.log('🏁 [FINISHED] Auto-Provisioning completed successfully.');
    process.exit(0);

  } catch (err: any) {
    console.error('💥 [PROVISIONER FAILURE]:', err.message);
    try {
      await TelegramService.sendMessage(`❌ <b>[PROVISIONER FAILURE]</b> for domain <code>${cleanDomain}</code>\n\n<code>${err.message}</code>`);
    } catch (tgErr: any) {
      console.error('Failed to send Telegram error message:', tgErr.message);
    }
    process.exit(1);
  }
}

run();
