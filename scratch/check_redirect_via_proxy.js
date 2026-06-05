import axios from 'axios';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';

async function checkRedirect() {
  const proxyUrl = "http://pc9nVy0zY4-res_sc-tr_istanbul_istanbul:PC_95G1byocU9aBTp0TQ@proxy-eu.proxy-cheap.com:5959";
  const httpAgent = new HttpProxyAgent(proxyUrl);
  const httpsAgent = new HttpsProxyAgent(proxyUrl);
  
  console.log('📡 Requesting https://vipescorthizmeti.com/ via proxy...');
  try {
    const res = await axios.get('https://vipescorthizmeti.com/', {
      httpAgent,
      httpsAgent,
      maxRedirects: 0,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      validateStatus: (status) => status >= 200 && status < 400
    });
    
    console.log(`Status: ${res.status}`);
    console.log('Location:', res.headers.location);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
  } catch (err) {
    if (err.response) {
      console.log(`Response Error Status: ${err.response.status}`);
      console.log('Location:', err.response.headers.location);
      console.log('Headers:', JSON.stringify(err.response.headers, null, 2));
    } else {
      console.error('Request Error:', err.message);
    }
  }
}

checkRedirect();
