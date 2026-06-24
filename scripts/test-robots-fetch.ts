import axios from 'axios';

async function testRobots() {
  const url = 'https://istanbul-eskort-hizmeti.readme.io/robots.txt';
  console.log(`Fetching robots.txt: ${url}`);
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      },
      validateStatus: () => true
    });
    console.log(`Status: ${res.status} ${res.statusText}`);
    console.log(`Headers:`, res.headers);
    console.log(`Content:\n${res.data}`);
  } catch (err: any) {
    console.error(`Failed: ${err.message}`);
  }
}

testRobots();
