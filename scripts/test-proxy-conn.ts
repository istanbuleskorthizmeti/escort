import 'dotenv/config';
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
      timeout: 10000
    };

    console.log('📡 Sending request through proxy to determine status and IP location...');
    const res = await axios.get('https://ipinfo.io/json', config);
    console.log('✅ Connection Successful!');
    console.log('📋 Response:');
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err: any) {
    console.error('❌ Connection Failed!');
    console.error('Detail:', err.response?.data || err.message);
  }
}

test();
