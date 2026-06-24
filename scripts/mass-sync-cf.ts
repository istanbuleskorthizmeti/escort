import { cloudflareManager } from '../lib/seo/cloudflare-manager';
import dotenv from 'dotenv';

dotenv.config();

const NEW_IP = '31.97.79.34';

async function main() {
  console.log('📡 [CLOUDFLARE DNS SYNC] Starting mass update to point all domains to new VPS...');
  console.log(`🌐 Target IP: ${NEW_IP}`);
  console.log('--------------------------------------------------------------------------');

  try {
    // 1. Fetch zones to make sure token works
    const zones = await cloudflareManager.listZones();
    if (!zones || zones.length === 0) {
      console.error('❌ Could not load Cloudflare zones. Check CF_API_TOKEN in .env');
      return;
    }

    console.log(`✅ Found ${zones.length} zones. Initiating mass migration sync...`);
    
    // 2. Perform mass sync
    await cloudflareManager.massSyncToNewIP(NEW_IP);

    console.log('\n🏆 [SUCCESS] Mass Cloudflare DNS migration complete!');
  } catch (error: any) {
    console.error('❌ Critical error during DNS sync:', error.message);
  }
}

main();
