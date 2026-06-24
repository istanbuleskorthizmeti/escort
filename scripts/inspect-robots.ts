import axios from 'axios';

async function inspectRobots() {
  const url = 'https://istanbul-eskort-hizmeti.readme.io/robots.txt';
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    console.log(`Status: ${res.status}`);
    console.log(`Content-Type: ${res.headers['content-type']}`);
    console.log(`Body length: ${res.data.length} bytes`);
    console.log("\nRobots.txt Content:");
    console.log(res.data);
  } catch (err: any) {
    console.error("Error fetching robots.txt:", err.message);
  }
}

inspectRobots();
