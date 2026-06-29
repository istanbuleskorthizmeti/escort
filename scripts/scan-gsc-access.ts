import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

const WORKING_KEYS = [
  'google-key-lyrical.json',
  'google-key-model-osprey.json',
  'google-key-starry.json',
];

async function scanKey(filename: string) {
  const keyPath = path.join(process.cwd(), filename);
  if (!fs.existsSync(keyPath)) {
    console.log(`[SKIP] ${filename} not found`);
    return;
  }
  const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const auth = new JWT({
    email: keyData.client_email,
    key: keyData.private_key.replace(/\\n/g, '\n').replace(/\r/g, ''),
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const sc = google.searchconsole({ version: 'v1', auth });

  console.log(`\n🔑 Scanning: ${filename} (${keyData.client_email})`);
  try {
    const res = await sc.sites.list();
    const sites = res.data.siteEntry || [];
    if (sites.length === 0) {
      console.log('  ❌ No GSC sites accessible.');
    } else {
      console.log(`  ✅ Accessible GSC sites (${sites.length}):`);
      for (const s of sites) {
        console.log(`     - ${s.siteUrl} [${s.permissionLevel}]`);
      }
    }
  } catch (err: any) {
    console.log(`  ❌ Error: ${err.message}`);
  }
}

async function run() {
  for (const k of WORKING_KEYS) {
    await scanKey(k);
  }
}

run().catch(console.error);
