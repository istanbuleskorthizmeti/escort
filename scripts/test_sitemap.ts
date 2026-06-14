import axios from 'axios';

async function run() {
  const urls = [
    'http://127.0.0.1:3001/sitemap.xml',
    'http://127.0.0.1:3001/sitemap-index.xml',
    'http://127.0.0.1:3001/sitemap-districts.xml',
    'http://127.0.0.1:3001/sitemap-categories.xml'
  ];

  for (const sitemapUrl of urls) {
    console.log(`\n📡 FETCHING SITEMAP: ${sitemapUrl}...`);
    try {
      const res = await axios.get(sitemapUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Host': 'istanbulescort.blog'
        }
      });
      console.log('STATUS:', res.status);
      console.log('CONTENT-TYPE:', res.headers['content-type']);
      console.log('BODY (FIRST 200 CHARS):', res.data.slice(0, 200));
    } catch (err: any) {
      console.error('💥 FETCH ERROR:', err.message);
    }
  }
}

run();
