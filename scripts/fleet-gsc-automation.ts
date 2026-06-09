import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { DOMAIN_MATRIX } from '../config/domains';

async function runFleetAutomation() {
  console.log("🔒 [AUTH] Initializing Google APIs...");
  const keyPath = path.join(process.cwd(), 'google-key.json');
  if (!fs.existsSync(keyPath)) {
    console.error("❌ google-key.json not found!");
    process.exit(1);
  }

  const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const auth = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters', 'https://www.googleapis.com/auth/indexing'],
  });

  const sc = google.searchconsole('v1');
  const indexing = google.indexing({ version: 'v3', auth });

  try {
    console.log("📡 Fetching verified sites from Search Console...");
    const sitesRes = await sc.sites.list({ auth });
    const verifiedSites = (sitesRes.data.siteEntry || []).map(s => s.siteUrl).filter(Boolean) as string[];
    console.log(`✅ Found ${verifiedSites.length} verified sites in GSC.`);

    const targetDomains = DOMAIN_MATRIX.filter(d => d.role === 'MONEY_SITE' || d.role === 'SATELLITE');
    console.log(`📋 Fleet has ${targetDomains.length} target domains configured.`);

    let quotaExceeded = false;

    for (const target of targetDomains) {
      const gscSiteUrls = [
        `sc-domain:${target.host}`,
        `https://${target.host}/`
      ];

      const activeSiteUrl = verifiedSites.find(url => gscSiteUrls.includes(url));

      if (!activeSiteUrl) {
        console.log(`⚠️ Domain ${target.host} is not verified/accessible under this GSC account.`);
        continue;
      }

      console.log(`\n========================================`);
      console.log(`🌐 Fleet Domain: ${target.host} (${activeSiteUrl})`);
      console.log(`========================================`);

      // 1. Sitemap Management
      const sitemapUrl = `https://${target.host}/sitemap.xml`;
      console.log(`   检查 SiteMap: ${sitemapUrl}`);
      try {
        const sitemapsList = await sc.sitemaps.list({
          auth,
          siteUrl: activeSiteUrl
        });

        const sitemaps = sitemapsList.data.sitemap || [];
        const existingSitemap = sitemaps.find(s => s.path?.includes('sitemap.xml'));

        if (!existingSitemap) {
          console.log(`   ➕ Sitemap not found in GSC. Submitting...`);
          await sc.sitemaps.submit({
            auth,
            siteUrl: activeSiteUrl,
            feedpath: sitemapUrl
          });
          console.log(`   ✅ Submitted sitemap successfully.`);
        } else {
          console.log(`   ✔ Sitemap is already registered in GSC.`);
          console.log(`     Last crawled: ${existingSitemap.lastCrawlTime || 'Never'}`);
          console.log(`     Total pages: ${existingSitemap.contents?.[0]?.submitted || 0}`);
          console.log(`     Status: ${existingSitemap.errors ? `Errors: ${existingSitemap.errors}` : 'OK'}`);
          
          // Re-submit if it has errors or was never crawled
          if (!existingSitemap.lastCrawlTime || Number(existingSitemap.errors) > 0) {
            console.log(`   🔄 Sitemap has errors or wasn't crawled. Re-submitting...`);
            await sc.sitemaps.submit({
              auth,
              siteUrl: activeSiteUrl,
              feedpath: sitemapUrl
            });
            console.log(`   ✅ Re-submitted sitemap.`);
          }
        }
      } catch (sitemapErr: any) {
        console.error(`   ❌ Sitemap management failed for ${target.host}:`, sitemapErr.message);
      }

      // 2. URL Inspection & Selective Index Request
      const urlsToInspect = [
        `https://${target.host}/`,
        `https://${target.host}/istanbul`,
      ];
      if (target.targetDistrict) {
        urlsToInspect.push(`https://${target.host}/istanbul/${target.targetDistrict}`);
      }

      for (const url of urlsToInspect) {
        console.log(`   🔍 Inspecting: ${url}`);
        try {
          const res = await sc.urlInspection.index.inspect({
            auth,
            requestBody: {
              inspectionUrl: url,
              siteUrl: activeSiteUrl,
              languageCode: 'tr'
            }
          });

          const result = res.data.inspectionResult;
          if (result && result.indexStatusResult) {
            const status = result.indexStatusResult;
            console.log(`     Verdict: [${status.verdict}] Coverage: [${status.coverageState || 'N/A'}]`);
            console.log(`     User Canonical: ${status.userCanonical || 'None'}`);
            console.log(`     Google Canonical: ${status.googleCanonical || 'None'}`);

            if (status.verdict !== 'PASS') {
              if (quotaExceeded) {
                console.log(`     ⏭️ [SKIP] Indexing API quota already exceeded. Skipping request.`);
              } else {
                console.log(`     🚀 [INDEXING API] Requesting re-index for: ${url}`);
                try {
                  const indexRes = await indexing.urlNotifications.publish({
                    requestBody: {
                      url,
                      type: 'URL_UPDATED'
                    }
                  });
                  console.log(`     Status code: ${indexRes.status}`);
                } catch (indexErr: any) {
                  if (indexErr.message.includes('Quota exceeded')) {
                    console.log(`     ⚠️ Indexing API Quota Exceeded!`);
                    quotaExceeded = true;
                  } else {
                    console.error(`     ❌ Indexing request failed:`, indexErr.message);
                  }
                }
              }
            }
          }
        } catch (inspectErr: any) {
          console.error(`     ❌ Inspection query failed:`, inspectErr.message);
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`\n🎉 Fleet GSC Automation completed.`);

  } catch (err: any) {
    console.error("💥 Critical Failure in Fleet GSC Automation:", err.message);
  }
}

runFleetAutomation();
