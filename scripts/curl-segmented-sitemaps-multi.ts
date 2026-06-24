import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();
const config = {
  host: '31.97.79.34',
  port: 22,
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

const domains = [
  'istanbulescort.blog',
  'istanbulescorthizmeti.shop',
  'kucukcekmecescort.shop'
];

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    for (const dom of domains) {
      console.log(`\n=================== DOMAIN: ${dom} ===================`);
      const segments = [
        'sitemap-index.xml',
        'sitemap.xml',
        'sitemap-districts.xml',
        'sitemap-categories.xml',
        'sitemap-vip.xml'
      ];

      for (const seg of segments) {
        console.log(`📡 Fetching ${seg}...`);
        const result = await ssh.execCommand(`curl -s -H "Host: ${dom}" http://127.0.0.1:3001/${seg}`);
        const xml = result.stdout;
        if (!xml || xml.includes('500') || xml.includes('Error')) {
          console.log(`❌ Error fetching ${seg}`);
          continue;
        }

        const urlCount = (xml.match(/<url>/g) || []).length;
        const sitemapCount = (xml.match(/<sitemap>/g) || []).length;
        console.log(`   Count: ${urlCount || sitemapCount} tags`);
        if (urlCount > 0) {
          const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]).slice(0, 2);
          console.log(`   Samples:`, urls);
        }
      }
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
