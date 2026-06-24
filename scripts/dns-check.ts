import { cloudflareManager } from '../lib/seo/cloudflare-manager';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CF_API_URL = 'https://api.cloudflare.com/client/v4';
const EXPECTED_IP = '31.97.79.34';

async function main() {
  console.log('🔍 [CLOUDFLARE DNS AUDIT] Listing all zones and verifying they point to new VPS...');
  console.log('---------------------------------------------------------------------------------');

  try {
    const zones = await cloudflareManager.listZones();
    if (!zones || zones.length === 0) {
      console.error('❌ Could not load Cloudflare zones. Check credentials.');
      return;
    }

    console.log(`Found ${zones.length} zones. Auditing DNS records...`);
    let correctlyPointed = 0;
    let misconfigured = 0;

    for (const zone of zones) {
      const headers = {
        'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      };

      try {
        const recordsRes = await axios.get(`${CF_API_URL}/zones/${zone.id}/dns_records?type=A`, { headers });
        const records = recordsRes.data.result;

        const rootRecord = records.find((r: any) => r.name === zone.name);
        const wildcardRecord = records.find((r: any) => r.name === `*.${zone.name}`);

        const rootIp = rootRecord ? rootRecord.content : 'MISSING';
        const wildcardIp = wildcardRecord ? wildcardRecord.content : 'MISSING';

        const isRootOk = rootIp === EXPECTED_IP;
        const isWildcardOk = wildcardIp === EXPECTED_IP;

        if (isRootOk && isWildcardOk) {
          correctlyPointed++;
          console.log(`✅ ${zone.name}: Root -> ${rootIp} | Wildcard -> ${wildcardIp}`);
        } else {
          misconfigured++;
          console.warn(`⚠️ ${zone.name}: Root -> ${rootIp} (expected ${EXPECTED_IP}) | Wildcard -> ${wildcardIp} (expected ${EXPECTED_IP})`);
        }
      } catch (err: any) {
        console.error(`❌ Failed to audit ${zone.name}:`, err.message);
      }
    }

    console.log('\n---------------------------------------------------------------------------------');
    console.log(`🏆 Audit complete!`);
    console.log(`   • Correctly configured: ${correctlyPointed}`);
    console.log(`   • Needing attention: ${misconfigured}`);

  } catch (error: any) {
    console.error('❌ Critical error during audit:', error.message);
  }
}

main();
