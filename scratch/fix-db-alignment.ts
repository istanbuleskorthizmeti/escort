
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting Database Content Alignment...');
    
    // 1. Get the main site ID
    const mainSite = await prisma.site.findUnique({
        where: { domain: 'vipescorthizmeti.com' }
    });

    if (!mainSite) {
        console.error('❌ Main site not found!');
        return;
    }

    console.log(`🌐 Main Site ID: ${mainSite.id}`);

    // 2. Link orphan PageContents to main site
    const orphans = await prisma.pageContent.updateMany({
        where: { siteId: null },
        data: { siteId: mainSite.id }
    });

    console.log(`✅ Linked ${orphans.count} orphan PageContent records to main site.`);

    // 3. Clean up "Fallback" content to force regeneration of "God Mode" content
    const fallbacks = await prisma.pageContent.deleteMany({
        where: {
            content: {
                contains: "İstanbul'un en seçkin escort ajansı ağı"
            }
        }
    });

    console.log(`✅ Purged ${fallbacks.count} fallback records to trigger FULL content regeneration.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
