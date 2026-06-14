import axios from 'axios';

async function checkHttp() {
  const cfIp = '104.21.0.182';
  const domain = 'istanbulescort.blog';
  
  console.log(`🌐 Connecting to HTTP ${cfIp} with Host: ${domain}...`);
  try {
    const res = await axios.get(`http://${cfIp}/`, {
      headers: { 'Host': domain },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });
    console.log('HTTP Status:', res.status);
    console.log('HTTP Headers:', JSON.stringify(res.headers, null, 2));
  } catch (err) {
    if (err.response) {
      console.log('HTTP Response Error Status:', err.response.status);
      console.log('HTTP Response Error Headers:', JSON.stringify(err.response.headers, null, 2));
    } else {
      console.error('Connection Error:', err.message);
    }
  }
}

checkHttp();
