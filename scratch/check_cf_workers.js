const https = require('https');

const CF_TOKEN = 'cfat_JwtaN2nqkC7QxGItIaAbu2nA6TyojAqHS7DWfvpse525d170';

async function apiCall(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Authorization': `Bearer ${CF_TOKEN}`,
      'Content-Type': 'application/json'
    };

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
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  try {
    const zones = await apiCall('/client/v4/zones?per_page=50');
    if (!zones.success) {
      console.error('Failed to fetch zones:', zones);
      return;
    }

    console.log(`Checking ${zones.result.length} zones for Worker routes...`);
    for (const zone of zones.result) {
      const routes = await apiCall(`/client/v4/zones/${zone.id}/workers/routes`);
      if (routes.success && routes.result.length > 0) {
        console.log(`\nZone: ${zone.name}`);
        for (const route of routes.result) {
          console.log(`  Route: ${route.pattern} => Script: ${route.script}`);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}
run();
