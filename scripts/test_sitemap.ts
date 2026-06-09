import axios from 'axios';

async function run() {
  const urls = [
    'https://istanbulescort.blog/api/seo?host=istanbulescort.blog&file=sitemap.xml',
    'https://istanbulescort.blog/sitemap.xml',
    'https://istanbulescort.blog/sitemap-index.xml',
    'https://istanbulescort.blog/sitemap-districts.xml',
    'https://istanbulescort.blog/sitemap-categories.xml'
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
