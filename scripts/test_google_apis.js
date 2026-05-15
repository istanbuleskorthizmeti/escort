const { googleAuth } = require('../lib/google-auth');
const { google } = require('googleapis');

async function testAPIs() {
  try {
    console.log('🔍 [TEST] Testing Google Authorized Client...');
    const auth = await googleAuth.getAuthorizedClient();
    console.log('✅ [AUTH] Client obtained successfully.');

    // 1. Test Search Console
    console.log('\n📡 [GSC] Testing Search Console API (Site List)...');
    const searchconsole = google.searchconsole({ version: 'v1', auth });
    try {
      const sites = await searchconsole.sites.list();
      console.log(`✅ [GSC] Found ${sites.data.siteEntry?.length || 0} sites.`);
      if (sites.data.siteEntry) {
        sites.data.siteEntry.take(3).forEach(s => console.log(`   - ${s.siteUrl}`));
      }
    } catch (err) {
      console.error('❌ [GSC] Search Console API Failed:', err.message);
    }

    // 2. Test GA4 (Analytics Data API)
    console.log('\n📊 [GA4] Testing Analytics Data API (Properties List)...');
    const analyticsadmin = google.analyticsadmin({ version: 'v1alpha', auth });
    try {
      // Need to find account ID or iterate
      const accounts = await analyticsadmin.accounts.list();
      console.log(`✅ [GA4] Found ${accounts.data.accounts?.length || 0} accounts.`);
      if (accounts.data.accounts) {
        accounts.data.accounts.forEach(a => console.log(`   - Account: ${a.displayName} (${a.name})`));
      }
    } catch (err) {
      console.error('❌ [GA4] Analytics Data API Failed:', err.message);
    }

    // 3. Test Indexing API
    console.log('\n🚀 [INDEXING] Testing Indexing API (Get Status for homepage)...');
    const indexing = google.indexing({ version: 'v3', auth });
    try {
      const url = 'https://vipescorthizmeti.com/';
      const status = await indexing.urlNotifications.getMetadata({ url });
      console.log(`✅ [INDEXING] Status for ${url}:`, status.data.latestUpdate?.type);
    } catch (err) {
      console.warn('⚠️ [INDEXING] Indexing API Failed (Might be permission issue for specific URL):', err.message);
    }

  } catch (err) {
    console.error('❌ [CRITICAL] Google API Test Failed:', err.message);
  }
}

testAPIs();
