const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const contentCount = await prisma.pageContent.count();
    const bloggedCount = await prisma.pageContent.count({ where: { isBloggerPosted: true } });
    const tumblrCount = await prisma.pageContent.count({ where: { isTumblrPosted: true } });
    const wpCount = await prisma.pageContent.count({ where: { isWordPressPosted: true } });
    const indexedCount = await prisma.pageContent.count({ where: { isIndexed: true } });

    console.log('--- CONTENT STATUS ---');
    console.log(`Total PageContent: ${contentCount}`);
    console.log(`Blogger Posted: ${bloggedCount}`);
    console.log(`Tumblr Posted: ${tumblrCount}`);
    console.log(`WordPress Posted: ${wpCount}`);
    console.log(`Indexed: ${indexedCount}`);

    const latest = await prisma.pageContent.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    console.log('--- LATEST 5 RECORDS ---');
    latest.forEach(r => {
      console.log(`[${r.updatedAt.toISOString()}] Slug: ${r.slug} | Blogger: ${r.isBloggerPosted} | Tumblr: ${r.isTumblrPosted}`);
    });

  } catch (e) {
    console.error('Error checking content:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
