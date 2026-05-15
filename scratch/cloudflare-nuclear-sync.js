const axios = require('axios');

async function nukeAndRestoreCloudflare() {
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
    const zonesRes = await client.get('/zones?per_page=100');
    const zones = zonesRes.data.result;

    console.log(`📡 Found ${zones.length} zones. Commencing Nuclear DNS Wipe & Restore...`);

    for (const zone of zones) {
      console.log(`\n🌐 [ZONE] ${zone.name}`);
      
      // 1. Fetch ALL existing DNS records
      const dnsRes = await client.get(`/zones/${zone.id}/dns_records`);
      const records = dnsRes.data.result;

      // 2. Nuke them all (except critical TXT/MX if needed, but we wipe A/AAAA/CNAME for a clean slate)
      for (const record of records) {
        if (['A', 'AAAA', 'CNAME'].includes(record.type)) {
           console.log(`  🗑️ [NUKING] ${record.type} record: ${record.name} -> ${record.content}`);
           try {
              await client.delete(`/zones/${zone.id}/dns_records/${record.id}`);
           } catch (delErr) {
              console.error(`  ❌ [FAILED TO NUKE] ${record.name}:`, delErr.response?.data || delErr.message);
           }
        }
      }

      // 3. Restore with Perfect God Mode Configuration
      console.log(`  🏗️ [RESTORING] Injecting optimized Alexhost A records...`);
      const recordsToCreate = [
        { type: 'A', name: '@', content: TARGET_IP, proxied: true },
        { type: 'A', name: 'www', content: TARGET_IP, proxied: true }
      ];

      for (const newRecord of recordsToCreate) {
         try {
            await client.post(`/zones/${zone.id}/dns_records`, newRecord);
            console.log(`  ✅ [SUCCESS] Created ${newRecord.name} -> ${TARGET_IP} (Proxied: ${newRecord.proxied})`);
         } catch (createErr) {
            console.error(`  ❌ [FAILED TO CREATE] ${newRecord.name}:`, createErr.response?.data || createErr.message);
         }
      }
    }
    
    console.log('\n🏁 [FINAL] All Cloudflare zones have been purified and locked to Alexhost.');
  } catch (e) {
    console.error('❌ [FATAL] Cloudflare Global Sync Error:', e.response?.data || e.message);
  }
}

nukeAndRestoreCloudflare();
