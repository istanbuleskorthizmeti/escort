import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const TARGET_SITES = [
  'https://dorukcanay.digital/',
  'sc-domain:dorukcanay.digital',
  'https://istanbul-eskort-hizmeti.readme.io/',
  'sc-domain:istanbul-eskort-hizmeti.readme.io',
  'https://istanbul-escort.readme.io/',
  'sc-domain:istanbul-escort.readme.io'
];

async function run() {
  console.log('📡 Starting Target Sitemap/Feed Submission Engine...');

  const files = fs.readdirSync(process.cwd());
  const keyFiles = files.filter(f => 
    f.endsWith('.json') && 
    (f.startsWith('google-key') || f.startsWith('hydra-gcp-key') || f.includes('-key'))
  );

  console.log(`🔑 Found ${keyFiles.length} JSON key files in workspace.`);

  for (const file of keyFiles) {
    console.log(`\n🔑 Processing Key File: ${file}...`);
    try {
      const keys = JSON.parse(fs.readFileSync(path.join(process.cwd(), file), 'utf8'));
      if (!keys.client_email || !keys.private_key) {
        console.log(`   ⚠️ Invalid key structure. Skipping.`);
        continue;
      }

      const auth = new JWT({
        email: keys.client_email,
        key: keys.private_key,
        scopes: ['https://www.googleapis.com/auth/webmasters'],
      });

      const sc = google.searchconsole({ version: 'v1', auth });
      const sitesRes = await sc.sites.list();
      const verifiedSites = (sitesRes.data.siteEntry || []).map(s => s.siteUrl || '');

      if (verifiedSites.length === 0) {
        console.log(`   ℹ️ No verified sites found for this key.`);
        continue;
      }

      console.log(`   ✅ Verified sites for this key:`, verifiedSites);

      for (const site of verifiedSites) {
        const matchingTarget = TARGET_SITES.find(t => t.toLowerCase().trim() === site.toLowerCase().trim());
        if (matchingTarget) {
          console.log(`   🎯 Match found: ${site}`);
          
          if (site.includes('dorukcanay.digital')) {
            // Submit sitemaps and feeds for dorukcanay.digital
            const feeds = [
              'https://dorukcanay.digital/sitemap-readme.xml',
              'https://dorukcanay.digital/feed-readme.xml',
              'https://dorukcanay.digital/sitemap.xml'
            ];
            for (const feed of feeds) {
              try {
                console.log(`      ⏳ Submitting sitemap ${feed} to ${site}...`);
                await sc.sitemaps.submit({ siteUrl: site, feedpath: feed });
                console.log(`      ✅ Submitted!`);
              } catch (submitErr: any) {
                console.error(`      ❌ Submission failed:`, submitErr.message);
              }
            }
          } else if (site.includes('readme.io')) {
            // Dynamically construct correct same-domain sitemap URL
            const cleanHost = site.replace('sc-domain:', '').replace('https://', '').replace('http://', '').replace(/\//g, '');
            const sitemaps = [
              `https://${cleanHost}/sitemap.xml`
            ];
            for (const sitemap of sitemaps) {
              try {
                console.log(`      ⏳ Submitting sitemap ${sitemap} to ${site}...`);
                await sc.sitemaps.submit({ siteUrl: site, feedpath: sitemap });
                console.log(`      ✅ Submitted!`);
              } catch (submitErr: any) {
                console.error(`      ❌ Submission failed:`, submitErr.message);
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.error(`   ❌ Error verifying with key file ${file}:`, err.message);
    }
  }
}

run().catch(console.error);
