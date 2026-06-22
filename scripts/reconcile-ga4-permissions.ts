import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

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
      'https://www.googleapis.com/auth/analytics.edit',
      'https://www.googleapis.com/auth/analytics.provision',
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/analytics.manage.users'
    ],
  });
  return auth;
}

async function run() {
  console.log('🔄 [GA4 RECONCILE] Restoring user permissions for GSC...');
  try {
    const auth = await getAuthenticatedClient();
    const tokenObj = await auth.getAccessToken();
    const accessToken = tokenObj.token;

    if (!accessToken) {
      throw new Error('Failed to retrieve OAuth token.');
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    // 1. Fetch Accounts
    console.log('📡 Fetching Analytics accounts...');
    const accountsRes = await axios.get('https://analyticsadmin.googleapis.com/v1beta/accounts', { headers });
    const accounts = accountsRes.data.accounts || [];
    console.log(`Found ${accounts.length} accounts.`);

    const userEmail = 'info@dorukcanay.digital';

    for (const account of accounts) {
      const accountId = account.name.split('/')[1];
      console.log(`\n📂 Scanning account: ${account.displayName} (${accountId})...`);

      // 2. Fetch Properties under this Account
      const propertiesRes = await axios.get(
        `https://analyticsadmin.googleapis.com/v1beta/properties`,
        {
          headers,
          params: {
            filter: `ancestor:accounts/${accountId}`,
            pageSize: 200,
          },
        }
      );
      const properties = propertiesRes.data.properties || [];
      console.log(`   Found ${properties.length} properties.`);

      for (const prop of properties) {
        const propertyId = prop.name.split('/')[1];
        const displayName = prop.displayName || '';

        // If it starts with "G-Site:" or matches our network names
        if (displayName.includes('G-Site:') || displayName.includes('drkcnay') || displayName.includes('escort') || displayName.includes('sefakoy')) {
          console.log(`   🎯 Matching Property: "${displayName}" (ID: ${propertyId})`);

          // 3. Add accessBinding for info@dorukcanay.digital
          try {
            console.log(`      ➕ Adding Administrator role for ${userEmail}...`);
            await axios.post(
              `https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/accessBindings`,
              {
                user: userEmail,
                roles: ['predefinedRoles/admin'],
              },
              { headers }
            );
            console.log(`      ✅ Successfully added user access binding!`);
          } catch (linkErr: any) {
            if (linkErr.response?.data?.error?.message?.includes('already exists')) {
              console.log(`      ℹ️ User already has permissions.`);
            } else {
              console.error(`      ❌ Failed to add user link:`, linkErr.response?.data?.error?.message || linkErr.message);
            }
          }
        }
      }
    }

    console.log('\n🏁 [GA4 RECONCILE COMPLETE] Permissions restored successfully.');

  } catch (err: any) {
    console.error('💥 [CRITICAL FAILURE]:', err.message);
  }
}

run();
