const axios = require('axios');

async function test() {
  console.log('=== CURLING https://istanbulescort.blog/ ===');
  try {
    const res = await axios.get('https://istanbulescort.blog/', {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    console.log(`✅ Success! Status code: ${res.status}`);
    console.log(`Headers:`, res.headers);
    console.log(`HTML snippet:`, String(res.data).substring(0, 300));
  } catch (e) {
    console.error(`❌ Failed: ${e.message}`);
    if (e.response) {
      console.error(`Status: ${e.response.status}`);
      console.error(`Headers:`, e.response.headers);
      console.error(`HTML snippet:`, String(e.response.data).substring(0, 500));
    }
  }
}

test();
