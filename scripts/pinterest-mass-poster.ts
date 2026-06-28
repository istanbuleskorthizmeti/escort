import * as path from 'path';
import * as fs from 'fs';
import { prisma } from '../lib/prisma';
import { pinterestService } from '../lib/seo/pinterest';
import { MASTER_VIP_PROFILES } from '../config/vip-profiles';

async function runPinterestPoster() {
  console.log('🧛‍♂️ [PINTEREST HYDRA POSTER] Starting Pinterest mass pinning operation...');

  // 1. Check system settings for Pinterest cookies
  const setting = await prisma.systemSetting.findUnique({ where: { key: 'PINTEREST_COOKIES' } });
  if (!setting || !setting.value) {
    console.error('❌ Error: PINTEREST_COOKIES not found in database. Please authenticate and add cookies to continue.');
    console.log('\n💡 HOW TO COLLECT COOKIES:');
    console.log('1. Log into your Pinterest account on your Chrome/Edge browser.');
    console.log('2. Install "EditThisCookie" or "Get Cookie.txt in JSON" extension.');
    console.log('3. Export your cookies in JSON format.');
    console.log('4. Insert the JSON string into the "SystemSetting" table in database with key "PINTEREST_COOKIES".');
    return;
  }

  console.log('✅ Pinterest cookies loaded.');

  // 2. Fetch pages that haven't been pinned to Pinterest
  // Get pages belonging to Money Sites or Satellites
  const pendingPages = await prisma.pageContent.findMany({
    where: {
      isPinterestPosted: false,
      siteId: { not: null }
    },
    include: {
      site: true
    },
    take: 5 // Limit to 5 pins per run to avoid spam detection
  });

  if (pendingPages.length === 0) {
    console.log('✔ No pending pages found for Pinterest pinning.');
    return;
  }

  console.log(`🔥 Found ${pendingPages.length} pending pages to pin.`);

  for (const page of pendingPages) {
    if (!page.site) continue;
    
    const domain = page.site.domain;
    const targetUrl = `https://${domain}/${page.slug}`;
    const pageTitle = page.title || 'VIP Escort Bayan İlanları';

    console.log(`\n📌 Preparing Pin for: ${targetUrl}`);

    // Choose random profile image
    const randomProfile = MASTER_VIP_PROFILES[Math.floor(Math.random() * MASTER_VIP_PROFILES.length)];
    const relativeImagePath = randomProfile.image.replace(/^\//, ''); // Clean leading slash
    const absoluteImagePath = path.join(process.cwd(), 'public', relativeImagePath);

    // Verify image file exists
    if (!fs.existsSync(absoluteImagePath)) {
      console.warn(`⚠️ Warning: Image file not found at ${absoluteImagePath}, skipping this page.`);
      continue;
    }

    const description = `${pageTitle}. Doğrulanmış elit model ilanları, güvenilir ve %100 kaporasız randevu. Tel: +90 501 635 50 53. #escort #istanbul #vip #kaporasiz #eskort`;

    try {
      console.log(`🚀 Executing puppeteer pin builder for: "${pageTitle}" using image: ${relativeImagePath}`);
      const pinUrl = await pinterestService.createPin({
        title: pageTitle.substring(0, 95), // Pinterest title limit is 100
        description: description.substring(0, 495), // Pinterest desc limit is 500
        link: targetUrl,
        imagePath: absoluteImagePath
      });

      // Update database
      await prisma.pageContent.update({
        where: { id: page.id },
        data: {
          isPinterestPosted: true,
          pinterestPostUrl: pinUrl
        }
      });

      console.log(`✅ Successfully pinned page! URL: ${pinUrl}`);

      // Wait a moment between pins to act human-like
      console.log('⏳ Waiting 15 seconds to simulate human behavior...');
      await new Promise(resolve => setTimeout(resolve, 15000));

    } catch (err: any) {
      console.error(`❌ Failed pinning to Pinterest for ${targetUrl}:`, err.message);
    }
  }

  console.log('\n🏆 [FINISHED] Pinterest mass posting operation complete.');
}

runPinterestPoster().catch(console.error);
