import { google } from 'googleapis';
import { TelegramService } from '../lib/crm/telegram';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

/**
 * 🗺️ HYDRA ENTERPRISE COMMAND CENTER - ADVANCED SEO ANALYTICS
 * 1. Uses sovereign-spyy (google-key.json) for all operations.
 * 2. Fetches verified domains from Google Search Console.
 * 3. Harvests high-density keyword performance (query, page, device, country) with high row limits.
 * 4. Extracts "SEO Page 2/3 Opportunities" (rank 11-25 with high impressions) for aggressive optimization targets.
 * 5. Syncs data to a pre-configured Google Sheet (using the ID from `.env` or creating a new one).
 * 6. Auto-verifies and creates all three sheets: "Fleet Overview", "Keyword Performance", "SEO Opportunities".
 * 7. Applies professional styling and reports consolidated metrics to Telegram.
 */

async function run() {
  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  console.log(`🚀 [ENTERPRISE-LOOP] Starting Advanced Fleet Analytics at ${timestamp}...`);

  const projectRoot = path.join(__dirname, '..');
  
  // Initialize Auth Client
  const rootDir = process.cwd();
  const files = fs.readdirSync(rootDir);
  const keyFile = files.find(f => f.startsWith('google-key') && f.endsWith('.json'));

  if (!keyFile) {
    throw new Error('No valid google-key*.json found for authentication.');
  }
  
  const gscKeyPath = path.join(projectRoot, keyFile);
  const keyData = JSON.parse(fs.readFileSync(gscKeyPath, 'utf8'));
  const auth = new google.auth.JWT(
    keyData.client_email,
    undefined,
    keyData.private_key.replace(/\\n/g, '\n').replace(/\r/g, ''),
    [
      'https://www.googleapis.com/auth/webmasters',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive'
    ]
  );
  console.log(`🔑 [AUTH] Initialized Client: ${keyData.client_email} via ${keyFile}`);

  // Fetch Verified GSC Properties
  const sc = google.searchconsole({ version: 'v1', auth });
  const sitesList = await sc.sites.list({});
  const verifiedSites = (sitesList.data.siteEntry || []).map(s => s.siteUrl).filter(Boolean);
  
  if (verifiedSites.length === 0) {
    throw new Error('No verified GSC sites found under this account.');
  }
  console.log(`📡 [GSC] Found ${verifiedSites.length} verified sites in GSC.`);

  // Set analysis time frame (Last 15 days)
  const today = new Date();
  const startDate = new Date(new Date().setDate(today.getDate() - 15)).toISOString().split('T')[0];
  const endDate = new Date(new Date().setDate(today.getDate() - 1)).toISOString().split('T')[0];

  const fleetOverviewData: any[] = [['Domain', 'Clicks', 'Impressions', 'CTR (%)', 'Avg Position']];
  const keywordPerformanceData: any[] = [['Domain', 'Query', 'Page', 'Device', 'Country', 'Clicks', 'Impressions', 'CTR (%)', 'Avg Position']];
  const seoOpportunitiesData: any[] = [['Domain', 'Query', 'Page', 'Impressions', 'Avg Position', 'Action Required']];

  // Harvest data for up to 25 verified sites
  const targetDomainCount = Math.min(verifiedSites.length, 25);
  console.log(`📡 [GSC] Harvesting high-density SEO metrics for ${targetDomainCount} domains...`);
  
  let totalClicks = 0;
  let totalImpressions = 0;

  for (let i = 0; i < targetDomainCount; i++) {
    const siteUrl = verifiedSites[i]!;
    const cleanDomain = siteUrl.replace('sc-domain:', '').replace('https://', '').replace('/', '');
    console.log(`   👉 Querying: ${cleanDomain}...`);

    try {
      const gscResponse = await sc.searchanalytics.query({
        siteUrl: siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['query', 'page', 'device', 'country'],
          rowLimit: 500, // Harvesting deep keyword listings
        },
      });

      const rows = gscResponse.data.rows || [];
      let siteClicks = 0;
      let siteImpressions = 0;
      let sitePositionSum = 0;

      rows.forEach(row => {
        const query = row.keys?.[0] || 'N/A';
        const page = row.keys?.[1] || 'N/A';
        const device = row.keys?.[2] || 'N/A';
        const country = row.keys?.[3] || 'N/A';
        const clicks = row.clicks || 0;
        const impressions = row.impressions || 0;
        const ctr = Math.round((row.ctr || 0) * 10000) / 100;
        const position = Math.round((row.position || 0) * 10) / 10;

        siteClicks += clicks;
        siteImpressions += impressions;
        sitePositionSum += position;

        keywordPerformanceData.push([
          cleanDomain,
          query,
          page,
          device,
          country,
          clicks,
          impressions,
          ctr,
          position
        ]);

        // SEO Opportunity Engine (Keywords ranking on page 2 or 3 with decent interest)
        if (position >= 10.0 && position <= 25.0 && impressions > 10) {
          seoOpportunitiesData.push([
            cleanDomain,
            query,
            page,
            impressions,
            position,
            position <= 15.0 ? '⚡ Push with Tier-2 Backlinks' : '✍️ Optimize Content Depth'
          ]);
        }
      });

      const avgPosition = rows.length > 0 ? Math.round((sitePositionSum / rows.length) * 10) / 10 : 0;
      const siteCtr = siteImpressions > 0 ? Math.round((siteClicks / siteImpressions) * 10000) / 100 : 0;

      fleetOverviewData.push([
        cleanDomain,
        siteClicks,
        siteImpressions,
        siteCtr,
        avgPosition
      ]);

      totalClicks += siteClicks;
      totalImpressions += siteImpressions;

    } catch (e: any) {
      console.warn(`   ⚠️ Failed harvesting ${cleanDomain}: ${e.message}`);
      fleetOverviewData.push([cleanDomain, 0, 0, 0, 0]);
    }
  }

  // Sheets API client
  const sheets = google.sheets({ version: 'v4', auth });
  const sheetTitle = `Hydra Advanced Fleet Dashboard - ${endDate}`;
  
  let spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  let isNewSpreadsheet = false;

  if (!spreadsheetId) {
    console.log(`📄 [SHEETS] No GOOGLE_SPREADSHEET_ID in .env. Attempting to create new sheet...`);
    try {
      const spreadsheet = await sheets.spreadsheets.create({
        requestBody: {
          properties: { title: sheetTitle },
          sheets: [
            { properties: { title: 'Fleet Overview', gridProperties: { frozenRowCount: 1 } } },
            { properties: { title: 'Keyword Performance', gridProperties: { frozenRowCount: 1 } } },
            { properties: { title: 'SEO Opportunities', gridProperties: { frozenRowCount: 1 } } }
          ]
        }
      });
      spreadsheetId = spreadsheet.data.spreadsheetId || undefined;
      isNewSpreadsheet = true;
      console.log(`✅ [SHEETS] Created new sheet! ID: ${spreadsheetId}`);
    } catch (createErr: any) {
      console.warn(`⚠️ [SHEETS] Could not create new sheet: ${createErr.message}`);
      throw createErr;
    }
  } else {
    console.log(`📄 [SHEETS] Using pre-configured Spreadsheet ID: ${spreadsheetId}`);
  }

  // Self-healing: Ensure required tabs are present
  console.log(`🔍 [SHEETS] Verifying spreadsheet structure...`);
  const meta = await sheets.spreadsheets.get({ spreadsheetId: spreadsheetId! });
  const existingSheets = meta.data.sheets || [];
  const existingTitles = existingSheets.map(s => s.properties?.title).filter(Boolean);

  const requiredSheets = ['Fleet Overview', 'Keyword Performance', 'SEO Opportunities'];
  const addSheetRequests: any[] = [];

  for (const title of requiredSheets) {
    if (!existingTitles.includes(title)) {
      addSheetRequests.push({
        addSheet: {
          properties: { title }
        }
      });
    }
  }

  if (addSheetRequests.length > 0) {
    console.log(`📄 [SHEETS] Creating missing tabs: ${addSheetRequests.map(r => r.addSheet.properties.title).join(', ')}...`);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId!,
      requestBody: {
        requests: addSheetRequests
      }
    });
    console.log(`✅ [SHEETS] Missing tabs created.`);
  }

  // Clear existing sheet contents to prevent mixing old data
  console.log(`🧹 [SHEETS] Preparing worksheet cells...`);
  await sheets.spreadsheets.values.batchClear({
    spreadsheetId: spreadsheetId!,
    requestBody: {
      ranges: ['Fleet Overview!A1:Z5000', 'Keyword Performance!A1:Z50000', 'SEO Opportunities!A1:Z10000']
    }
  });

  // Populate data
  console.log(`💾 [SHEETS] Writing fleet logs to sheet...`);
  await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId!,
    range: 'Fleet Overview!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: fleetOverviewData }
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId!,
    range: 'Keyword Performance!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: keywordPerformanceData }
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId!,
    range: 'SEO Opportunities!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: seoOpportunitiesData }
  });

  // Apply Premium Styling (Koyu Tema Headers & Alignments)
  console.log(`🎨 [SHEETS] Executing design styling...`);
  try {
    const updatedMeta = await sheets.spreadsheets.get({ spreadsheetId: spreadsheetId! });
    const overviewSheetId = updatedMeta.data.sheets?.find(s => s.properties?.title === 'Fleet Overview')?.properties?.sheetId || 0;
    const keywordSheetId = updatedMeta.data.sheets?.find(s => s.properties?.title === 'Keyword Performance')?.properties?.sheetId || 1;
    const opportunitySheetId = updatedMeta.data.sheets?.find(s => s.properties?.title === 'SEO Opportunities')?.properties?.sheetId || 2;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId!,
      requestBody: {
        requests: [
          // Header styles for Fleet Overview
          {
            repeatCell: {
              range: { sheetId: overviewSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 5 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.1, green: 0.13, blue: 0.18 },
                  textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 }, fontFamily: 'Outfit', fontSize: 10 },
                  horizontalAlignment: 'CENTER'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
            }
          },
          // Header styles for Keyword Performance
          {
            repeatCell: {
              range: { sheetId: keywordSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 9 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.1, green: 0.13, blue: 0.18 },
                  textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 }, fontFamily: 'Outfit', fontSize: 10 },
                  horizontalAlignment: 'CENTER'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
            }
          },
          // Header styles for SEO Opportunities
          {
            repeatCell: {
              range: { sheetId: opportunitySheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 6 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.15, green: 0.08, blue: 0.12 }, // Distinct dark red style for opportunities
                  textFormat: { bold: true, foregroundColor: { red: 1, green: 0.9, blue: 0.9 }, fontFamily: 'Outfit', fontSize: 10 },
                  horizontalAlignment: 'CENTER'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
            }
          },
          { autoResizeDimensions: { dimensions: { sheetId: overviewSheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 5 } } },
          { autoResizeDimensions: { dimensions: { sheetId: keywordSheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 9 } } },
          { autoResizeDimensions: { dimensions: { sheetId: opportunitySheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 6 } } }
        ]
      }
    });
    console.log('✅ [SHEETS] Styling applied successfully.');
  } catch (styleErr: any) {
    console.warn(`⚠️ [SHEETS] Styling failed:`, styleErr.message);
  }

  // Share if new spreadsheet
  if (isNewSpreadsheet) {
    const drive = google.drive({ version: 'v3', auth });
    const userEmail = process.env.GOOGLE_WORKSPACE_EMAIL || 'info@dorukcanay.digital';
    console.log(`🔑 [DRIVE] Sharing with: ${userEmail}...`);
    try {
      await drive.permissions.create({
        fileId: spreadsheetId!,
        requestBody: { role: 'writer', type: 'user', emailAddress: userEmail },
      });
      console.log(`✅ [DRIVE] Access shared successfully.`);
    } catch (shareErr: any) {
      console.warn(`⚠️ [DRIVE] Share failed:`, shareErr.message);
    }
  }

  // Telegram Notifications
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
  const lookerLink = `https://lookerstudio.google.com/reporting/create?c.reportId=new&ds.ds0.connector=googleSheets&ds.ds0.spreadsheetId=${spreadsheetId}`;

  const reportMessage = `
🔱 <b>HYDRA ADVANCED METRICS ENGINE</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🥷 <b>TACTICAL:</b> <code>HIGH-DENSITY HARVESTING</code>
📡 <b>SOURCE:</b> <code>GSC Consolidation API</code>
📊 <b>TARGET FLEET SIZE:</b> <code>${verifiedSites.length} Domains</code>
📈 <b>HARVESTED DOMAINS:</b> <code>${targetDomainCount}</code>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📈 <b>CONSOLIDATED FLEET DATA:</b>
• <b>Total Clicks:</b> <code>${totalClicks}</code>
• <b>Total Impressions:</b> <code>${totalImpressions}</code>
• <b>Overall CTR:</b> <code>${totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0}%</code>
• 🎯 <b>High-Yield Opportunities Found:</b> <code>${seoOpportunitiesData.length - 1} Keywords</code>

📄 <b>WORKSPACE SHEET:</b>
• 📥 <a href="${spreadsheetUrl}">VIEW ADVANCED GOOGLE SHEET</a>

📊 <b>LOOKER STUDIO FLEET REPORT:</b>
• 📈 <a href="${lookerLink}">CREATE LOOKER DASHBOARD</a>

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>Opportunity matrix calculated. Autopilot active.</i>
  `.trim();

  await TelegramService.sendMessage(reportMessage);
  console.log('✅ [TELEGRAM] Advanced report delivered.');
}

run().catch(async (err) => {
  console.error('💥 [ENTERPRISE-LOOP] Critical Failure:', err.message);
  try {
    await TelegramService.sendMessage(`❌ <b>[ENTERPRISE-LOOP ERROR]</b>\n\n<code>${err.message}</code>`);
  } catch (tgErr) {
    console.error('Failed to send Telegram error message:', tgErr);
  }
});
