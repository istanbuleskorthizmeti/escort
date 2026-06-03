import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function runAudit() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    // Write a temporary auditing Node.js script to run directly on the server.
    // This allows it to query Google APIs using the local google-key.json and run local curls.
    const serverScript = `
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');
const http = require('http');

async function main() {
  console.log('🏁 Starting Server-Side Google API & On-Page SEO Audit...');

  let auth = null;
  const keyPath = path.join(process.cwd(), 'google-key.json');
  if (fs.existsSync(keyPath)) {
    const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    auth = new JWT({
      email: keys.client_email,
      key: keys.private_key,
      scopes: [
        'https://www.googleapis.com/auth/webmasters.readonly',
        'https://www.googleapis.com/auth/analytics.readonly'
      ],
    });
    console.log('🔑 Loaded GSC Service Account:', keys.client_email);
  } else {
    console.warn('⚠️ google-key.json not found in root.');
  }

  // 1. Fetch Verified Sites from GSC
  let gscSites = [];
  if (auth) {
    try {
      const searchconsole = google.searchconsole({ version: 'v1', auth });
      const sitesRes = await searchconsole.sites.list({});
      gscSites = (sitesRes.data.siteEntry || []).map(s => s.siteUrl).filter(Boolean);
      console.log('📡 GSC Sites:', gscSites);
    } catch (e) {
      console.error('❌ Failed to list GSC sites:', e.message);
    }
  }

  // 2. Fetch GSC Traffic Metrics for last 7 days
  const gscData = {};
  if (auth && gscSites.length > 0) {
    const searchconsole = google.searchconsole({ version: 'v1', auth });
    const today = new Date();
    const sevenDaysAgo = new Date(new Date().setDate(today.getDate() - 8)).toISOString().split('T')[0];
    const yesterday = new Date(new Date().setDate(today.getDate() - 1)).toISOString().split('T')[0];

    for (const site of gscSites) {
      try {
        const queryRes = await searchconsole.searchanalytics.query({
          siteUrl: site,
          requestBody: {
            startDate: sevenDaysAgo,
            endDate: yesterday,
            rowLimit: 1
          }
        });
        const rows = queryRes.data.rows || [];
        if (rows.length > 0) {
          gscData[site] = {
            clicks: rows.reduce((sum, r) => sum + (r.clicks || 0), 0),
            impressions: rows.reduce((sum, r) => sum + (r.impressions || 0), 0),
            position: rows.length > 0 ? (rows[0].position || 0) : 'N/A'
          };
        } else {
          gscData[site] = { clicks: 0, impressions: 0, position: 'N/A' };
        }
      } catch (e) {
        gscData[site] = { error: e.message };
      }
    }
  }

  // 3. Local HTTP Scraper for Domain Matrix
  // Load DOMAIN_MATRIX from config/domains.ts if possible, or read from next.config.ts
  const domains = [
    'vipescorthizmeti.com',
    'escortvip.net',
    'vipescorthizmeti.shop',
    'dorukcanay.digital',
    'istanbulescdrkcn.com',
    'sariyerdrkcnay.shop',
    'leventdrkcnay.shop',
    'istanbuldrkcnay.shop',
    'istanbulescortkaporasiz.shop',
    'shopistanbulescortkaporasiz.site'
  ];

  const results = [];

  for (const domain of domains) {
    const result = {
      domain,
      status: 0,
      title: 'N/A',
      description: 'N/A',
      canonical: 'N/A',
      error: null
    };

    try {
      // Query local nextjs listener with Host header
      const pageHtml = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: '127.0.0.1',
          port: 8081,
          path: '/',
          method: 'GET',
          headers: {
            'Host': domain,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 GSC-Audit'
          },
          timeout: 4000
        }, (res) => {
          result.status = res.statusCode;
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => resolve(body));
        });

        req.on('error', err => reject(err));
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Timeout'));
        });
        req.end();
      });

      // Simple regex extraction for Title and Meta Desc
      const titleMatch = pageHtml.match(/<title>([^<]+)<\\/title>/i);
      if (titleMatch) result.title = titleMatch[1].trim();

      const descMatch = pageHtml.match(/<meta\\s+name="description"\\s+content="([^"]+)"/i) || pageHtml.match(/<meta\\s+content="([^"]+)"\\s+name="description"/i);
      if (descMatch) result.description = descMatch[1].trim();

      const canonicalMatch = pageHtml.match(/<link\\s+rel="canonical"\\s+href="([^"]+)"/i);
      if (canonicalMatch) result.canonical = canonicalMatch[1].trim();

    } catch (e) {
      result.error = e.message;
    }

    results.push(result);
  }

  // 4. Print Summary Report
  console.log('\\n--- AUDIT SUMMARY REPORT ---');
  console.log(JSON.stringify({ gscData, results }, null, 2));
}

main().catch(console.error);
`;

    // Upload script to remote server
    console.log('📤 Uploading server-side audit script...');
    await ssh.execCommand(`cat << 'EOF' > /root/esc/scratch/temp_audit_script.js\n${serverScript}\nEOF`);

    console.log('🏗️ Executing server-side audit script...');
    const auditRes = await ssh.execCommand('node /root/esc/scratch/temp_audit_script.js', { cwd: '/root/esc' });
    console.log('\n--- AUDIT OUTPUT ---');
    console.log(auditRes.stdout || auditRes.stderr);

    // Clean up temporary script
    await ssh.execCommand('rm -f /root/esc/scratch/temp_audit_script.js');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Audit failed:', err);
    ssh.dispose();
  }
}

runAudit();
