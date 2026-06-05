import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CF_API_TOKEN = process.env.CF_API_TOKEN;

async function verifyToken() {
  const headers = {
    'Authorization': `Bearer ${CF_API_TOKEN}`,
    'Content-Type': 'application/json'
  };

  try {
    console.log('📡 Verifying token scopes with Cloudflare User API...');
    const res = await axios.get('https://api.cloudflare.com/client/v4/user/tokens/verify', { headers });
    console.log('Token Status:', res.data.result.status);
    console.log('Verification Details:', JSON.stringify(res.data.result, null, 2));
  } catch (err) {
    console.error('Verification Failed:', err.response?.data || err.message);
  }
}

verifyToken();
