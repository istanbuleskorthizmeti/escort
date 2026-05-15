import https from 'https';

const CF_TOKEN = 'cfat_JwtaN2nqkC7QxGItIaAbu2nA6TyojAqHS7DWfvpse525d170';
const DOMAIN = 'exxvideos.shop';

async function apiCall(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.cloudflare.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${CF_TOKEN}`,
        'Content-Type': 'application/json',
      },
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
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log(`🧹 Attempting to remove Worker Routes for ${DOMAIN}...`);

  // 1. Find Zone ID
  const zones = await apiCall(`/client/v4/zones?name=${DOMAIN}`);
  if (!zones.result || zones.result.length === 0) {
    console.error('❌ Zone not found');
    return;
  }
  const zoneId = zones.result[0].id;
  console.log(`✅ Zone ID: ${zoneId}`);

  // 2. List Routes
  const routesRes = await apiCall(`/client/v4/zones/${zoneId}/workers/routes`);
  if (!routesRes.success) {
    console.error('❌ Failed to list routes:', JSON.stringify(routesRes, null, 2));
    return;
  }

  const routes = routesRes.result || [];
  console.log(`📊 Found ${routes.length} routes.`);

  for (const route of routes) {
    console.log(`🗑️ Deleting route: ${route.id} (${route.pattern}) -> ${route.script}`);
    const delRes = await apiCall(`/client/v4/zones/${zoneId}/workers/routes/${route.id}`, 'DELETE');
    if (delRes.success) {
      console.log(`✅ Successfully deleted.`);
    } else {
      console.error(`❌ Failed to delete:`, JSON.stringify(delRes, null, 2));
    }
  }

  console.log('🏁 Process complete. If routes were deleted, exxvideos.shop is now FREE from the Edge Worker!');
}

run();
