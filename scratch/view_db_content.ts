import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://vuc2026_user:vuc2026_pass@127.0.0.1:5432/vuc2026?sslmode=disable"
    }
  }
});

async function main() {
  try {
    console.log('📡 Querying PageContent table...');
    const pages = await prisma.pageContent.findMany({
      where: {
        slug: {
          contains: 'kategori'
        }
      },
      take: 10,
      select: {
        id: true,
        slug: true,
        title: true,
        content: true
      }
    });

    console.log(`✅ Retrieved ${pages.length} pages.`);
    for (const page of pages) {
      console.log(`\n📄 ID: ${page.id} | Slug: ${page.slug} | Title: ${page.title}`);
      console.log('Content snippet:', page.content?.substring(0, 300));
    }
  } catch (err) {
    console.error('💥 Database query failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
