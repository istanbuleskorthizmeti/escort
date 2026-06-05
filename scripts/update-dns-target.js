const https = require('https');

const CF_TOKEN = 'cfat_JwtaN2nqkC7QxGItIaAbu2nA6TyojAqHS7DWfvpse525d170';
const OLD_IP = '213.232.235.181';
const NEW_IP = '187.77.111.203';

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
    console.log('📡 Fetching all zones (page 1)...');
    const page1 = await apiCall('/client/v4/zones?per_page=50&page=1');
    console.log('📡 Fetching all zones (page 2)...');
    const page2 = await apiCall('/client/v4/zones?per_page=50&page=2');

    const zones = [
      ...(page1.result || []),
      ...(page2.result || [])
    ];

    console.log(`Found ${zones.length} zones total. Processing A records...`);
    let updatedCount = 0;

    for (const zone of zones) {
      console.log(`Checking zone: ${zone.name}`);
      const recordsRes = await apiCall(`/client/v4/zones/${zone.id}/dns_records`);
      if (!recordsRes.success) {
        console.error(`  ❌ Failed to get records for ${zone.name}`);
        continue;
      }

      for (const record of recordsRes.result) {
        if (record.type === 'A' && record.content === OLD_IP) {
          console.log(`  🔄 Updating [A] ${record.name} (${record.id}) from ${OLD_IP} to ${NEW_IP}...`);
          
          const updateRes = await apiCall(`/client/v4/zones/${zone.id}/dns_records/${record.id}`, 'PUT', {
            type: 'A',
            name: record.name,
            content: NEW_IP,
            ttl: record.ttl || 1, // 1 is automatic
            proxied: record.proxied
          });

          if (updateRes.success) {
            console.log(`    ✅ Updated successfully.`);
            updatedCount++;
          } else {
            console.error(`    ❌ Update failed:`, JSON.stringify(updateRes.errors));
          }
        }
      }
    }

    console.log(`\n🎉 Job completed! Total A records updated: ${updatedCount}`);
  } catch (e) {
    console.error('Fatal error during DNS migration:', e);
  }
}

run();
