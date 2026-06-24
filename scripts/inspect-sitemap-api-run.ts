import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

async function run() {
  const files = fs.readdirSync(process.cwd());
  const keyFiles = files.filter(f => 
    f.endsWith('.json') && 
    (f.startsWith('google-key') || f.startsWith('hydra-gcp-key') || f.includes('-key'))
  );

  const targetSite = "https://istanbul-eskort-hizmeti.readme.io/";
  const urlsToInspect = [
    "https://istanbul-eskort-hizmeti.readme.io/docs/getting-started",
    "https://istanbul-eskort-hizmeti.readme.io/docs/istanbul-escort"
  ];

  let matchedClient = null;

  for (const file of keyFiles) {
    try {
      const keys = JSON.parse(fs.readFileSync(path.join(process.cwd(), file), 'utf8'));
      if (!keys.client_email || !keys.private_key) continue;

      const auth = new JWT({
        email: keys.client_email,
        key: keys.private_key,
        scopes: ['https://www.googleapis.com/auth/webmasters'],
      });

      const sc = google.searchconsole({ version: 'v1', auth });
      const sitesRes = await sc.sites.list();
      const verifiedSites = (sitesRes.data.siteEntry || []).map(s => s.siteUrl || '');

      const match = verifiedSites.find(url => url.toLowerCase().trim() === targetSite.toLowerCase().trim());
      if (match) {
        matchedClient = sc;
        break;
      }
    } catch (e: any) {}
  }

  if (!matchedClient) {
    console.error(`❌ Could not find a key file that has access to ${targetSite}`);
    return;
  }

  for (const url of urlsToInspect) {
    console.log(`\n📡 Inspecting URL: ${url}...`);
    try {
      const inspectRes = await matchedClient.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl: targetSite,
          languageCode: 'tr'
        }
      });

      const idxResult = inspectRes.data.inspectionResult?.indexStatusResult;
      console.log(`Verdict: [${idxResult?.verdict}]`);
      console.log(`CoverageState: [${idxResult?.coverageState}]`);
      console.log(`robotsTxtState: [${idxResult?.robotsTxtState}]`);
      console.log(`indexingState: [${idxResult?.indexingState}]`);
      console.log(`pageFetchState: [${idxResult?.pageFetchState}]`);
      console.log(`lastCrawlTime: [${idxResult?.lastCrawlTime}]`);

    } catch (err: any) {
      console.error(`❌ Inspection API Call Failed for ${url}:`, err.message);
    }
  }
}

run().catch(console.error);
