import * as fs from 'fs';
import * as path from 'path';
import { google } from 'googleapis';

const workingKeys = [
  'google-key-lyrical.json',
  'google-key-model-osprey.json',
  'google-key-starry.json'
];

async function run() {
  console.log("⚡ [BIGQUERY] Starting BigQuery local initialization and test script...");
  
  const rootDir = process.cwd();
  let selectedKey: string | null = null;
  let keyData: any = null;

  for (const keyFile of workingKeys) {
    const keyPath = path.join(rootDir, keyFile);
    if (fs.existsSync(keyPath)) {
      try {
        const raw = fs.readFileSync(keyPath, 'utf8');
        keyData = JSON.parse(raw);
        selectedKey = keyFile;
        console.log(`🔑 [BIGQUERY] Selected key file: ${keyFile} (Project: ${keyData.project_id})`);
        break;
      } catch (e) {
        console.warn(`⚠️ Failed to read ${keyFile}:`, e);
      }
    }
  }

  if (!selectedKey || !keyData) {
    console.error("❌ [BIGQUERY] No working Google service account key found in workspace root!");
    return;
  }

  const projectId = keyData.project_id;
  const datasetId = 'seo_fleet_telemetry';
  const tableId = 'gsc_inspection_logs';

  const privateKey = keyData.private_key
    .replace(/\\n/g, '\n')
    .replace(/\r/g, '')
    .trim();

  // Create JWT Auth with BigQuery scope
  const auth = new google.auth.JWT(
    keyData.client_email,
    undefined,
    privateKey,
    ['https://www.googleapis.com/auth/bigquery']
  );

  try {
    console.log("⏳ [BIGQUERY] Authorizing Google Service Account...");
    await auth.authorize();
    console.log("✅ [BIGQUERY] Authorized successfully.");

    const bigquery = google.bigquery({ version: 'v2', auth });

    // 1. Ensure Dataset Exists
    console.log(`📡 [BIGQUERY] Checking dataset: ${datasetId}...`);
    let datasetExists = false;
    try {
      await bigquery.datasets.get({
        projectId,
        datasetId
      });
      datasetExists = true;
      console.log(`✅ [BIGQUERY] Dataset '${datasetId}' already exists.`);
    } catch (err: any) {
      if (err.status === 404) {
        console.log(`✨ [BIGQUERY] Dataset '${datasetId}' not found. Creating it...`);
        await bigquery.datasets.insert({
          projectId,
          requestBody: {
            datasetReference: {
              projectId,
              datasetId
            },
            location: 'US' // or 'EU'
          }
        });
        datasetExists = true;
        console.log(`✅ [BIGQUERY] Dataset '${datasetId}' created successfully.`);
      } else {
        throw err;
      }
    }

    // 2. Ensure Table Exists
    console.log(`📡 [BIGQUERY] Checking table: ${tableId}...`);
    let tableExists = false;
    try {
      await bigquery.tables.get({
        projectId,
        datasetId,
        tableId
      });
      tableExists = true;
      console.log(`✅ [BIGQUERY] Table '${tableId}' already exists.`);
    } catch (err: any) {
      if (err.status === 404) {
        console.log(`✨ [BIGQUERY] Table '${tableId}' not found. Creating it with schema...`);
        await bigquery.tables.insert({
          projectId,
          datasetId,
          requestBody: {
            tableReference: {
              projectId,
              datasetId,
              tableId
            },
            schema: {
              fields: [
                { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
                { name: 'host', type: 'STRING', mode: 'REQUIRED' },
                { name: 'url', type: 'STRING', mode: 'REQUIRED' },
                { name: 'verdict', type: 'STRING', mode: 'NULLABLE' },
                { name: 'coverage_state', type: 'STRING', mode: 'NULLABLE' },
                { name: 'last_crawl_time', type: 'TIMESTAMP', mode: 'NULLABLE' }
              ]
            }
          }
        });
        tableExists = true;
        console.log(`✅ [BIGQUERY] Table '${tableId}' created successfully.`);
      } else {
        throw err;
      }
    }

    // 3. Test insertRow
    if (datasetExists && tableExists) {
      const testRow = {
        timestamp: new Date().toISOString(),
        host: 'istanbulescort.blog',
        url: 'https://istanbulescort.blog/istanbul-sisli-escort',
        verdict: 'INDEXED',
        coverage_state: 'Indexed, not submitted in sitemap',
        last_crawl_time: new Date().toISOString()
      };

      console.log(`📥 [BIGQUERY] Attempting to insert test row via streaming API (insertAll)...`);
      try {
        const res = await bigquery.tabledata.insertAll({
          projectId,
          datasetId,
          tableId,
          requestBody: {
            rows: [
              {
                json: testRow
              }
            ]
          }
        });

        if (res.data.insertErrors && res.data.insertErrors.length > 0) {
          console.error("❌ [BIGQUERY] Streaming insert failed with errors:", JSON.stringify(res.data.insertErrors));
        } else {
          console.log("🎉 [BIGQUERY] Success! Test row successfully inserted via Streaming API.");
        }
      } catch (streamErr: any) {
        const isFreeTierErr = streamErr.message?.includes('free tier') || streamErr.response?.data?.error?.message?.includes('free tier');
        if (isFreeTierErr) {
          console.log("⚠️ [BIGQUERY] Streaming insert blocked by BigQuery Free Tier. Falling back to SQL Query-based INSERT...");
          
          const sqlQuery = `
            INSERT INTO \`${projectId}.${datasetId}.${tableId}\` 
            (timestamp, host, url, verdict, coverage_state, last_crawl_time)
            VALUES (
              TIMESTAMP('${testRow.timestamp}'),
              '${testRow.host}',
              '${testRow.url}',
              '${testRow.verdict}',
              '${testRow.coverage_state}',
              TIMESTAMP('${testRow.last_crawl_time}')
            )
          `;

          const queryRes = await bigquery.jobs.query({
            projectId,
            requestBody: {
              query: sqlQuery,
              useLegacySql: false
            }
          });

          if (queryRes.data.errors && queryRes.data.errors.length > 0) {
            console.error("❌ [BIGQUERY] SQL INSERT failed with errors:", JSON.stringify(queryRes.data.errors));
          } else {
            console.log("🎉 [BIGQUERY] Success! Test row successfully inserted using SQL Query (Free Tier Bypass).");
          }
        } else {
          throw streamErr;
        }
      }
    }

  } catch (err: any) {
    console.error("💥 [BIGQUERY ERROR] BigQuery operation failed:", err.response?.data || err.message);
  }
}

run();
