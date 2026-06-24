import axios from 'axios';

async function inspectSitemap() {
  const url = 'https://istanbul-eskort-hizmeti.readme.io/sitemap.xml';
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    console.log(`Status: ${res.status}`);
    console.log(`Content-Type: ${res.headers['content-type']}`);
    console.log(`Body length: ${res.data.length} bytes`);
    
    // Print first 1000 characters
    console.log("\nSitemap Content Preview:");
    console.log(res.data.substring(0, 1500));
    
    // Count URLs
    const matches = res.data.match(/<loc>(.*?)<\/loc>/g) || [];
    console.log(`\nTotal URLs in sitemap: ${matches.length}`);
    if (matches.length > 0) {
      console.log("First 5 URLs:");
      matches.slice(0, 5).forEach((m: string) => console.log(`  ${m}`));
      console.log("Last 5 URLs:");
      matches.slice(-5).forEach((m: string) => console.log(`  ${m}`));
    }
  } catch (err: any) {
    console.error("Error fetching sitemap:", err.message);
  }
}

inspectSitemap();
