import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_EMAIL = process.env.CF_EMAIL;

async function testGlobal() {
  console.log('Testing authentication as Global API Key (X-Auth-Email + X-Auth-Key)...');
  try {
    const res = await axios.get('https://api.cloudflare.com/client/v4/user/tokens/verify', {
      headers: {
        'X-Auth-Email': CF_EMAIL,
        'X-Auth-Key': CF_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    console.log('Global Auth Success:', res.data);
  } catch (err: any) {
    console.error('Global Auth Failed:', err.response?.data || err.message);
  }
}

testGlobal();
