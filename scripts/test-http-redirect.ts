import axios from 'axios';

async function testHttpRedirect() {
  const robotsUrl = 'http://istanbul-eskort-hizmeti.readme.io/robots.txt';
  const sitemapUrl = 'http://istanbul-eskort-hizmeti.readme.io/sitemap.xml';
  
  console.log(`Testing HTTP Robots: ${robotsUrl}`);
  try {
    const res = await axios.get(robotsUrl, {
      maxRedirects: 0,
      validateStatus: () => true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    console.log(`Status: ${res.status} ${res.statusText}`);
    console.log(`Location Header: ${res.headers['location']}`);
  } catch (err: any) {
    console.error(`Failed: ${err.message}`);
  }

  console.log("\n----------------------------------------\n");

  console.log(`Testing HTTP Sitemap: ${sitemapUrl}`);
  try {
    const res = await axios.get(sitemapUrl, {
      maxRedirects: 0,
      validateStatus: () => true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    console.log(`Status: ${res.status} ${res.statusText}`);
    console.log(`Location Header: ${res.headers['location']}`);
  } catch (err: any) {
    console.error(`Failed: ${err.message}`);
  }
}

testHttpRedirect();
