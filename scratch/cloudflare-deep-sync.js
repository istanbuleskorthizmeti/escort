const axios = require('axios');

async function forceAlexhostDeep() {
  const API_TOKEN = 'cfat_JwtaN2nqkC7QxGItIaAbu2nA6TyojAqHS7DWfvpse525d170';
  const TARGET_IP = '213.232.235.181';

  const client = axios.create({
    baseURL: 'https://api.cloudflare.com/client/v4',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  try {
    let allZones = [];
    let page = 1;
    let hasMore = true;

    console.log('🔍 [DEEP SYNC] Fetching ALL zones (Paginated)...');

    while (hasMore) {
      const res = await client.get(`/zones?per_page=50&page=${page}`);
      const zones = res.data.result;
      allZones = allZones.concat(zones);
      
      console.log(`📡 Page ${page}: Found ${zones.length} zones.`);
      
      if (zones.length < 50) {
        hasMore = false;
      } else {
        page++;
      }
    }

    console.log(`✅ Total Zones Found: ${allZones.length}`);

    for (const zone of allZones) {
      console.log(`\n🌐 [ZONE] ${zone.name} (${zone.id})`);
      
      let dnsPage = 1;
      let dnsMore = true;

      while (dnsMore) {
        const dnsRes = await client.get(`/zones/${zone.id}/dns_records?type=A&per_page=100&page=${dnsPage}`);
        const records = dnsRes.data.result;

        for (const record of records) {
          console.log(`  - Record: ${record.name} [${record.type}] (Current IP: ${record.content})`);
          
          if (record.content !== TARGET_IP && !record.content.includes(':')) { // Skip IPv6
            console.log(`  📍 [UPDATING] ${record.name} -> ${TARGET_IP}`);
            try {
              await client.patch(`/zones/${zone.id}/dns_records/${record.id}`, {
                content: TARGET_IP,
                proxied: !record.name.startsWith('direct')
              });
              console.log(`  ✅ [SUCCESS] ${record.name} updated.`);
            } catch (err) {
              console.error(`  ❌ [FAILED] ${record.name}:`, err.response?.data || err.message);
            }
          } else {
            console.log(`  ✨ [OK] ${record.name} is correct.`);
          }
        }

        if (records.length < 100) {
          dnsMore = false;
        } else {
          dnsPage++;
        }
      }
    }
    console.log('\n🏁 [DEEP SYNC COMPLETE] Every zone and record has been audited.');
  } catch (e) {
    console.error('❌ [FATAL ERROR]:', e.response?.data || e.message);
  }
}

forceAlexhostDeep();
