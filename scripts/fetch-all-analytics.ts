import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  console.log('🏁 [ANALYTICS] Loading credentials...');
  
  const keyFiles = [
    'hydra-gcp-key.json',
    'google-key-sovereign.json',
    'google-key-strong-return.json',
    'google-key.json'
  ];

  let reportText = `# 📊 Google Search Console & GA4 Performance Insights\n\n`;
  reportText += `Generated on: ${new Date().toISOString()}\n\n`;

  for (const file of keyFiles) {
    const keyPath = path.join(process.cwd(), file);
    if (!fs.existsSync(keyPath)) {
      reportText += `### ❌ Credential File: ${file}\nFile not found.\n\n---\n`;
      continue;
    }

    try {
      const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      reportText += `### 🔑 Credential File: \`${file}\` (${keys.client_email})\n\n`;

      const auth = new JWT({
        email: keys.client_email,
        key: keys.private_key,
        scopes: [
          'https://www.googleapis.com/auth/webmasters.readonly',
          'https://www.googleapis.com/auth/webmasters',
          'https://www.googleapis.com/auth/analytics.readonly',
          'https://www.googleapis.com/auth/indexing'
        ],
      });

      // 1. Fetch Search Console Sites
      const sc = google.searchconsole({ version: 'v1', auth });
      const sitesList = await sc.sites.list();
      const sites = sitesList.data.siteEntry || [];

      if (sites.length === 0) {
        reportText += `*No verified sites found for this credential.*\n\n`;
      } else {
        reportText += `#### 📡 Verified Search Console Sites (${sites.length})\n\n`;
        
        for (const site of sites) {
          const siteUrl = site.siteUrl || '';
          reportText += `##### 🌍 Site: \`${siteUrl}\` (Permission: ${site.permissionLevel})\n\n`;
          
          try {
            const today = new Date();
            const tenDaysAgo = new Date();
            tenDaysAgo.setDate(today.getDate() - 10);
            
            const formatDate = (date: Date) => date.toISOString().split('T')[0];
            const startDate = formatDate(tenDaysAgo);
            const endDate = formatDate(today);

            const perfRes = await sc.searchanalytics.query({
              siteUrl,
              requestBody: {
                startDate,
                endDate,
                dimensions: ['query'],
                rowLimit: 15,
                searchType: 'web'
              }
            });

            const rows = perfRes.data.rows || [];
            if (rows.length === 0) {
              reportText += `> ⚪ *No search performance data found (or site newly verified).*\n\n`;
            } else {
              reportText += `| Query | Clicks | Impressions | CTR | Position |\n`;
              reportText += `| :--- | :---: | :---: | :---: | :---: |\n`;
              for (const r of rows) {
                const query = r.keys?.[0] || 'Unknown';
                const clicks = r.clicks || 0;
                const impressions = r.impressions || 0;
                const ctr = r.ctr ? `${(r.ctr * 100).toFixed(1)}%` : '0%';
                const pos = r.position ? r.position.toFixed(1) : '0';
                reportText += `| **${query}** | ${clicks} | ${impressions} | ${ctr} | #${pos} |\n`;
              }
              reportText += `\n`;
            }
          } catch (err: any) {
            reportText += `> ❌ *Failed to fetch performance stats:* ${err.message}\n\n`;
          }
        }
      }

      // 2. Fetch GA4 property report if configured in environment
      const propertyId = process.env.GOOGLE_GA4_PROPERTY_ID || '536316143';
      if (propertyId) {
        reportText += `#### 📊 GA4 Property Insights (Property ID: \`${propertyId}\`)\n\n`;
        try {
          const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
          const gaRes = await analyticsData.properties.runReport({
            property: `properties/${propertyId}`,
            requestBody: {
              dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
              dimensions: [{ name: 'date' }],
              metrics: [
                { name: 'activeUsers' },
                { name: 'sessions' },
                { name: 'screenPageViews' }
              ],
            },
          });

          const gaRows = gaRes.data.rows || [];
          if (gaRows.length === 0) {
            reportText += `> ⚪ *No GA4 user traffic data found.*\n\n`;
          } else {
            reportText += `| Date | Active Users | Sessions | Page Views |\n`;
            reportText += `| :--- | :---: | :---: | :---: |\n`;
            
            // Sort by date descending
            const sortedRows = [...gaRows].sort((a, b) => {
              const dateA = a.dimensionValues?.[0]?.value || '';
              const dateB = b.dimensionValues?.[0]?.value || '';
              return dateB.localeCompare(dateA);
            });

            for (const r of sortedRows.slice(0, 15)) {
              const rawDate = r.dimensionValues?.[0]?.value || '';
              const formattedDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
              const activeUsers = r.metricValues?.[0]?.value || '0';
              const sessions = r.metricValues?.[1]?.value || '0';
              const pageViews = r.metricValues?.[2]?.value || '0';
              reportText += `| ${formattedDate} | ${activeUsers} | ${sessions} | ${pageViews} |\n`;
            }
            reportText += `\n`;
          }
        } catch (err: any) {
          reportText += `> ❌ *Failed to fetch GA4 stats:* ${err.message}\n\n`;
        }
      }

      reportText += `---\n\n`;
    } catch (err: any) {
      reportText += `### ❌ Error during initialization for ${file}\n${err.message}\n\n---\n`;
    }
  }

  const outputPath = path.join(process.cwd(), 'artifacts', 'gsc_ga4_insights_report.md');
  // Make sure artifacts directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, reportText, 'utf8');
  console.log(`✅ Report saved to ${outputPath}`);
}

run().catch(err => {
  console.error('Fatal error during analytics run:', err);
});
