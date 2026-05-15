import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const contentStats = await prisma.pageContent.groupBy({
    by: ['siteId'],
    _count: {
      id: true
    }
  });
  
  console.log('--- HYDRA CONTENT STATS ---');
  for (const stat of contentStats) {
    const sample = await prisma.pageContent.findFirst({
      where: { siteId: stat.siteId },
      select: { slug: true, title: true }
    });
    console.log(`SiteId: [${stat.siteId}] - Pages: ${stat._count.id} - Sample: ${sample?.slug} (${sample?.title})`);
  }
  console.log('---------------------------');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
