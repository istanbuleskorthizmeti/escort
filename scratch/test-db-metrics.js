const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Testing db metrics on remote...");
  try {
    const [
      totalPages,
      bloggerPosted,
      tumblrPosted,
      wordpressPosted,
      telegraphPosted,
      githubPosted,
      gistPosted,
      indexedPages,
      authorityAssets,
      totalLeads,
      completedLeads,
      totalRevenue,
      whatsappClicks
    ] = await Promise.all([
      prisma.pageContent.count(),
      prisma.pageContent.count({ where: { isBloggerPosted: true } }),
      prisma.pageContent.count({ where: { isTumblrPosted: true } }),
      prisma.pageContent.count({ where: { isWordPressPosted: true } }),
      prisma.pageContent.count({ where: { isTelegraphPosted: true } }),
      prisma.pageContent.count({ where: { isGitHubPosted: true } }),
      prisma.pageContent.count({ where: { isGistPosted: true } }),
      prisma.pageContent.count({ where: { isIndexed: true } }),
      prisma.authorityAsset.count(),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'COMPLETED' } }),
      prisma.lead.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { paymentAmount: true }
      }),
      prisma.whatsAppClick.count()
    ]);
    console.log("✅ Success!");
    console.log({ totalPages, bloggerPosted, totalRevenue });
  } catch (err) {
    console.error("❌ Failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
