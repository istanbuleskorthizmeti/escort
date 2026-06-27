import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

async function run() {
  const files = ['google-key-lyrical.json', 'google-key-model-osprey.json', 'google-key-starry.json'];

  for (const file of files) {
    const keyPath = path.join(process.cwd(), file);
    if (!fs.existsSync(keyPath)) continue;

    try {
      const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      const projectId = keys.project_id;
      console.log(`\n=== Enabling APIs for project: ${projectId} using ${file} ===`);

      // We need Service Usage scope
      const auth = new JWT({
        email: keys.client_email,
        key: keys.private_key,
        scopes: [
          'https://www.googleapis.com/auth/cloud-platform',
          'https://www.googleapis.com/auth/service.management'
        ],
      });

      const serviceusage = google.serviceusage({ version: 'v1', auth });

      const apis = ['searchconsole.googleapis.com', 'analyticsdata.googleapis.com', 'analyticsadmin.googleapis.com'];

      for (const api of apis) {
        console.log(`  Enabling API ${api}...`);
        try {
          const res = await serviceusage.services.enable({
            name: `projects/${projectId}/services/${api}`
          });
          console.log(`    ✅ Successfully enabled (or queued) ${api}:`, res.data);
        } catch (err: any) {
          console.log(`    ❌ Failed to enable ${api}:`, err.message);
        }
      }

    } catch (err: any) {
      console.log(`❌ Error for ${file}:`, err.message);
    }
  }
}

run();
