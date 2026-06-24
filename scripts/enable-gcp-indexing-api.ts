import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function main() {
  const localFiles = fs.readdirSync(process.cwd());
  const keyFiles = localFiles.filter(f => 
    f.endsWith('.json') && 
    (f.startsWith('google-key') || f.startsWith('hydra-gcp') || f.startsWith('sovereign-spyy'))
  );

  console.log(`🔍 Found ${keyFiles.length} keys to check.`);

  for (const file of keyFiles) {
    try {
      const keyData = JSON.parse(fs.readFileSync(path.join(process.cwd(), file), 'utf8'));
      if (!keyData.private_key || !keyData.client_email) continue;

      console.log(`\n⚙️ Processing key: ${file} (Project: ${keyData.project_id})...`);
      
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: keyData.client_email,
          private_key: keyData.private_key.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });

      const serviceusage = google.serviceusage({
        version: 'v1',
        auth,
      });

      console.log(`📡 Enabling indexing.googleapis.com API...`);
      const operation = await serviceusage.services.enable({
        name: `projects/${keyData.project_id}/services/indexing.googleapis.com`
      });

      console.log(`✅ API enablement requested. Status: ${operation.statusText || 'Pending'}`);
    } catch (err: any) {
      console.error(`❌ Error enabling API for key ${file}:`, err.message);
    }
  }
}

main();
