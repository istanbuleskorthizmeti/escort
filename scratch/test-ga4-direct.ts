import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function testGA4() {
  const keyPath = path.join(process.cwd(), 'hydra-gcp-key.json');
  const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

  console.log(`Checking GA4 Access for: ${keyData.client_email}`);

  const auth = new google.auth.JWT(
    keyData.client_email,
    undefined,
    keyData.private_key,
    ['https://www.googleapis.com/auth/analytics.readonly']
  );

  const analytics = google.analyticsadmin({ version: 'v1alpha', auth });

  try {
    const res = await analytics.accounts.list();
    console.log("SUCCESS! GA4 Accounts found:", res.data.accounts?.length || 0);
    res.data.accounts?.forEach(a => console.log(` - ${a.displayName} (${a.name})`));
  } catch (err: any) {
    console.error("FAILURE:", err.response?.data || err.message);
  }
}

testGA4().then(() => process.exit(0));
