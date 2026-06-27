import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

async function run() {
  const files = fs.readdirSync(process.cwd())
    .filter(f => f.endsWith('.json') || f.includes('.json.'));
  
  console.log("Found key files to test:", files);

  for (const file of files) {
    const keyPath = path.join(process.cwd(), file);
    try {
      const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      if (!keys.client_email || !keys.private_key) continue;

      console.log(`\nTesting key: ${file} (${keys.client_email})`);

      const auth = new JWT({
        email: keys.client_email,
        key: keys.private_key,
        scopes: [
          'https://www.googleapis.com/auth/webmasters.readonly',
          'https://www.googleapis.com/auth/analytics.readonly'
        ],
      });

      // Try to get token to verify signature
      await auth.authorize();
      console.log(`✅ JWT Signature VALID for ${file}`);

      // Now let's try to query Search Console sites
      try {
        const sc = google.searchconsole({ version: 'v1', auth });
        const res = await sc.sites.list();
        const sites = res.data.siteEntry || [];
        console.log(`  ✅ Search Console API enabled! Found ${sites.length} sites:`, sites.map(s => s.siteUrl));
      } catch (err: any) {
        console.log(`  ❌ Search Console API error:`, err.message);
      }

      // Try to query GA4 Properties list
      try {
        const analytics = google.analyticsdata({ version: 'v1beta', auth });
        // Try running a dummy report on property 536316143
        const gaRes = await analytics.properties.runReport({
          property: `properties/536316143`,
          requestBody: {
            dateRanges: [{ startDate: 'today', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }]
          }
        });
        console.log(`  ✅ GA4 API enabled! Data returned for property 536316143 successfully.`);
      } catch (err: any) {
        console.log(`  ❌ GA4 API error:`, err.message);
      }

    } catch (err: any) {
      console.log(`❌ Error for ${file}:`, err.message);
    }
  }
}

run();
