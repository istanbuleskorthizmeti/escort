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
    const zones = await apiCall('/client/v4/zones?name=vipescorthizmeti.com');
    if (!zones.success || zones.result.length === 0) {
      console.log('vipescorthizmeti.com not found in this account.');
      return;
    }

    const zone = zones.result[0];
    console.log(`Zone: ${zone.name} (ID: ${zone.id})`);
    
    const records = await apiCall(`/client/v4/zones/${zone.id}/dns_records`);
    if (records.success) {
      for (const record of records.result) {
        console.log(`  [${record.type}] ${record.name} => ${record.content} (Proxied: ${record.proxied})`);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
run();
