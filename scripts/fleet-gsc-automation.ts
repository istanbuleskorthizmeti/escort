import dotenv from 'dotenv';
dotenv.config();

import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { googleAuth } from '../lib/google-auth';
import { DOMAIN_MATRIX } from '../config/domains';

interface GscClient {
  fileName: string;
  email: string;
  auth: any;
  verifiedSites: string[];
  indexingQuotaExceeded?: boolean;
}

async function runFleetAutomation() {
  const isDripFeed = process.env.DRIP_FEED === 'true';
  const gscClients: GscClient[] = [];

  console.log("🔒 [AUTH] Checking database for OAuth2 User Tokens...");
  try {
    const userTokens = await googleAuth.getTokens();
    if (userTokens) {
      const auth = await googleAuth.getAuthorizedClient();
      const sc = google.searchconsole({ version: 'v1', auth });
      const sitesRes = await sc.sites.list();
      const verifiedSites = (sitesRes.data.siteEntry || []).map(s => s.siteUrl).filter(Boolean) as string[];
      
      gscClients.push({
        fileName: 'database-oauth2-user-token',
        email: 'User Account (OAuth2)',
        auth,
        verifiedSites,
        indexingQuotaExceeded: false
      });
      console.log(`🔑 Key loaded: OAuth2 User Token | Verified sites: ${verifiedSites.length}`);
    }
  } catch (err: any) {
    console.warn(`⚠️ Failed to initialize OAuth2 User Token: ${err.message}`);
  }

  console.log("🔒 [AUTH] Scanning and initializing all Google API keys...");

  const files = fs.readdirSync(process.cwd());
  const keyFiles = files.filter(f => 
    f.endsWith('.json') && 
    (f.startsWith('google-key') || f.startsWith('hydra-gcp-key') || f.includes('-key'))
  );

  console.log(`🔍 Found ${keyFiles.length} potential key files in workspace.`);

  for (const file of keyFiles) {
    try {
      const keyPath = path.join(process.cwd(), file);
      const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

      if (!keys.client_email || !keys.private_key) {
        console.warn(`⚠️ Key file ${file} is invalid (missing client_email or private_key).`);
        continue;
      }

      const auth = new JWT({
        email: keys.client_email,
        key: keys.private_key,
        scopes: [
          'https://www.googleapis.com/auth/webmasters',
          'https://www.googleapis.com/auth/indexing'
        ],
      });

      // Test authentication & fetch verified sites
      const sc = google.searchconsole({ version: 'v1', auth });
      const sitesRes = await sc.sites.list();
      const verifiedSites = (sitesRes.data.siteEntry || []).map(s => s.siteUrl).filter(Boolean) as string[];

      gscClients.push({
        fileName: file,
        email: keys.client_email,
        auth,
        verifiedSites,
        indexingQuotaExceeded: false
      });

      console.log(`🔑 Key loaded: ${file} (${keys.client_email}) | Verified sites: ${verifiedSites.length} -> ${JSON.stringify(verifiedSites)}`);
    } catch (err: any) {
      console.warn(`⚠️ Failed to initialize key file ${file}: ${err.message}`);
    }
  }

  if (gscClients.length === 0) {
    console.error("❌ No valid Google Search Console clients could be authenticated.");
    process.exit(1);
  }

  const targetDomains = DOMAIN_MATRIX.filter(d => d.role === 'MONEY_SITE' || d.role === 'SATELLITE');
  console.log(`📋 Fleet has ${targetDomains.length} target domains configured. Starting processing...`);

  for (const target of targetDomains) {
    let activeClient: GscClient | null = null;
    let activeSiteUrl = '';

    const potentialGscUrls = [
      `sc-domain:${target.host}`,
      `https://${target.host}/`,
      `http://${target.host}/`
    ];

    // Find a client that has verified this site
    for (const client of gscClients) {
      const match = client.verifiedSites.find(url => potentialGscUrls.includes(url.toLowerCase().trim()));
      if (match) {
        activeClient = client;
        activeSiteUrl = match;
        break;
      }
    }

    if (!activeClient) {
      console.log(`⚠️ Domain ${target.host} is not verified/accessible under any loaded GSC account key.`);
      continue;
    }

    console.log(`\n========================================`);
    console.log(`🌐 Fleet Domain: ${target.host}`);
    console.log(`🔑 GSC Client: ${activeClient.fileName} (${activeClient.email})`);
    console.log(`🌍 GSC Property: ${activeSiteUrl}`);
    console.log(`========================================`);

    const sc = google.searchconsole({ version: 'v1', auth: activeClient.auth });
    const indexing = google.indexing({ version: 'v3', auth: activeClient.auth });

    // 1. Sitemap & RSS Feed Submission Bypass
    // We submit both sitemaps and feed.xml to force Googlebot crawling without API quota consumption
    const feedsToSubmit = [
      `https://${target.host}/sitemap-index.xml`,
      `https://${target.host}/sitemap.xml`,
      `https://${target.host}/feed.xml`,
      `https://${target.host}/rss`
    ];

    for (const feedUrl of feedsToSubmit) {
      console.log(`   📡 Checking Feed: ${feedUrl}`);
      try {
        const sitemapsList = await sc.sitemaps.list({
          siteUrl: activeSiteUrl
        });

        const sitemaps = sitemapsList.data.sitemap || [];
        const existingSitemap = sitemaps.find(s => s.path?.toLowerCase().includes(feedUrl.toLowerCase()));

        if (!existingSitemap) {
          console.log(`      ➕ Feed not found in GSC. Submitting...`);
          await sc.sitemaps.submit({
            siteUrl: activeSiteUrl,
            feedpath: feedUrl
          });
          console.log(`      ✅ Submitted feed successfully.`);
        } else {
          const sitemapAny = existingSitemap as any;
          console.log(`      ✔ Feed already registered. Last Crawled: ${sitemapAny.lastCrawlTime || 'Never'} | Status: ${sitemapAny.errors ? `Errors: ${sitemapAny.errors}` : 'OK'}`);
          
          // Re-submit to trigger crawl
          console.log(`      🔄 Re-submitting feed to trigger Googlebot crawl...`);
          await sc.sitemaps.submit({
            siteUrl: activeSiteUrl,
            feedpath: feedUrl
          });
          console.log(`      ✅ Re-submitted feed.`);
        }
      } catch (feedErr: any) {
        console.error(`      ❌ Feed sitemap submission failed for ${feedUrl}:`, feedErr.message);
      }
    }

    // 2. URL Inspection & Selective Indexing API Request
    const citySlug = target.targetCity || 'istanbul';
    const urlsToInspect = [
      `https://${target.host}/`,
      `https://${target.host}/${citySlug}`,
      `https://${target.host}/amp`,
      `https://${target.host}/amp?loc=${citySlug}`,
    ];
    if (target.targetDistrict) {
      urlsToInspect.push(`https://${target.host}/${citySlug}/${target.targetDistrict}`);
      urlsToInspect.push(`https://${target.host}/amp?loc=${target.targetDistrict}`);
    }

    for (const url of urlsToInspect) {
      console.log(`   🔍 Inspecting: ${url}`);
      try {
        const res = await sc.urlInspection.index.inspect({
          requestBody: {
            inspectionUrl: url,
            siteUrl: activeSiteUrl,
            languageCode: 'tr'
          }
        });

        const result = res.data.inspectionResult;
        if (result && result.indexStatusResult) {
          const status = result.indexStatusResult;
          console.log(`      Verdict: [${status.verdict}] | Coverage: [${status.coverageState || 'N/A'}]`);
          console.log(`      Google Canonical: ${status.googleCanonical || 'None'}`);

          if (status.verdict !== 'PASS') {
            const eligibleClients = gscClients.filter(c => 
              c.verifiedSites.find(vUrl => potentialGscUrls.includes(vUrl.toLowerCase().trim())) &&
              !c.indexingQuotaExceeded
            );

            if (eligibleClients.length === 0) {
              console.log(`      ⏭️ [SKIP] All GSC clients verified for this site have exceeded their indexing quota.`);
            } else {
              let requestSuccessful = false;
              for (const client of eligibleClients) {
                console.log(`      🚀 [INDEXING API] Requesting re-index for: ${url} using ${client.email}`);
                try {
                  const clientIndexing = google.indexing({ version: 'v3', auth: client.auth });
                  const indexRes = await clientIndexing.urlNotifications.publish({
                    requestBody: {
                      url,
                      type: 'URL_UPDATED'
                    }
                  });
                  console.log(`      ✅ API Success (status: ${indexRes.status}) using ${client.email}`);
                  requestSuccessful = true;
                  break;
                } catch (indexErr: any) {
                  if (indexErr.message.includes('Quota exceeded') || indexErr.code === 429) {
                    console.log(`      ⚠️ Indexing API Quota Exceeded for client ${client.email}! Rotating to next client.`);
                    client.indexingQuotaExceeded = true;
                  } else {
                    console.error(`      ❌ Indexing request failed for client ${client.email}:`, indexErr.message);
                  }
                }
              }
              if (!requestSuccessful) {
                console.log(`      ❌ Could not request indexing for ${url} (all client accounts failed or exhausted).`);
              }
            }
          }
        }
      } catch (inspectErr: any) {
        console.error(`      ❌ Inspection query failed:`, inspectErr.message);
      }
      
      const urlDelay = isDripFeed 
        ? Math.floor(Math.random() * (30000 - 10000 + 1) + 10000) 
        : 500;
      await new Promise(resolve => setTimeout(resolve, urlDelay));
    }

    if (isDripFeed && targetDomains.indexOf(target) < targetDomains.length - 1) {
      const domainDelay = Math.floor(Math.random() * (180000 - 60000 + 1) + 60000);
      console.log(`⏳ [SCHEDULER] Drip-feeding: Sleeping for ${(domainDelay / 60000).toFixed(1)} minutes before the next domain...`);
      await new Promise(resolve => setTimeout(resolve, domainDelay));
    }
  }

  console.log(`\n🎉 Fleet GSC Automation completed.`);
}

runFleetAutomation().catch(err => {
  console.error("💥 Critical Failure in Fleet GSC Automation:", err.message);
});
