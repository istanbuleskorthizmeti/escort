import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

async function test() {
  const proxyUrl = process.env.PREMIUM_PROXY_URL;
  if (!proxyUrl) {
    console.error('❌ PREMIUM_PROXY_URL is not set in .env.');
    return;
  }

  try {
    const urlObj = new URL(proxyUrl);
    const config = {
      proxy: {
        protocol: urlObj.protocol.replace(':', ''),
        host: urlObj.hostname,
        port: parseInt(urlObj.port),
        auth: {
          username: decodeURIComponent(urlObj.username),
          password: decodeURIComponent(urlObj.password)
        }
      },
      timeout: 60000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    };

    console.log('📡 Fetching sitemap through residential proxy...');
    const res = await axios.get('https://istanbul-eskort-hizmeti.readme.io/sitemap.xml', config);
    console.log('✅ Retrieval Successful!');
    console.log(`Status: ${res.status}`);
    console.log(`Headers Content-Type: ${res.headers['content-type']}`);
    console.log(`Snippet: ${res.data.substring(0, 500)}`);
  } catch (err: any) {
    console.error('❌ Fetch via Proxy Failed!');
    console.error('Detail:', err.response?.data || err.message);
  }
}

test();
