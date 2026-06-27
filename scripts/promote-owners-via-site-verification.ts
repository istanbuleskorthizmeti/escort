import { google } from 'googleapis';
import { googleAuth } from '../lib/google-auth';

const TARGET_SERVICE_ACCOUNTS = [
  'e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com',
  'eimza-362@model-osprey-500119-v9.iam.gserviceaccount.com',
  'eimza-390@starry-hearth-500119-u2.iam.gserviceaccount.com'
];

async function run() {
  console.log('🚀 [GSC VERIFICATION PROMOTION] Running verified owner delegation...');

  try {
    const auth = await googleAuth.getAuthorizedClient();
    const siteVerification = google.siteVerification({
      version: 'v1',
      auth
    });

    console.log('📡 Fetching list of verified web resources...');
    const listRes = await siteVerification.webResource.list({});
    const items = listRes.data.items || [];
    console.log(`📋 Found ${items.length} verified web resources.`);

    for (const item of items) {
      const identifier = item.site?.identifier || '';
      const resourceId = item.id || '';
      
      // We target Google Sites in our workspace domain, or the specific ReadMe portal
      const isTarget = identifier.includes('sites.google.com/dorukcanay.digital') || 
                       identifier.includes('istanbul-escort.readme.io');
      
      if (!isTarget) {
        continue;
      }

      console.log(`\n⚙️ Processing resource: ${identifier} (ID: ${resourceId})`);
      const currentOwners = item.owners || [];
      console.log(`   Current owners:`, currentOwners);

      const ownersSet = new Set(currentOwners);
      let needsUpdate = false;

      for (const sa of TARGET_SERVICE_ACCOUNTS) {
        if (!ownersSet.has(sa)) {
          ownersSet.add(sa);
          needsUpdate = true;
          console.log(`   ➕ Adding: ${sa}`);
        }
      }

      if (needsUpdate) {
        const updatedOwners = Array.from(ownersSet);
        try {
          console.log(`   📡 Sending update request...`);
          const updateRes = await siteVerification.webResource.update({
            id: resourceId,
            requestBody: {
              site: item.site,
              owners: updatedOwners
            }
          });
          console.log(`   ✅ Success! Updated owners:`, updateRes.data.owners);
        } catch (err: any) {
          console.error(`   ❌ Failed to update owners:`, err.message);
        }
      } else {
        console.log(`   ℹ️ All target service accounts are already owners.`);
      }
    }

    console.log('\n🏁 [COMPLETED] GSC verified owner promotion process completed.');

  } catch (err: any) {
    console.error('💥 Critical error during owner promotion:', err.message);
  }
}

run();
