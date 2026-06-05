const dns = require('dns').promises;

const domains = [
  'istanbulescdrkcn.com',
  'vipescorthizmeti.com',
  'bagcilarescort.shop',
  'eczane.istanbulescdrkcn.com'
];

async function run() {
  for (const domain of domains) {
    try {
      const ips = await dns.resolve4(domain);
      console.log(`Domain: ${domain} => IPs: ${ips.join(', ')}`);
    } catch (e) {
      console.error(`Domain: ${domain} => Error: ${e.message}`);
    }
  }
}
run();
