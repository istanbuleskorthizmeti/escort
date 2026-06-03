const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    console.log('--- Database SEO Stats ---');
    const sites = await prisma.site.findMany();
    console.log(`Total sites in DB: ${sites.length}`);
    for (const site of sites) {
      const pageCount = await prisma.pageContent.count({
        where: { siteId: site.id }
      });
      console.log(`  - Site: ${site.domain} (ID: ${site.id}, Status: ${site.status}) -> Pages: ${pageCount}`);
    }

    const totalPages = await prisma.pageContent.count();
    console.log(`Total PageContents in DB: ${totalPages}`);

  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
