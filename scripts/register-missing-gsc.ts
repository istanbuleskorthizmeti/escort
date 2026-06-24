import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { DOMAIN_MATRIX } from '../config/domains';

dotenv.config();

async function getAuthenticatedClient() {
  let keyPath = path.join(process.cwd(), 'google-key-sovereign.json');
  if (!fs.existsSync(keyPath)) {
    keyPath = path.join(process.cwd(), 'google-key.json');
  }

  if (!fs.existsSync(keyPath)) {
    throw new Error('❌ Missing Service Account credentials.');
  }

  const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const auth = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters'],
  });

  return { auth, clientEmail: keys.client_email };
}

async function registerMissingDomains() {
  console.log('⚡ [GSC REGISTRATION] Initializing Search Console Sync...');
  
  try {
    const { auth } = await getAuthenticatedClient();
    const sc = google.searchconsole({ version: 'v1', auth });

    console.log('📡 Fetching existing Search Console properties...');
    const sitesRes = await sc.sites.list();
    const verifiedSites = new Set(
      (sitesRes.data.siteEntry || [])
        .map(s => s.siteUrl?.toLowerCase().trim())
        .filter(Boolean)
    );

    console.log(`✅ Found ${verifiedSites.size} existing properties in Search Console.`);

    // 1. Gather missing domain matrix sites
    const missingDomains = DOMAIN_MATRIX.filter(site => {
      const domain = site.host.toLowerCase().trim();
      const potentialGscUrls = [
        `sc-domain:${domain}`,
        `https://${domain}/`,
        `http://${domain}/`
      ];
      return !potentialGscUrls.some(url => verifiedSites.has(url));
    }).map(site => `sc-domain:${site.host.toLowerCase().trim()}`);

    // 2. Gather missing Google Sites from live_google_sites.json
    const googleSitesPath = path.join(process.cwd(), 'data', 'live_google_sites.json');
    const missingGoogleSites: string[] = [];
    if (fs.existsSync(googleSitesPath)) {
      const googleSites: string[] = JSON.parse(fs.readFileSync(googleSitesPath, 'utf-8'));
      for (const siteUrl of googleSites) {
        // Clean URL: remove /ana-sayfa and ensure trailing slash
        let cleanUrl = siteUrl.replace(/\/ana-sayfa$/, '');
        if (!cleanUrl.endsWith('/')) {
          cleanUrl = `${cleanUrl}/`;
        }
        cleanUrl = cleanUrl.toLowerCase().trim();
        if (!verifiedSites.has(cleanUrl)) {
          missingGoogleSites.push(cleanUrl);
        }
      }
    }

    const allMissing = [...missingDomains, ...missingGoogleSites];

    if (allMissing.length === 0) {
      console.log('✔ All fleet domains and Google Sites are already registered in Google Search Console.');
      return;
    }

    console.log(`🚀 Found ${allMissing.length} missing properties to register. Starting registration...`);

    for (const siteUrl of allMissing) {
      console.log(`📡 Adding missing property: ${siteUrl}`);
      try {
        await sc.sites.add({ siteUrl });
        console.log(`   ✅ Successfully added: ${siteUrl}`);
      } catch (err: any) {
        console.error(`   ❌ Failed to add ${siteUrl}:`, err.message);
      }

      // 10-second delay between additions to avoid Google request-per-minute limits
      console.log('⏳ Waiting 10 seconds to respect API rate limits...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    console.log('🏁 [FINISHED] Missing GSC registration complete.');
  } catch (err: any) {
    console.error('💥 Fatal error during GSC Sync:', err.message);
  }
}

registerMissingDomains();
