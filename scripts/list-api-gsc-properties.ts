import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function run() {
  const keyPath = path.join(process.cwd(), 'google-key-lyrical.json');
  const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: keyData.client_email,
      private_key: keyData.private_key.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({
    version: 'v1',
    auth,
  });

  try {
    console.log("📡 Fetching list of GSC properties via Search Console API...");
    const res = await searchconsole.sites.list({});
    const sites = res.data.siteEntry || [];
    console.log(`📋 Found ${sites.length} properties:`);
    sites.forEach(s => {
      console.log(`- URL: ${s.siteUrl} (Permission Level: ${s.permissionLevel})`);
    });
  } catch (err: any) {
    console.error("❌ Error fetching sites:", err.message);
  }
}

run();
