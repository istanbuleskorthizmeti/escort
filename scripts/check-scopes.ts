import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function checkScopes() {
  const keyFiles = [
    'google-key-sovereign.json',
    'google-key.json',
    'google-key-strong-return.json',
    'google-key-strong-return-v2.json',
    'hydra-gcp-key.json'
  ];

  for (const file of keyFiles) {
    const keyPath = path.join(process.cwd(), file);
    if (!fs.existsSync(keyPath)) {
      console.log(`❌ ${file} does not exist locally.`);
      continue;
    }
    
    try {
      const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      const auth = new JWT({
        email: keys.client_email,
        key: keys.private_key,
        scopes: ['https://www.googleapis.com/auth/indexing']
      });
      
      const token = await auth.getAccessToken();
      console.log(`✅ ${file} (${keys.client_email}) successfully authenticated. Project ID: ${keys.project_id}`);
    } catch (err: any) {
      console.error(`❌ ${file} failed to authenticate:`, err.message);
    }
  }
}

checkScopes();
