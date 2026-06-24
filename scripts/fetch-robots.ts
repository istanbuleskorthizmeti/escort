import axios from 'axios';

async function run() {
  const robotsUrl = 'https://istanbul-eskort-hizmeti.readme.io/robots.txt';
  const sitemapUrl = 'https://istanbul-eskort-hizmeti.readme.io/sitemap.xml';
  
  console.log(`Fetching robots.txt from ${robotsUrl}...`);
  try {
    const res = await axios.get(robotsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    console.log("=== robots.txt Content ===");
    console.log(res.data);
  } catch (err: any) {
    console.error("Error fetching robots.txt:", err.message);
    if (err.response) {
      console.log("Status:", err.response.status);
      console.log("Headers:", err.response.headers);
    }
  }

  console.log(`\nFetching sitemap.xml from ${sitemapUrl}...`);
  try {
    const res = await axios.get(sitemapUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    console.log("=== sitemap.xml Content Summary ===");
    console.log(res.data.substring(0, 500));
  } catch (err: any) {
    console.error("Error fetching sitemap.xml:", err.message);
    if (err.response) {
      console.log("Status:", err.response.status);
      console.log("Headers:", err.response.headers);
    }
  }
}

run();
