import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🛰️ DRKCNAY HYDRA: SMART SEEDER (v1.0)
 * Persistent content injection using UPSERT logic.
 * Ensures NO DATA LOSS during updates.
 */

async function smartSeed() {
    console.log('🌱 [SMART SEED] Commencing non-destructive content sync...');

    const sampleContent = [
        {
            slug: 'home',
            title: 'DRKCNAY ELITE | VIP Escort Rehberi',
            description: 'İstanbul\'un en hiddetli ve %100 gerçek escort rehberi. Kaporasız randevu.',
            siteId: 'global'
        },
        // More content mappings for 111 domains...
    ];

    for (const item of sampleContent) {
        try {
            await prisma.pageContent.upsert({
                where: { 
                    slug_siteId: { slug: item.slug, siteId: item.siteId } 
                },
                update: {
                    title: item.title,
                    description: item.description,
                    // DO NOT overwrite special fields unless needed
                },
                create: {
                    slug: item.slug,
                    siteId: item.siteId,
                    title: item.title,
                    description: item.description,
                }
            });
            console.log(`✅ [SYNCED] ${item.slug}`);
        } catch (e) {
            console.error(`❌ [SYNC ERROR] Failed for ${item.slug}:`, e);
        }
    }

    console.log('🏁 [SMART SEED COMPLETE] All content is persistent and updated.');
}

if (require.main === module) {
    smartSeed().catch(console.error);
}
