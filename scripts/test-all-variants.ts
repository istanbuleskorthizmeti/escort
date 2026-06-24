import axios from 'axios';

const variants = [
  'http://istanbul-eskort-hizmeti.readme.io/robots.txt',
  'https://istanbul-eskort-hizmeti.readme.io/robots.txt',
  'http://istanbul-eskort-hizmeti.readme.io/sitemap.xml',
  'https://istanbul-eskort-hizmeti.readme.io/sitemap.xml'
];

async function testVariant(url: string) {
  console.log(`\nTesting: ${url}`);
  try {
    const res = await axios.get(url, {
      maxRedirects: 5,
      validateStatus: () => true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    console.log(`Status: ${res.status} ${res.statusText}`);
    console.log(`Content-Length: ${res.headers['content-length']}`);
    console.log(`Content-Type: ${res.headers['content-type']}`);
    console.log(`Headers:`, {
      server: res.headers['server'],
      'cf-cache-status': res.headers['cf-cache-status'],
      location: res.headers['location']
    });
    console.log(`Body preview: ${typeof res.data === 'string' ? res.data.substring(0, 100).replace(/\n/g, ' ') : '[binary/object]'}`);
  } catch (err: any) {
    console.error(`Failed: ${err.message}`);
  }
}

async function run() {
  for (const url of variants) {
    await testVariant(url);
  }
}

run();
