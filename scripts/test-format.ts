import axios from 'axios';

async function testFormat(name: string, proxyUrl: string) {
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

    console.log(`📡 Testing: ${name}...`);
    const res = await axios.get('https://ipinfo.io/json', config);
    console.log(`✅ Success for ${name}! IP: ${res.data.ip}, Country: ${res.data.country}, Region: ${res.data.region}`);
    return true;
  } catch (err: any) {
    console.log(`❌ Failed for ${name}:`, err.response?.data || err.message);
    return false;
  }
}

async function run() {
  // Format 1: Suffix on password
  const f1 = 'http://8U8ZZHjMiUiPdnF:P3ZbAc2rvW4xd9K_country-TR_region-istanbul_session-27696685_ttl-10@thehub.proxy-cheap.com:8080';
  await testFormat('Format 1 (Suffix on Password)', f1);

  // Format 2: Suffix on username
  const f2 = 'http://8U8ZZHjMiUiPdnF_country-TR_region-istanbul_session-27696685_ttl-10:P3ZbAc2rvW4xd9K@thehub.proxy-cheap.com:8080';
  await testFormat('Format 2 (Suffix on Username)', f2);
}

run();
