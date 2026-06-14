import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_EMAIL = process.env.CF_EMAIL;
const zoneId = '793134edf1e811e91e2d1d6c98526f3c'; // istanbulescort.blog

async function getRulesets() {
  const headers = {
    'Authorization': `Bearer ${CF_API_TOKEN}`,
    'X-Auth-Email': CF_EMAIL,
    'Content-Type': 'application/json'
  };

  try {
    console.log(`🔍 Fetching rulesets list...`);
    const listRes = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets`, { headers });
    const rulesets = listRes.data.result;

    for (const rs of rulesets) {
      console.log(`\n----------------------------------------`);
      console.log(`Ruleset: ${rs.name} (${rs.phase}) - ID: ${rs.id}`);
      try {
        const detailRes = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/${rs.id}`, { headers });
        console.log('Rules:', JSON.stringify(detailRes.data.result.rules, null, 2));
      } catch (e) {
        console.log(`Failed to fetch rules for ${rs.name}:`, e.message);
      }
    }
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

getRulesets();
