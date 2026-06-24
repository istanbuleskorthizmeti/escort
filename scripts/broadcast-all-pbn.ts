import { prisma } from '../lib/prisma';
import { googleIndexing } from '../lib/google-indexing';

async function run() {
  console.log('📡 Fetching all PBN encyclopedia articles for index broadcasting...');
  
  const contents = await prisma.pageContent.findMany({
    where: {
      slug: { startsWith: 'ansiklopedi-' }
    },
    include: {
      site: true
    }
  });

  console.log(`📦 Found ${contents.length} pages in the database.`);

  let googleCount = 0;
  let indexNowCount = 0;

  for (const page of contents) {
    if (!page.site || page.site.status !== 'ACTIVE') continue;

    const url = `https://${page.site.domain}/${page.slug}`;

    // 1. Submit to IndexNow (Bing & Yandex) - No limits
    try {
      await googleIndexing.pingIndexNow(url);
      indexNowCount++;
    } catch (e: any) {
      console.error(`IndexNow error for ${url}:`, e.message);
    }

    // 2. Submit to Google Indexing API - Max 180 to avoid hitting 200 quota limit
    if (googleCount < 180) {
      try {
        const res = await googleIndexing.notifyUpdate(url);
        if (res && !res.error) {
          googleCount++;
          console.log(`🚀 [GOOGLE INDEXING] Submitted: ${url}`);
        } else if (res?.error) {
          console.warn(`[GOOGLE INDEXING] Quota or Auth error:`, res.error.message);
        }
      } catch (e: any) {
        console.error(`Google API error for ${url}:`, e.message);
      }
    }

    // Small delay to prevent network spam
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Also submit all sitemaps
  const activeSites = await prisma.site.findMany({ where: { status: 'ACTIVE' } });
  for (const site of activeSites) {
    try {
      await googleIndexing.pingGoogleSitemap(`https://${site.domain}/sitemap.xml`);
    } catch (e) {}
  }

  console.log(`🏁 Finished Index Broadcasting. Google API submissions: ${googleCount}, IndexNow submissions: ${indexNowCount}.`);
}

run().catch(console.error);
