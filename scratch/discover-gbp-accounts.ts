import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function listAccounts() {
  const keyFile = path.join(process.cwd(), 'config/service-account.json');
  const keyData = JSON.parse(fs.readFileSync(keyFile, 'utf8'));

  const auth = new google.auth.JWT(
    keyData.client_email,
    undefined,
    keyData.private_key,
    ['https://www.googleapis.com/auth/business.manage']
  );

  await auth.authorize();
  const token = (await auth.getAccessToken()).token;

  console.log("🔑 Auth Başarılı. Hesaplar listeleniyor...");

  const res = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  console.log("📊 API Yanıtı:", JSON.stringify(data, null, 2));
}

listAccounts().catch(console.error);
