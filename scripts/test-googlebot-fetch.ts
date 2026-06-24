import axios from 'axios';

async function testFetch(url: string) {
  console.log(`Testing URL: ${url}`);
  
  // Test 1: Normal browser User-Agent
  try {
    const resNormal = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      validateStatus: () => true
    });
    console.log(`[Normal Browser] Status: ${resNormal.status} ${resNormal.statusText}`);
    console.log(`[Normal Browser] Content-Type: ${resNormal.headers['content-type']}`);
    console.log(`[Normal Browser] Server: ${resNormal.headers['server']}`);
    console.log(`[Normal Browser] Body Preview: ${String(resNormal.data).substring(0, 200)}...`);
  } catch (err: any) {
    console.error(`[Normal Browser] Failed: ${err.message}`);
  }

  console.log("\n----------------------------------------\n");

  // Test 2: Googlebot User-Agent
  try {
    const resGooglebot = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      },
      validateStatus: () => true
    });
    console.log(`[Googlebot] Status: ${resGooglebot.status} ${resGooglebot.statusText}`);
    console.log(`[Googlebot] Content-Type: ${resGooglebot.headers['content-type']}`);
    console.log(`[Googlebot] Server: ${resGooglebot.headers['server']}`);
    console.log(`[Googlebot] Body Preview: ${String(resGooglebot.data).substring(0, 200)}...`);
  } catch (err: any) {
    console.error(`[Googlebot] Failed: ${err.message}`);
  }
}

testFetch('https://istanbul-eskort-hizmeti.readme.io/docs/istanbul-avcilar-escort');
