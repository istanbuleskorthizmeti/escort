import dns from 'dns';

const domains = [
  'istanbulescdrkcn.com',
  'vipescorthizmeti.com',
  'dorukcanay.digital',
  'escortvip.net'
];

function resolveDomain(domain: string): Promise<string[]> {
  return new Promise((resolve) => {
    dns.resolve4(domain, (err, addresses) => {
      if (err) {
        resolve([`FAILED: ${err.message}`]);
      } else {
        resolve(addresses);
      }
    });
  });
}

async function checkDns() {
  console.log('📡 Resolving DNS A records locally...');
  for (const domain of domains) {
    const ips = await resolveDomain(domain);
    console.log(`🌐 ${domain} -> ${ips.join(', ')}`);
  }
}

checkDns();
