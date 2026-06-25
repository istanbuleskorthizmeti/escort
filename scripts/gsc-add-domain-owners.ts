import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const TARGET_RESOURCES = [
  {
    id: 'dns%3A%2F%2Fdorukcanay.digital',
    type: 'INET_DOMAIN',
    identifier: 'dorukcanay.digital',
    owners: [
      'dorukcanay1990@gmail.com',
      'sovereign-bot@strong-return-494114-c2.iam.gserviceaccount.com',
      'onurkarcck@gmail.com',
      'sovereign-spyy@karacocuk.iam.gserviceaccount.com',
      'info@dorukcanay.digital',
      'arap-640@karacocuk.iam.gserviceaccount.com'
    ]
  },
  {
    id: 'dns%3A%2F%2Fistanbulescort.blog',
    type: 'INET_DOMAIN',
    identifier: 'istanbulescort.blog',
    owners: [
      'info@dorukcanay.digital',
      'arap-640@karacocuk.iam.gserviceaccount.com',
      'sovereign-bot@strong-return-494114-c2.iam.gserviceaccount.com',
      'onurkarcck@gmail.com',
      'sovereign-spyy@karacocuk.iam.gserviceaccount.com'
    ]
  },
  {
    id: 'dns%3A%2F%2Fvipescorthizmeti.com',
    type: 'INET_DOMAIN',
    identifier: 'vipescorthizmeti.com',
    owners: [
      'sovereign-spyy@karacocuk.iam.gserviceaccount.com',
      'info@dorukcanay.digital',
      'eleman4@primal-prism-493708-i0.iam.gserviceaccount.com',
      'onurkarcck@gmail.com',
      'sovereign-bot@strong-return-494114-c2.iam.gserviceaccount.com'
    ]
  },
  {
    id: 'https%3A%2F%2Fistanbul-escort.readme.io%2F',
    type: 'SITE',
    identifier: 'https://istanbul-escort.readme.io/',
    owners: [
      'arap-640@karacocuk.iam.gserviceaccount.com',
      'hydra-ai-admin@vast-falcon-495301-g5.iam.gserviceaccount.com',
      'info@dorukcanay.digital',
      'sovereign-spyy@karacocuk.iam.gserviceaccount.com'
    ]
  },
  {
    id: 'https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F',
    type: 'SITE',
    identifier: 'https://istanbul-eskort-hizmeti.readme.io/',
    owners: [
      'arap-640@karacocuk.iam.gserviceaccount.com',
      'hydra-ai-admin@vast-falcon-495301-g5.iam.gserviceaccount.com',
      'info@dorukcanay.digital',
      'sovereign-spyy@karacocuk.iam.gserviceaccount.com'
    ]
  }
];

const SERVICE_ACCOUNTS = [
  'sovereign-spyy@karacocuk.iam.gserviceaccount.com',
  'hydra-ai-admin@vast-falcon-495301-g5.iam.gserviceaccount.com',
  'e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com',
  'eimza-362@model-osprey-500119-v9.iam.gserviceaccount.com',
  'eimza-390@starry-hearth-500119-u2.iam.gserviceaccount.com'
];

async function main() {
  const keyPath = path.join(process.cwd(), 'google-key-sovereign.json');
  if (!fs.existsSync(keyPath)) {
    console.error('Key file not found!');
    return;
  }
  const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

  const auth = new google.auth.JWT(
    keyData.client_email,
    null,
    keyData.private_key,
    ['https://www.googleapis.com/auth/siteverification']
  );

  const siteVerification = google.siteVerification({
    version: 'v1',
    auth
  });

  console.log('🚀 [DOMAINS OWNERSHIP UPDATE] Adding service accounts as verified domain owners...');

  for (const resource of TARGET_RESOURCES) {
    try {
      // Build updated list of owners (avoiding duplicates)
      const currentOwners = new Set(resource.owners);
      for (const sa of SERVICE_ACCOUNTS) {
        currentOwners.add(sa);
      }
      const updatedOwners = Array.from(currentOwners);

      console.log(`\n⚙️ Updating resource: ${resource.identifier} (${resource.id})...`);
      console.log(`   Owners target list:`, updatedOwners);

      const res = await siteVerification.webResource.update({
        id: resource.id,
        requestBody: {
          site: {
            identifier: resource.identifier,
            type: resource.type
          },
          owners: updatedOwners
        }
      });

      console.log(`   ✅ Success! Updated owners list in API:`, res.data.owners);
    } catch (err: any) {
      console.error(`   ❌ Failed updating resource ${resource.identifier}: ${err.message}`);
    }
  }

  console.log('\n🏁 [COMPLETED] Domain ownership propagation finished.');
}

main();
