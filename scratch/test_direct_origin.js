const axios = require('axios');

async function run() {
  console.log('=== CURLING ORIGIN IP DIRECTLY (PORT 80) ===');
  try {
    const res = await axios.get('http://187.77.111.203/', {
      timeout: 8000,
      headers: {
        'Host': 'istanbulescort.blog',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    console.log(`✅ Success (Port 80)! Status code: ${res.status}`);
  } catch (e) {
    console.error(`❌ Failed (Port 80): ${e.message}`);
  }

  console.log('\n=== CURLING ORIGIN IP DIRECTLY (PORT 443) ===');
  try {
    const res = await axios.get('https://187.77.111.203/', {
      timeout: 8000,
      headers: {
        'Host': 'istanbulescort.blog',
        'User-Agent': 'Mozilla/5.0'
      },
      // ignore self-signed cert
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
    });
    console.log(`✅ Success (Port 443)! Status code: ${res.status}`);
  } catch (e) {
    console.error(`❌ Failed (Port 443): ${e.message}`);
  }
}
run();
