import { GA4Service } from '../lib/seo/ga4';

async function main() {
  console.log('📊 [GA4-RUNNER] Starting GA4 Realtime Traffic Retrieval...');
  await GA4Service.sendRealtimeReport();
  console.log('🏁 [GA4-RUNNER] Finished.');
}

main().catch(console.error);
