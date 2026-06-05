import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const zoneId = 'dec506a3da6a0231ffe8f3f921ded5ea'; // istanbulescdrkcn.com

async function getDns() {
  const headers = {
    'Authorization': `Bearer ${CF_API_TOKEN}`,
    'Content-Type': 'application/json'
  };

  try {
    console.log('📡 Fetching DNS records for istanbulescdrkcn.com...');
    const res = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, { headers });
    console.log('DNS Records:', JSON.stringify(res.data.result.map(r => ({
      type: r.type,
      name: r.name,
      content: r.content,
      proxied: r.proxied
    })), null, 2));
  } catch (err) {
    console.error('Failed to fetch DNS records:', err.response?.data || err.message);
  }
}

getDns();
