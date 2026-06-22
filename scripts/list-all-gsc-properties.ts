import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const keyPath = path.join(process.cwd(), 'google-key.json');
  if (!fs.existsSync(keyPath)) {
    console.error("google-key.json not found!");
    return;
  }
  const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const auth = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const sc = google.searchconsole('v1');
  const res = await sc.sites.list({ auth });
  console.log("VERIFIED_SITES:", res.data.siteEntry);
}

main().catch(console.error);
