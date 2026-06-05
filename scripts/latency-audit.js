const axios = require('axios');

const SITES = [
  'istanbulescort.blog',
  'istanbulescdrkcn.com',
  'escortvip.net',
  'vipescorthizmeti.shop',
  'bagcilarescort.shop',
  'esenyurtescort.blog'
];

async function measureLatency(domain) {
  const url = `https://${domain}`;
  const start = Date.now();
  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000
    });
    const duration = Date.now() - start;
    console.log(`[${domain}] Status: ${response.status} | Load Time: ${duration}ms | Server: ${response.headers.server || 'Unknown'}`);
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[${domain}] Failed after ${duration}ms: ${error.message}`);
  }
}

async function run() {
  console.log('Starting HTTP Latency & TTFB Audits...');
  for (const site of SITES) {
    await measureLatency(site);
  }
}

run();
