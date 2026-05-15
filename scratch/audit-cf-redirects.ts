import https from 'https';

const CF_TOKEN = 'cfat_JwtaN2nqkC7QxGItIaAbu2nA6TyojAqHS7DWfvpse525d170';
const DOMAIN = 'exxvideos.shop';

async function apiCall(path, method = 'GET') {
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
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log(`🔍 Checking Cloudflare for ${DOMAIN}...`);
  const zones = await apiCall(`/client/v4/zones?name=${DOMAIN}`);
  if (!zones.result || zones.result.length === 0) {
    console.log('❌ Zone not found');
    return;
  }
  const zoneId = zones.result[0].id;
  console.log(`✅ Zone ID: ${zoneId}`);

  console.log('--- PAGE RULES ---');
  const pageRules = await apiCall(`/client/v4/zones/${zoneId}/pagerules`);
  console.log(JSON.stringify(pageRules, null, 2));

  console.log('--- DYNAMIC REDIRECTS ---');
  const redirects = await apiCall(`/client/v4/zones/${zoneId}/rulesets/phases/http_request_dynamic_redirect/entrypoint`);
  console.log(JSON.stringify(redirects, null, 2));
}

run();
