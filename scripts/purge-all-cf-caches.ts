import { cloudflareManager } from '../lib/seo/cloudflare-manager';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('🧹 [CLOUDFLARE CACHE PURGER] Starting mass purge of CDN cache for all zones...');
  console.log('---------------------------------------------------------------------------------');

  try {
    const zones = await cloudflareManager.listZones();
    if (!zones || zones.length === 0) {
      console.error('❌ Could not load Cloudflare zones. Check credentials.');
      return;
    }

    console.log(`Found ${zones.length} zones. Triggering cache purges...`);

    for (const zone of zones) {
      console.log(`🌀 Purging cache for: ${zone.name} (${zone.id})`);
      await cloudflareManager.purgeCache(zone.id);
      // Wait briefly to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    console.log('\n🏆 [SUCCESS] All Cloudflare caches have been purged successfully!');

  } catch (error: any) {
    console.error('❌ Critical error during cache purge:', error.message);
  }
}

main();
