const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const CF_TOKEN = process.env.CF_API_TOKEN || 'cfat_XZOqfgE0ToGskESZ6SMEgboAVeGeZz1rcXBdIIona3784f9f';
const SCRIPT_NAME = 'hydra-honeypot';

const HONEYPOT_FLEET = [
  'plakasorgula.shop',
  'santajci-tespit.site',
  'casus-yazilim-sil.xyz',
  'konumbulucu.xyz',
  'exxvideos.shop',
  'sansursuzturkifsa.shop',
  'magazinifsa.site',
  'sokhaberifsa.shop',
  'dilanpolatifsa.shop',
  'telegramifsaizle.shop',
  'turkifsalar.shop',
  'turkifsapremium.shop',
  'onlyfansizle.shop',
  'dizicehennemi.site',
  'fragmanizle.shop',
  'kesintisizizle.shop',
  'canlimaclinki.shop',
  'fullapkoyun.shop',
  'instacoz.site',
  'tiktokhilesi.sbs',
  'bedavahesap.site',
  'kazandiranborsatuyolari.site',
  'escortcoin.space',
  'yardimbasvurusu.online',
  'sanalsms.site'
];

async function apiCall(urlPath, method = 'GET', body = null, contentType = 'application/json') {
  return new Promise((resolve, reject) => {
    const headers = {
      'Authorization': `Bearer ${CF_TOKEN}`
    };
    if (body) {
      headers['Content-Type'] = contentType;
      if (contentType.startsWith('multipart/form-data')) {
        headers['Content-Length'] = body.length;
      }
    }

    const req = https.request({
      hostname: 'api.cloudflare.com',
      path: urlPath,
      method: method,
      headers: headers,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function run() {
  try {
    console.log('📡 Fetching Cloudflare accounts...');
    const accountsRes = await apiCall('/client/v4/accounts');
    if (!accountsRes.success || accountsRes.result.length === 0) {
      console.error('❌ Failed to fetch accounts:', accountsRes);
      return;
    }

    const accountId = accountsRes.result[0].id;
    console.log(`✅ Using Cloudflare Account: ${accountsRes.result[0].name} (${accountId})`);

    // Read worker content
    const scriptPath = path.join(__dirname, '../cloudflare/honeypot-worker.js');
    console.log(`📖 Reading worker script from: ${scriptPath}`);
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');

    // Construct multipart form data body manually
    const boundary = '----CloudflareWorkerBoundary';
    const metadata = JSON.stringify({ main_module: 'index.js' });
    const multipartBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="metadata"\r\nContent-Type: application/json\r\n\r\n${metadata}\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="script"; filename="index.js"\r\nContent-Type: application/javascript+module\r\n\r\n${scriptContent}\r\n`),
      Buffer.from(`--${boundary}--\r\n`)
    ]);

    console.log(`📤 Uploading worker script "${SCRIPT_NAME}" to Cloudflare...`);
    const uploadRes = await apiCall(
      `/client/v4/accounts/${accountId}/workers/scripts/${SCRIPT_NAME}`,
      'PUT',
      multipartBody,
      `multipart/form-data; boundary=${boundary}`
    );

    if (!uploadRes.success) {
      console.error('❌ Upload failed:', JSON.stringify(uploadRes.errors));
      return;
    }
    console.log(`✅ Worker script uploaded successfully.`);

    console.log('📡 Fetching all zones (page 1)...');
    const page1 = await apiCall('/client/v4/zones?per_page=50&page=1');
    console.log('📡 Fetching all zones (page 2)...');
    const page2 = await apiCall('/client/v4/zones?per_page=50&page=2');

    const zones = [
      ...(page1.result || []),
      ...(page2.result || [])
    ];

    console.log(`Found ${zones.length} zones total. Deploying routes...`);
    let routesCreated = 0;

    for (const zone of zones) {
      // Check if this zone is in the honeypot fleet
      const match = HONEYPOT_FLEET.find(domain => zone.name.includes(domain));
      if (!match) continue;

      console.log(`⚙️ Setting up routes for zone: ${zone.name}`);

      // Fetch existing routes for the zone to avoid duplicates
      const routesRes = await apiCall(`/client/v4/zones/${zone.id}/workers/routes`);
      const existingRoutes = routesRes.success ? (routesRes.result || []) : [];

      const patternsToCreate = [
        `${zone.name}/*`,
        `www.${zone.name}/*`
      ];

      for (const pattern of patternsToCreate) {
        const duplicate = existingRoutes.find(r => r.pattern === pattern);
        if (duplicate) {
          if (duplicate.script === SCRIPT_NAME) {
            console.log(`  ℹ️ Route already exists and matches: ${pattern}`);
            continue;
          } else {
            console.log(`  🔄 Updating existing route from "${duplicate.script}" to "${SCRIPT_NAME}": ${pattern}`);
            const updateRes = await apiCall(`/client/v4/zones/${zone.id}/workers/routes/${duplicate.id}`, 'PUT', JSON.stringify({
              pattern,
              script: SCRIPT_NAME
            }));
            if (updateRes.success) {
              console.log(`    ✅ Route updated.`);
              routesCreated++;
            } else {
              console.error(`    ❌ Route update failed:`, JSON.stringify(updateRes.errors));
            }
            continue;
          }
        }

        console.log(`  ➕ Creating route: ${pattern} -> ${SCRIPT_NAME}`);
        const createRes = await apiCall(`/client/v4/zones/${zone.id}/workers/routes`, 'POST', JSON.stringify({
          pattern,
          script: SCRIPT_NAME
        }));

        if (createRes.success) {
          console.log(`    ✅ Route created.`);
          routesCreated++;
        } else {
          console.error(`    ❌ Route creation failed:`, JSON.stringify(createRes.errors));
        }
      }
    }

    console.log(`\n🎉 Job completed! Total Worker Routes configured: ${routesCreated}`);
  } catch (e) {
    console.error('Fatal error during Worker routing:', e);
  }
}

run();
