const axios = require('axios');

async function forceAlexhost() {
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
    console.log('🔍 Fetching ALL zones from Cloudflare...');
    const zonesRes = await client.get('/zones?per_page=50');
    const zones = zonesRes.data.result;

    console.log(`📡 Found ${zones.length} zones.`);

    for (const zone of zones) {
      console.log(`\n🌐 [ZONE] ${zone.name}`);
      
      // Fetch ALL A records
      const dnsRes = await client.get(`/zones/${zone.id}/dns_records?type=A`);
      const records = dnsRes.data.result;

      for (const record of records) {
        console.log(`  - Record: ${record.name} (Current IP: ${record.content})`);
        
        if (record.content !== TARGET_IP) {
          console.log(`  📍 [UPDATING] ${record.name} -> ${TARGET_IP}`);
          try {
            await client.patch(`/zones/${zone.id}/dns_records/${record.id}`, {
              content: TARGET_IP,
              proxied: !record.name.startsWith('direct') // Proxy everything except 'direct'
            });
            console.log(`  ✅ [SUCCESS] Updated ${record.name}`);
          } catch (err) {
            console.error(`  ❌ [FAILED] Update ${record.name}:`, err.response?.data || err.message);
          }
        } else {
          console.log(`  ✨ [OK] Record is already pointing to Alexhost.`);
        }
      }
    }
    console.log('\n🏁 [FINAL] All Cloudflare zones have been forced to Alexhost.');
  } catch (e) {
    console.error('❌ [FATAL] Cloudflare Global Sync Error:', e.response?.data || e.message);
  }
}

forceAlexhost();
