const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function check() {
  const content = fs.readFileSync(path.join(__dirname, '../config/domains.ts'), 'utf8');
  const hosts = [...content.matchAll(/host:\s*'([^']+)'/g)].map(m => m[1]);
  
  console.log(`--- CHECKING ${hosts.length} DOMAINS ---`);
  
  const results = [];
  for (const host of hosts) {
    try {
      const res = await axios.get(`https://${host}`, { timeout: 4000, validateStatus: () => true });
      console.log(`✅ ${host.padEnd(35)} | ${res.status}`);
      if (res.status !== 200) results.push(`${host} (${res.status})`);
    } catch (e) {
      console.log(`❌ ${host.padEnd(35)} | DEAD/TIMEOUT`);
      results.push(`${host} (DEAD)`);
    }
  }
  
  console.log('\n--- SUMMARY OF DEAD/NON-200 DOMAINS ---');
  console.log(results.join('\n') || 'All domains are 200 OK!');
}

check();
