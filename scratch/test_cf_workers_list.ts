import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;

async function listWorkers() {
  console.log('Testing reading workers...');
  try {
    const res = await axios.get(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/workers/scripts`, {
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Workers List Success:', res.data);
  } catch (err: any) {
    console.error('Workers List Failed:', err.response?.data || err.message);
  }
}

listWorkers();
