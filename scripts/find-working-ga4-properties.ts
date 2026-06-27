import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

async function run() {
  const files = ['google-key-lyrical.json', 'google-key-model-osprey.json', 'google-key-starry.json'];

  for (const file of files) {
    const keyPath = path.join(process.cwd(), file);
    if (!fs.existsSync(keyPath)) continue;

    try {
      const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      console.log(`\n=== Finding accessible Accounts & Properties for ${file} (${keys.client_email}) ===`);

      const auth = new JWT({
        email: keys.client_email,
        key: keys.private_key,
        scopes: [
          'https://www.googleapis.com/auth/analytics.readonly',
          'https://www.googleapis.com/auth/analytics'
        ],
      });

      // Try Admin API to list properties
      // Note: We use analyticsadmin v1beta
      const analyticsadmin = google.analyticsadmin({ version: 'v1beta', auth });
      
      console.log("  Fetching accounts...");
      const accountsRes = await analyticsadmin.accounts.list();
      const accounts = accountsRes.data.accounts || [];
      console.log(`  Found ${accounts.length} accounts.`);
      
      for (const account of accounts) {
        console.log(`    Account: ${account.displayName} (${account.name})`);
        
        // List properties
        try {
          const propsRes = await analyticsadmin.properties.list({
            filter: `ancestor:${account.name}`
          });
          const props = propsRes.data.properties || [];
          console.log(`    Found ${props.length} properties:`);
          for (const p of props) {
            console.log(`      - Property: ${p.displayName} (${p.name})`);
          }
        } catch (e: any) {
          console.log(`    ❌ Error listing properties:`, e.message);
        }
      }

    } catch (err: any) {
      console.log(`❌ Error for ${file}:`, err.message);
    }
  }
}

run();
