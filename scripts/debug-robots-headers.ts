import axios from 'axios';

async function run() {
  const url = 'https://istanbul-eskort-hizmeti.readme.io/robots.txt';
  console.log(`Fetching ${url} and inspecting redirect/headers...`);
  try {
    const res = await axios.get(url, {
      maxRedirects: 10,
      validateStatus: () => true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    console.log("Status Code:", res.status);
    console.log("Status Text:", res.statusText);
    console.log("Headers:", res.headers);
    console.log("Response Body (first 200 chars):");
    console.log(typeof res.data === 'string' ? res.data.substring(0, 200) : res.data);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
