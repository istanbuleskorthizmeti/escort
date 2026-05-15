const https = require('https');
const fs = require('fs');
const path = require('path');

async function checkTib() {
  const content = fs.readFileSync(path.join(__dirname, 'config/domains.ts'), 'utf8');
  const hosts = [...content.matchAll(/host:\s*'([^']+)'/g)].map(m => m[1]);
  
  console.log(`🕵️‍♂️ TİB/BTK DEDEKTÖRÜ (GHOST MODE) ÇALIŞIYOR (${hosts.length} Domain)...`);
  
  for (const host of hosts) {
    const options = {
      hostname: host,
      port: 443,
      path: '/',
      method: 'GET',
      timeout: 5000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const body = data.toLowerCase();
        if (body.includes('bilgi teknolojileri') || body.includes('idari tedbir') || body.includes('mahkeme karari')) {
          console.log(`🚫 [TİB] ${host.padEnd(35)} | BTK ENGELİ!`);
        } else {
          console.log(`✅ [OK]  ${host.padEnd(35)} | Status: ${res.statusCode}`);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`❌ [DEAD] ${host.padEnd(35)} | ${e.message}`);
    });
    
    req.on('timeout', () => {
       req.destroy();
       console.log(`⌛ [TIME] ${host.padEnd(35)} | TIMEOUT`);
    });

    req.end();
  }
}

checkTib();
