import { google } from 'googleapis';
import { googleAuth } from '../lib/google-auth';

async function checkGSC() {
  console.log('Fetching sites from Google Search Console...');
  try {
    const auth = await googleAuth.getAuthorizedClient();
    const webmasters = google.webmasters('v3');
    
    const res = await webmasters.sites.list({ auth });
    
    if (res.data.siteEntry && res.data.siteEntry.length > 0) {
      console.log(`\n✅ Found ${res.data.siteEntry.length} sites in Search Console:\n`);
      res.data.siteEntry.forEach(site => {
        console.log(`- ${site.siteUrl} (Permission: ${site.permissionLevel})`);
      });
    } else {
      console.log('\n❌ No sites found in Search Console for this account.');
    }
  } catch (err: any) {
    console.error('❌ Error fetching GSC sites:', err.message);
  }
}

checkGSC().catch(console.error).finally(() => process.exit());
