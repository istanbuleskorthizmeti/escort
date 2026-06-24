import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

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

  try {
    console.log('📡 Listing web resources from Site Verification API...');
    const res = await siteVerification.webResource.list();
    console.log('Result count:', res.data.items?.length || 0);
    console.log('Items:', JSON.stringify(res.data.items, null, 2));
  } catch (err: any) {
    console.error('❌ Error listing resources:', err.message);
  }
}

main();
