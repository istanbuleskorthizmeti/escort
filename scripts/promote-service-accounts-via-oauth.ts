import { google } from 'googleapis';
import { googleAuth } from '../lib/google-auth';
import fs from 'fs';
import path from 'path';

const SERVICE_ACCOUNTS = [
  'e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com',
  'eimza-362@model-osprey-500119-v9.iam.gserviceaccount.com',
  'eimza-390@starry-hearth-500119-u2.iam.gserviceaccount.com'
];

async function run() {
  console.log('🚀 [GSC OAUTH PROMOTION] Promoting service accounts to Owners using User OAuth...');

  const sitesPath = path.join(process.cwd(), 'data', 'live_google_sites.json');
  let sites: string[] = [];
  if (fs.existsSync(sitesPath)) {
    sites = JSON.parse(fs.readFileSync(sitesPath, 'utf8'));
  } else {
    sites = [
      "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa",
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
  }

  try {
    // This will try DB OAuth tokens first!
    const client = await googleAuth.getAuthorizedClient();
    const webmasters = google.webmasters({
      version: 'v3',
      auth: client
    });

    for (const siteUrl of sites) {
      const siteUrlWithSlash = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
      const baseSiteUrl = siteUrl.replace('/ana-sayfa', '').endsWith('/') 
        ? siteUrl.replace('/ana-sayfa', '') 
        : `${siteUrl.replace('/ana-sayfa', '')}/`;

      const targets = [siteUrlWithSlash, baseSiteUrl];

      for (const targetUrl of targets) {
        console.log(`\n⚙️ Target Property: ${targetUrl}`);
        
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
            console.error(`   ❌ Failed delegation for ${email}: ${err.message}`);
          }
        }
      }
    }

  } catch (err: any) {
    console.error('💥 Critical Error:', err.message);
  }
}

run();
