import https from 'https';
import fs from 'fs';
import path from 'path';

const CF_TOKEN = 'cfat_JwtaN2nqkC7QxGItIaAbu2nA6TyojAqHS7DWfvpse525d170';
const CF_ACCOUNT_ID = 'b1ec451c33c18d8b854c61c1c4dce140';
const DOMAIN = 'exxvideos.shop';
const WORKER_NAME = 'honeypot-worker-exxvideos';
const WORKER_PATH = path.join(process.cwd(), 'cloudflare', 'honeypot-worker.js');

async function apiCall(path, method = 'GET', body = null, contentType = 'application/json') {
  return new Promise((resolve, reject) => {
    const headers = {
      'Authorization': `Bearer ${CF_TOKEN}`,
    };
    if (contentType) headers['Content-Type'] = contentType;

    const req = https.request({
      hostname: 'api.cloudflare.com',
      path: path,
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
      if (typeof body === 'string') req.write(body);
      else req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log(`🚀 Deploying fixed worker to ${DOMAIN}...`);

  // 1. Upload Worker Script
  const workerContent = fs.readFileSync(WORKER_PATH, 'utf8');
  console.log(`📤 Uploading worker script: ${WORKER_NAME}...`);
  const uploadRes = await apiCall(`/client/v4/accounts/${CF_ACCOUNT_ID}/workers/scripts/${WORKER_NAME}`, 'PUT', workerContent, 'application/javascript');
  if (!uploadRes.success) {
    console.error('❌ Failed to upload worker:', JSON.stringify(uploadRes, null, 2));
    return;
  }
  console.log('✅ Worker uploaded.');

  // 2. Find Zone ID
  const zones = await apiCall(`/client/v4/zones?name=${DOMAIN}`);
  if (!zones.result || zones.result.length === 0) {
    console.error('❌ Zone not found');
    return;
  }
  const zoneId = zones.result[0].id;
  console.log(`✅ Zone ID: ${zoneId}`);

  // 3. Create/Update Route
  console.log(`🔗 Routing ${DOMAIN}/* to ${WORKER_NAME}...`);
  // First, find existing routes
  const routesRes = await apiCall(`/client/v4/zones/${zoneId}/workers/routes`);
  const existingRoute = routesRes.result?.find(r => r.pattern === `${DOMAIN}/*` || r.pattern === `www.${DOMAIN}/*`);

  if (existingRoute) {
    console.log(`🔄 Updating existing route: ${existingRoute.id}`);
    await apiCall(`/client/v4/zones/${zoneId}/workers/routes/${existingRoute.id}`, 'PUT', {
      pattern: `${DOMAIN}/*`,
      script: WORKER_NAME
    });
  } else {
    console.log(`➕ Creating new route...`);
    await apiCall(`/client/v4/zones/${zoneId}/workers/routes`, 'POST', {
      pattern: `${DOMAIN}/*`,
      script: WORKER_NAME
    });
  }
  
  // Also route www
  await apiCall(`/client/v4/zones/${zoneId}/workers/routes`, 'POST', {
    pattern: `www.${DOMAIN}/*`,
    script: WORKER_NAME
  }).catch(() => {});

  console.log('🎉 Deployment complete. exxvideos.shop should now bypass the trap and reach Next.js!');
}

run();
