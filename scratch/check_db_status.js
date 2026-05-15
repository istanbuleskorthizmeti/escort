const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const pages = await prisma.pageContent.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' }
    });
    console.log('--- LATEST PAGES ---');
    pages.forEach(p => {
      console.log(`Slug: ${p.slug}`);
      console.log(`Title: ${p.title}`);
      console.log(`Content Length: ${p.content Ş p.content.length : 0} chars`);
      console.log('-------------------');
    });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
