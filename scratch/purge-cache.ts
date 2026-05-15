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
  console.log(`🧹 Purging cache for ${DOMAIN}...`);
  const zones = await apiCall(`/client/v4/zones?name=${DOMAIN}`);
  if (!zones.result || zones.result.length === 0) {
    console.log('❌ Zone not found');
    return;
  }
  const zoneId = zones.result[0].id;
  
  const purgeRes = await apiCall(`/client/v4/zones/${zoneId}/purge_cache`, 'POST', { purge_everything: true });
  console.log('Purge Response:', JSON.stringify(purgeRes, null, 2));
}

run();
