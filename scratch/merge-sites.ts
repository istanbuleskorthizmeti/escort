
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking ALL sites on server...');
    const sites = await prisma.site.findMany();
    console.log(`Total Sites: ${sites.length}`);

    const counts: Record<string, string[]> = {};
    sites.forEach(s => {
        if (!counts[s.domain]) counts[s.domain] = [];
        counts[s.domain].push(s.id);
    });

    const duplicates = Object.entries(counts).filter(([d, ids]) => ids.length > 1);
    
    if (duplicates.length > 0) {
        console.log('🚨 DUPLICATES FOUND:');
        console.log(JSON.stringify(duplicates, null, 2));

        for (const [domain, ids] of duplicates) {
            console.log(`🧹 Merging ${domain}...`);
            const keepId = ids[0];
            const removeIds = ids.slice(1);

            for (const oldId of removeIds) {
                // Link PageContent to the kept ID
                await prisma.pageContent.updateMany({
                    where: { siteId: oldId },
                    data: { siteId: keepId }
                });
                
                // Link Blogs to the kept ID
                await prisma.bloggerSetting.updateMany({
                    where: { siteId: oldId },
                    data: { siteId: keepId }
                });

                // Delete the duplicate site
                await prisma.site.delete({ where: { id: oldId } });
            }
            console.log(`✅ ${domain} merged into ${keepId}`);
        }
    } else {
        console.log('✅ No duplicate domains found.');
    }

    // Ensure main domain is correct
    const mainDomain = 'vipescorthizmeti.com';
    const mainSites = sites.filter(s => s.domain === mainDomain);
    if (mainSites.length > 0) {
        console.log(`🌐 Main site resolved: ${mainSites[0].id}`);
        
        // Link all orphan PageContents (siteId: null) to this main site
        const orphans = await prisma.pageContent.updateMany({
            where: { siteId: null },
            data: { siteId: mainSites[0].id }
        });
        console.log(`📦 Linked ${orphans.count} orphan PageContent records.`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
