const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

async function testWithServiceAccount() {
  const keyPath = path.join(process.cwd(), 'hydra-gcp-key.json');
  if (!fs.existsSync(keyPath)) {
    console.error('❌ google-key.json not found!');
    return;
  }

  const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const auth = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/indexing'
    ],
  });

  console.log(`🔍 [TEST] Using Service Account: ${keys.client_email}`);

  // 1. Test GSC
  console.log('\n📡 [GSC] Testing Search Console...');
  const searchconsole = google.searchconsole({ version: 'v1', auth });
  try {
    const sites = await searchconsole.sites.list();
    console.log(`✅ [GSC] Success! Found ${sites.data.siteEntry?.length || 0} sites.`);
    (sites.data.siteEntry || []).forEach(s => console.log(`   - ${s.siteUrl}`));
  } catch (err) {
    console.error('❌ [GSC] Failed:', err.message);
  }

  // 2. Test GA4 (Analytics Data API)
  console.log('\n📊 [GA4] Testing Analytics Data API (Run Report)...');
  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
  const propertyId = '389963655'; // From .env
  try {
    const res = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'city' }],
        metrics: [{ name: 'activeUsers' }],
      },
    });
    console.log(`✅ [GA4] Success! Rows found: ${res.data.rows?.length || 0}`);
  } catch (err) {
    console.error('❌ [GA4] Failed:', err.message);
  }
}

testWithServiceAccount();
