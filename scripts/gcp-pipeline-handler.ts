/**
 * ⚡ HYDRA GCP TELEMETRY PIPELINE HANDLER
 * Designed to run as a Google Cloud Function (Node.js runtime).
 * Triggered by GCP Pub/Sub events (fired by Cloud Scheduler).
 * Writes GSC inspect results & traffic metrics directly to BigQuery.
 */

import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// BigQuery Config
const BIGQUERY_PROJECT_ID = process.env.GCP_PROJECT_ID || 'hydra-analytics';
const BIGQUERY_DATASET_ID = 'seo_fleet_telemetry';
const BIGQUERY_TABLE_ID = 'gsc_inspection_logs';

/**
 * Pub/Sub Message Payload Interface
 */
interface PubSubEvent {
  data: string; // Base64 encoded string
}

/**
 * Cloud Function Entrypoint
 */
export async function hydraTelemetryHandler(event: PubSubEvent, context: any) {
  try {
    // 1. Decode Pub/Sub payload
    const rawData = Buffer.from(event.data, 'base64').toString('utf-8');
    const payload = JSON.parse(rawData);
    
    const { host, targetUrl } = payload;
    if (!host || !targetUrl) {
      console.warn('⚠️ [PIPELINE] Invalid payload received: missing host or targetUrl.');
      return;
    }

    console.log(`📡 [PIPELINE] Processing GSC telemetry for: ${targetUrl} (Host: ${host})`);

    // 2. Auth: Load GSC auth client dynamically from disk if present, separate from BigQuery
    const fs = require('fs');
    const path = require('path');
    const keyPath = path.join(__dirname, 'google-key-sovereign.json');
    
    let authClient;
    const bqAuth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/bigquery']
    });
    const bqAuthClient = await bqAuth.getClient();

    if (fs.existsSync(keyPath)) {
      console.log('🔑 [PIPELINE] Loading verified GSC credentials from sovereign key file.');
      const gscAuth = new google.auth.GoogleAuth({
        keyFile: keyPath,
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
      });
      authClient = await gscAuth.getClient();
    } else {
      console.log('🔑 [PIPELINE] Loading default GSC credentials (fallback).');
      const gscAuth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
      });
      authClient = await gscAuth.getClient();
    }

    // 3. Query Google Search Console Inspection API
    const sc = google.searchconsole({ version: 'v1', auth: authClient as any });
    
    // Map host to site URL structure (sc-domain:host or https://host/)
    const siteUrl = host.includes('.') ? `sc-domain:${host}` : host;
    
    console.log(`🔍 [PIPELINE] Inspecting URL: ${targetUrl} on property: ${siteUrl}`);
    const inspectRes = await sc.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: targetUrl,
        siteUrl: siteUrl,
        languageCode: 'tr'
      }
    });

    const result = inspectRes.data.inspectionResult;
    const verdict = result?.indexStatusResult?.verdict || 'UNKNOWN';
    const coverage = result?.indexStatusResult?.coverageState || 'UNSPECIFIED';
    const lastCrawl = result?.indexStatusResult?.lastCrawlTime || null;

    // 4. Insert row into BigQuery using Google BigQuery API
    const bigquery = google.bigquery({ version: 'v2', auth: bqAuthClient as any });

    const row = {
      timestamp: new Date().toISOString(),
      host: host,
      url: targetUrl,
      verdict: verdict,
      coverage_state: coverage,
      last_crawl_time: lastCrawl
    };

    console.log(`📥 [PIPELINE] Writing log to BigQuery table: ${BIGQUERY_DATASET_ID}.${BIGQUERY_TABLE_ID}`);

    await bigquery.tabledata.insertAll({
      projectId: BIGQUERY_PROJECT_ID,
      datasetId: BIGQUERY_DATASET_ID,
      tableId: BIGQUERY_TABLE_ID,
      requestBody: {
        rows: [
          {
            json: row
          }
        ]
      }
    });

    console.log(`✅ [PIPELINE] Successfully logged telemetry row to BigQuery.`);

  } catch (err: any) {
    console.error('💥 [PIPELINE ERROR] Failed execution in Cloud Function handler:', err.message);
    throw err;
  }
}
