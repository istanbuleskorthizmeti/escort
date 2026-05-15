import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function testDirect() {
  const keyPath = path.join(process.cwd(), 'hydra-gcp-key.json');
  const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

  console.log(`Checking Service Account: ${keyData.client_email}`);

  const auth = new google.auth.JWT(
    keyData.client_email,
    undefined,
    keyData.private_key,
    ['https://www.googleapis.com/auth/webmasters.readonly']
  );

  const sc = google.searchconsole({ version: 'v1', auth });

  try {
    const res = await sc.sites.list();
    console.log("SUCCESS! Sites found:", res.data.siteEntry?.length || 0);
    res.data.siteEntry?.forEach(s => console.log(` - ${s.siteUrl}`));
  } catch (err: any) {
    console.error("FAILURE:", err.response?.data || err.message);
  }
}

testDirect().then(() => process.exit(0));
