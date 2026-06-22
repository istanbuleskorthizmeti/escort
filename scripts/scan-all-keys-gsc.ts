import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

async function main() {
  const files = fs.readdirSync(process.cwd());
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  console.log(`🔍 Scanning all ${jsonFiles.length} JSON files in root for Google GSC credentials...`);

  for (const file of jsonFiles) {
    try {
      const keyPath = path.join(process.cwd(), file);
      const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

      if (!keys.client_email || !keys.private_key) {
        continue;
      }

      const auth = new JWT({
        email: keys.client_email,
        key: keys.private_key,
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
      });

      const sc = google.searchconsole('v1');
      const res = await sc.sites.list({ auth });
      const sites = (res.data.siteEntry || []).map(s => s.siteUrl).filter(Boolean);

      if (sites.length > 0) {
        console.log(`\n🔑 Key file: ${file}`);
        console.log(`   Email: ${keys.client_email}`);
        console.log(`   Verified Sites (${sites.length}):`);
        sites.forEach(s => console.log(`   - ${s}`));
      }
    } catch (err: any) {
      // Quiet fail if not a Google key
    }
  }
}

main().catch(console.error);
