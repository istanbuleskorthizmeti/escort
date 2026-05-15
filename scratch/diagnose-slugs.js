const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function diagnose() {
  console.log('--- FINDING LARGE CONTENT ANYWHERE ---');
  const results = await prisma.pageContent.findMany({
    where: {
      content: { contains: 'DRKCNAY' }
    },
    select: { slug: true, title: true, content: true, siteId: true },
    orderBy: { updatedAt: 'desc' },
    take: 10
  });
  
  results.forEach(r => {
    if (r.content && r.content.length > 200) {
      console.log(`SLUG: ${r.slug} | SITE_ID: ${r.siteId} | LEN: ${r.content.length}`);
    }
  });
}

diagnose().finally(() => prisma.$disconnect());
