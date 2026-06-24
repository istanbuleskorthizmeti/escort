import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Load list of Google Sites
const sitesPath = path.join(process.cwd(), 'data', 'live_google_sites.json');
const sites: string[] = JSON.parse(fs.readFileSync(sitesPath, 'utf8'));

// Service Accounts to delegate as owners
const SERVICE_ACCOUNTS = [
  'sovereign-spyy@karacocuk.iam.gserviceaccount.com',
  'hydra-ai-admin@vast-falcon-495301-g5.iam.gserviceaccount.com',
  'e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com',
  'eimza-362@model-osprey-500119-v9.iam.gserviceaccount.com',
  'eimza-390@starry-hearth-500119-u2.iam.gserviceaccount.com'
];

async function run() {
  console.log('🚀 [GSC PERMISSION PROMOTION] Delegating owner status programmatically...');
  
  // We use sovereign-spyy or any valid credential with owner/admin scopes to verify/delegate.
  const keyPath = path.join(process.cwd(), 'google-key-sovereign.json');
  if (!fs.existsSync(keyPath)) {
    console.error('❌ google-key-sovereign.json not found!');
    return;
  }
  
  const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const auth = new google.auth.JWT(
    keyData.client_email,
    null,
    keyData.private_key,
    [
      'https://www.googleapis.com/auth/webmasters',
      'https://www.googleapis.com/auth/siteverification'
    ]
  );

  const webmasters = google.webmasters({
    version: 'v3',
    auth
  });

  for (const siteUrl of sites) {
    const siteUrlWithSlash = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
    console.log(`\n⚙️ Processing site: ${siteUrlWithSlash}`);
    
    for (const email of SERVICE_ACCOUNTS) {
      try {
        console.log(`   👥 Delegating Owner status to: ${email}...`);
        await webmasters.permissions.add({
          siteUrl: siteUrlWithSlash,
          requestBody: {
            role: 'owner',
            permission: 'owner',
            email: email
          }
        } as any);
        console.log(`   ✅ Success!`);
      } catch (err: any) {
        console.error(`   ❌ Failed delegation for ${email}: ${err.message}`);
      }
    }
  }
  
  console.log('\n🏁 [COMPLETED] Programmatic Search Console Owner promotion process completed.');
}

run();
