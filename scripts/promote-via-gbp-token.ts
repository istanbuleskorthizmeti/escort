import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

const SERVICE_ACCOUNTS = [
  'e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com',
  'eimza-362@model-osprey-500119-v9.iam.gserviceaccount.com',
  'eimza-390@starry-hearth-500119-u2.iam.gserviceaccount.com',
  'sovereign-spyy@karacocuk.iam.gserviceaccount.com'
];

const googleSites = [
  "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa?read_current=1",
  "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v/ana-sayfa"
];

async function run() {
  const token = process.env.GBP_ACCESS_TOKEN;
  if (!token) {
    console.error('❌ GBP_ACCESS_TOKEN not found in env!');
    return;
  }

  console.log('📡 Initializing OAuth client with GBP_ACCESS_TOKEN...');
  const oauthClient = new google.auth.OAuth2();
  oauthClient.setCredentials({ access_token: token });

  const webmasters = google.webmasters({
    version: 'v3',
    auth: oauthClient
  });

  console.log('📡 Testing token by listing sites...');
  try {
    const listRes = await webmasters.sites.list();
    console.log(`✅ Token is valid! Found ${listRes.data.siteEntry?.length || 0} sites in GSC.`);
  } catch (err: any) {
    console.error('❌ Token is invalid or expired:', err.message);
    return;
  }

  for (const siteUrl of googleSites) {
    const cleanUrl = siteUrl.split('?')[0];
    const siteUrlWithSlash = cleanUrl.endsWith('/') ? cleanUrl : `${cleanUrl}/`;
    const baseSiteUrl = cleanUrl.replace('/ana-sayfa', '').endsWith('/') 
      ? cleanUrl.replace('/ana-sayfa', '') 
      : `${cleanUrl.replace('/ana-sayfa', '')}/`;

    const targets = [siteUrlWithSlash, baseSiteUrl];

    for (const targetUrl of targets) {
      console.log(`\n⚙️ Processing target: ${targetUrl}`);
      for (const email of SERVICE_ACCOUNTS) {
        try {
          console.log(`   👥 Delegating Owner status to: ${email}...`);
          await webmasters.permissions.add({
            siteUrl: targetUrl,
            requestBody: {
              role: 'owner',
              permission: 'owner',
              email: email
            }
          } as any);
          console.log(`   ✅ Success!`);
        } catch (err: any) {
          console.error(`   ❌ Failed for ${email}:`, err.message);
        }
      }
    }
  }

  // Also include the money domains
  const moneyDomains = [
    'https://dorukcanay.digital/',
    'https://istanbulescort.blog/'
  ];

  for (const targetUrl of moneyDomains) {
    console.log(`\n⚙️ Processing money site target: ${targetUrl}`);
    for (const email of SERVICE_ACCOUNTS) {
      try {
        console.log(`   👥 Delegating Owner status to: ${email}...`);
        await webmasters.permissions.add({
          siteUrl: targetUrl,
          requestBody: {
            role: 'owner',
            permission: 'owner',
            email: email
          }
        } as any);
        console.log(`   ✅ Success!`);
      } catch (err: any) {
        console.error(`   ❌ Failed for ${email}:`, err.message);
      }
    }
  }
}

run().catch(console.error);
