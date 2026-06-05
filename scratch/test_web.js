import axios from 'axios';

async function testWeb() {
  console.log('📡 Fetching https://istanbulescdrkcn.com/ with 30s timeout...');
  try {
    const res = await axios.get('https://istanbulescdrkcn.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 30000,
      validateStatus: () => true
    });
    console.log('✅ Server Responded! Status:', res.status);
    console.log('Headers:', res.headers);
  } catch (err) {
    console.error('❌ Request Failed:', err.message);
  }
}

testWeb();
