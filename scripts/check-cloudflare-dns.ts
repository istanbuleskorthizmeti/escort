import fetch from 'node-fetch';

async function run() {
  const token = 'cfat_XZOqfgE0ToGskESZ6SMEgboAVeGeZz1rcXBdIIona3784f9f';
  const zoneName = 'dorukcanay.digital';

  try {
    // 1. Get Zone ID
    const zonesRes = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${zoneName}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const zonesData = (await zonesRes.json()) as any;
    if (!zonesData.success || zonesData.result.length === 0) {
      console.error('❌ Failed to find zone:', zonesData.errors);
      return;
    }

    const zoneId = zonesData.result[0].id;
    console.log(`✅ Found Zone ID for ${zoneName}: ${zoneId}`);

    // 2. Get DNS Records
    const dnsRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const dnsData = (await dnsRes.json()) as any;
    if (!dnsData.success) {
      console.error('❌ Failed to get DNS records:', dnsData.errors);
      return;
    }

    console.log('\n📋 DNS Records:');
    for (const record of dnsData.result) {
      console.log(`- ${record.type} ${record.name} -> ${record.content} (Proxied: ${record.proxied})`);
    }

  } catch (err: any) {
    console.error('💥 Error:', err.message);
  }
}

run();
