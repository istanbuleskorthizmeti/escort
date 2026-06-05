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
    console.log('=== Fetching Zones ===');
    const zones = await apiCall('/client/v4/zones');
    if (!zones.success) {
      console.error('Failed to fetch zones:', zones);
      return;
    }

    console.log(`Found ${zones.result.length} zones.`);
    for (const zone of zones.result) {
      console.log(`\nZone: ${zone.name} (ID: ${zone.id})`);
      
      console.log(`- Fetching DNS Records...`);
      const records = await apiCall(`/client/v4/zones/${zone.id}/dns_records`);
      if (records.success) {
        for (const record of records.result) {
          console.log(`  [${record.type}] ${record.name} => ${record.content} (Proxied: ${record.proxied})`);
        }
      } else {
        console.error(`  Failed to fetch DNS records:`, records);
      }

      console.log(`- Fetching SSL Settings...`);
      const ssl = await apiCall(`/client/v4/zones/${zone.id}/settings/ssl`);
      if (ssl.success) {
        console.log(`  SSL Mode: ${ssl.result.value}`);
      } else {
        console.error(`  Failed to fetch SSL settings:`, ssl);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
run();
