import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function getAuth() {
  const keyFiles = fs.readdirSync(process.cwd())
    .filter(f => f.startsWith('google-key') && f.endsWith('.json'));

  for (const keyFile of keyFiles) {
    const keyData = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), keyFile), 'utf8'));
    if (keyData.private_key && !keyData.private_key.includes('PLACEHOLDER')) {
      try {
        const auth = new google.auth.JWT(
          keyData.client_email,
          undefined,
          keyData.private_key,
          [
            'https://www.googleapis.com/auth/business.manage',
            'https://www.googleapis.com/auth/plus.business.manage',
          ]
        );
        await auth.authorize();
        return auth;
      } catch (e: any) {
         console.warn("Auth warning for", keyFile, e.message);
      }
    }
  }
  return null;
}

async function run() {
    const auth = await getAuth();
    if (!auth) {
        console.log("No auth");
        return;
    }
    const token = await auth.getAccessToken();
    const res = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
        headers: { Authorization: `Bearer ${token.token}` }
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}
run();
