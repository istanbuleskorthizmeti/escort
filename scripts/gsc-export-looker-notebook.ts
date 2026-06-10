import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { DOMAIN_MATRIX } from '../config/domains';

dotenv.config();

const EXPORT_CSV_PATH = path.join(process.cwd(), 'data', 'gsc_seo_matrix.csv');
const EXPORT_TXT_PATH = path.join(process.cwd(), 'data', 'gsc_notebook_context.txt');
const ROW_LIMIT = 50;

async function runExport() {
  console.log("🔒 [AUTH] Initializing Google Credentials for Search Console...");
  const keyPath = path.join(process.cwd(), 'google-key.json');
  if (!fs.existsSync(keyPath)) {
    console.error("❌ google-key.json not found!");
    process.exit(1);
  }

  const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const auth = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/webmasters'
    ],
  });

  const sc = google.searchconsole('v1');

  try {
    console.log("📡 Fetching verified Search Console properties...");
    const sitesRes = await sc.sites.list({ auth });
    const verifiedSites = (sitesRes.data.siteEntry || []).map(s => s.siteUrl).filter(Boolean) as string[];
    console.log(`✅ Found ${verifiedSites.length} verified site properties.`);

    const today = new Date();
    const rangeStartDate = new Date();
    rangeStartDate.setDate(today.getDate() - 14);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const startDateStr = formatDate(rangeStartDate);
    const endDateStr = formatDate(today);

    const activeHosts = Array.from(new Set(DOMAIN_MATRIX.map(d => d.host)));
    
    // Prepare CSV Header
    let csvContent = 'Domain,Query,Clicks,Impressions,CTR,Position,StartDate,EndDate\n';
    let txtContext = `==================================================\n`;
    txtContext += `HYDRA SEO FLEET PERFORMANCE REPORT FOR NOTEBOOKLM\n`;
    txtContext += `Date Range: ${startDateStr} to ${endDateStr}\n`;
    txtContext += `==================================================\n\n`;

    for (const siteUrl of verifiedSites) {
      const cleanDomain = siteUrl
        .replace('sc-domain:', '')
        .replace('https://', '')
        .replace('http://', '')
        .replace(/\/$/, '');

      // Check if domain is part of our matrix
      if (!activeHosts.some(h => cleanDomain.includes(h))) {
        continue;
      }

      console.log(`📡 Querying GSC data for: ${cleanDomain}...`);
      try {
        const queryRes = await sc.searchanalytics.query({
          auth,
          siteUrl,
          requestBody: {
            startDate: startDateStr,
            endDate: endDateStr,
            dimensions: ['query'],
            rowLimit: ROW_LIMIT,
            searchType: 'web'
          }
        });

        const rows = queryRes.data.rows || [];
        if (rows.length === 0) {
          console.log(`⚪ No search queries found for ${cleanDomain}`);
          continue;
        }

        txtContext += `Domain Property: ${cleanDomain}\n`;
        txtContext += `--------------------------------------------------\n`;

        rows.forEach((row: any) => {
          const query = row.keys?.[0] || 'Unknown';
          const clicks = row.clicks || 0;
          const impressions = row.impressions || 0;
          const ctr = row.ctr ? (row.ctr * 100).toFixed(2) : '0.00';
          const position = row.position ? row.position.toFixed(2) : '0.00';

          // Sanitize queries for CSV
          const escapedQuery = query.includes(',') || query.includes('"') 
            ? `"${query.replace(/"/g, '""')}"` 
            : query;

          csvContent += `${cleanDomain},${escapedQuery},${clicks},${impressions},${ctr}%,${position},${startDateStr},${endDateStr}\n`;
          txtContext += `- Query: "${query}" | Clicks: ${clicks} | Impressions: ${impressions} | CTR: ${ctr}% | Position: #${position}\n`;
        });
        
        txtContext += `\n`;

      } catch (siteErr: any) {
        console.error(`❌ Failed to query ${cleanDomain}:`, siteErr.message);
      }
      
      // Prevent hitting GSC API rate limits
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Write exported files
    const dataDir = path.dirname(EXPORT_CSV_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(EXPORT_CSV_PATH, csvContent, 'utf8');
    fs.writeFileSync(EXPORT_TXT_PATH, txtContext, 'utf8');

    console.log(`📊 [EXPORT COMPLETED] CSV Feed saved to: ${EXPORT_CSV_PATH}`);
    console.log(`📝 [EXPORT COMPLETED] NotebookLM context saved to: ${EXPORT_TXT_PATH}`);

  } catch (err: any) {
    console.error("❌ Export job failed:", err.message);
  }
}

runExport().catch(err => {
  console.error("❌ Shell error:", err);
});
