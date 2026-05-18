import axios from 'axios';

async function run() {
  const directUrl = 'https://vipescorthizmeti.com/api/seo?host=vipescorthizmeti.com&file=sitemap.xml';
  console.log(`📡 FETCHING DIRECT API: ${directUrl}...`);
  try {
    const res = await axios.get(directUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Host': 'vipescorthizmeti.com'
      }
    });
    console.log('STATUS:', res.status);
    console.log('CONTENT-TYPE:', res.headers['content-type']);
    console.log('BODY (FIRST 200 CHARS):', res.data.slice(0, 200));
  } catch (err: any) {
    console.error('💥 DIRECT FETCH ERROR:', err.message);
  }

  const sitemapUrl = 'https://vipescorthizmeti.com/sitemap.xml';
  console.log(`\n📡 FETCHING REWRITTEN: ${sitemapUrl}...`);
  try {
    const res = await axios.get(sitemapUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Host': 'vipescorthizmeti.com'
      }
    });
    console.log('STATUS:', res.status);
    console.log('CONTENT-TYPE:', res.headers['content-type']);
    console.log('BODY (FIRST 200 CHARS):', res.data.slice(0, 200));
  } catch (err: any) {
    console.error('💥 REWRITTEN FETCH ERROR:', err.message);
  }
}

run();
