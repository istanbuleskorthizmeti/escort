import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CF_API_TOKEN = process.env.CF_API_TOKEN;

async function listZones() {
  const headers = {
    'Authorization': `Bearer ${CF_API_TOKEN}`,
    'Content-Type': 'application/json'
  };

  try {
    console.log('📡 Fetching all zones in Cloudflare account...');
    const res = await axios.get('https://api.cloudflare.com/client/v4/zones', { headers });
    console.log('Zones Found:', res.data.result.length);
    console.log(res.data.result.map(z => ({
      id: z.id,
      name: z.name,
      status: z.status,
      paused: z.paused
    })));
  } catch (err) {
    console.error('Failed to list zones:', err.response?.data || err.message);
  }
}

listZones();
