import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const zoneId = '793134edf1e811e91e2d1d6c98526f3c'; // istanbulescort.blog

async function testAuth() {
  // Use ONLY Bearer Token, do NOT send X-Auth-Email
  const headers = {
    'Authorization': `Bearer ${CF_API_TOKEN}`,
    'Content-Type': 'application/json'
  };

  try {
    console.log('📡 Testing Zone GET request with Token authentication...');
    const zoneRes = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}`, { headers });
    console.log('✅ Zone GET success:', zoneRes.data.success);

    console.log('\n📡 Testing Rulesets GET request...');
    const rulesetsRes = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets`, { headers });
    console.log('✅ Rulesets GET success. Found rulesets:', rulesetsRes.data.result.length);

    console.log('\n📡 Testing POSTing a dummy redirect rule query...');
    // We won't actually post, let's just see if we can read the dynamic redirect entrypoint
    const getRulesetRes = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/phases/http_request_dynamic_redirect/entrypoint`, { headers });
    console.log('✅ Dynamic Redirect Entrypoint GET success:', JSON.stringify(getRulesetRes.data.result, null, 2));
  } catch (err) {
    console.error('❌ Authorization Failed:');
    console.error(err.response?.data || err.message);
  }
}

testAuth();
