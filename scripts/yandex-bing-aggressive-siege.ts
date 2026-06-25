import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const INDEXNOW_KEY = '8f7c9e0a2b4d6f8a0c2e4f6a8b0d2e4f';
const INDEXNOW_ENDPOINTS = [
  'https://yandex.com/indexnow',
  'https://www.bing.com/indexnow',
  'https://api.indexnow.org/indexnow'
];

async function main() {
  console.log('🔥 [YANDEX & BING INDEXER] Starting aggressive IndexNow deployment...');
  console.log('----------------------------------------------------------------------');

  const activeSites = await prisma.site.findMany({
    where: { status: 'ACTIVE' }
  });

  console.log(`📡 Found ${activeSites.length} active domains in database.`);

  let totalSubmitted = 0;

  for (const site of activeSites) {
    const pages = await prisma.pageContent.findMany({
      where: { siteId: site.id }
    });

    if (pages.length === 0) {
      console.log(`   ⏭️ [${site.domain}] No pages found, skipping.`);
      continue;
    }

    const urls = pages.map(p => {
      const slugPart = p.slug === '' || p.slug === 'home' || p.slug === 'index' ? '' : p.slug;
      return `https://${site.domain}/${slugPart}`.replace(/\/+$/, ''); // Remove trailing slashes
    });

    console.log(`   📦 [${site.domain}] Prepared ${urls.length} URLs for submission.`);

    // Batch URLs in chunks of 500
    const chunkSize = 500;
    for (let i = 0; i < urls.length; i += chunkSize) {
      const batch = urls.slice(i, i + chunkSize);
      
      const payload = {
        host: site.domain,
        key: INDEXNOW_KEY,
        keyLocation: `https://${site.domain}/${INDEXNOW_KEY}.txt`,
        urlList: batch
      };

      console.log(`      🚀 Sending batch ${Math.floor(i / chunkSize) + 1} (${batch.length} URLs)...`);

      for (const endpoint of INDEXNOW_ENDPOINTS) {
        try {
          const res = await axios.post(endpoint, payload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 8000
          });
          console.log(`         ✅ [${endpoint}] Status: ${res.status} (${res.statusText})`);
        } catch (err: any) {
          console.log(`         ❌ [${endpoint}] Failed: ${err.response?.status || err.message}`);
        }
      }
      totalSubmitted += batch.length;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('----------------------------------------------------------------------');
  console.log(`🏆 [MISSION SUCCESS] Aggressive IndexNow completed. Submitted ${totalSubmitted} total URLs.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
