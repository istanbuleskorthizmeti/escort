import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CF_API_TOKEN = process.env.CF_API_TOKEN;

async function checkMoneyZone() {
  const headers = {
    'Authorization': `Bearer ${CF_API_TOKEN}`,
    'Content-Type': 'application/json'
  };

  try {
    console.log('📡 Searching for istanbulescdrkcn.com zone...');
    const res = await axios.get('https://api.cloudflare.com/client/v4/zones?name=istanbulescdrkcn.com', { headers });
    console.log('Result:', JSON.stringify(res.data.result, null, 2));
  } catch (err) {
    console.error('Failed:', err.response?.data || err.message);
  }
}

checkMoneyZone();
