const https = require('https');

require('dotenv').config();
const CF_TOKEN = process.env.CF_API_TOKEN || 'cfat_XZOqfgE0ToGskESZ6SMEgboAVeGeZz1rcXBdIIona3784f9f';

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
    const zones = await apiCall('/client/v4/zones?name=exxvideos.shop');
    if (!zones.success || zones.result.length === 0) {
      console.error('Failed to find zone or zone not found:', zones);
      return;
    }

    const zone = zones.result[0];
    console.log(`Zone: ${zone.name} (ID: ${zone.id})`);
    
    const records = await apiCall(`/client/v4/zones/${zone.id}/dns_records`);
    if (records.success) {
      for (const record of records.result) {
        console.log(`  [${record.type}] ${record.name} => ${record.content} (Proxied: ${record.proxied})`);
      }
    } else {
      console.error(`  Failed to fetch DNS records:`, records);
    }

    const ssl = await apiCall(`/client/v4/zones/${zone.id}/settings/ssl`);
    if (ssl.success) {
      console.log(`  SSL Mode: ${ssl.result.value}`);
    }

  } catch (e) {
    console.error(e);
  }
}
run();
