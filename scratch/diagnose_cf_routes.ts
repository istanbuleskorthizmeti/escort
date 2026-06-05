import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;

async function diagnoseRoutes() {
  console.log('Testing Cloudflare Token Token Verification API...');
  try {
    const verifyRes = await axios.get('https://api.cloudflare.com/client/v4/user/tokens/verify', {
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Token verification response:', JSON.stringify(verifyRes.data, null, 2));
  } catch (err: any) {
    console.error('Token verification check failed:', err.response?.data || err.message);
  }

  console.log('\nFetching first zone to test routing...');
  try {
    const zonesRes = await axios.get('https://api.cloudflare.com/client/v4/zones?per_page=1', {
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (zonesRes.data.result && zonesRes.data.result.length > 0) {
      const zone = zonesRes.data.result[0];
      console.log(`Testing route creation for zone: ${zone.name} (${zone.id})...`);
      
      const routeRes = await axios.post(`https://api.cloudflare.com/client/v4/zones/${zone.id}/workers/routes`, {
        pattern: `test-route.${zone.name}/*`,
        script: 'hydra-honeypot'
      }, {
        headers: {
          'Authorization': `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Route creation success:', routeRes.data);
    } else {
      console.log('No zones found under this token.');
    }
  } catch (err: any) {
    console.error('Zone / Route test failed:', err.response?.data || err.message);
  }
}

diagnoseRoutes();
