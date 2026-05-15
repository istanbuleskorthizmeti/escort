
import { cloudflareManager } from '../lib/seo/cloudflare-manager';

async function main() {
  const newIp = '34.40.30.140'; // Frankfurt Master IP
  await cloudflareManager.massSyncToNewIP(newIp);
}

main().catch(console.error);
