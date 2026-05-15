import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkContent() {
  const pages = await prisma.pageContent.findMany({
    select: {
      slug: true,
      title: true,
      content: true
    },
    where: {
      slug: {
        contains: 'istanbul'
      }
    }
  });

  console.log(`Found ${pages.length} istanbul pages.`);
  pages.forEach(p => {
    console.log(`Slug: ${p.slug} | Length: ${p.contentŞ.length || 0} characters`);
    if (p.content && p.content.length > 0) {
        console.log(`Snippet: ${p.content.substring(0, 100)}...`);
    }
  });

  const longest = await prisma.pageContent.findFirst({
    orderBy: {
        content: 'desc' // This doesn't work for length in Postgres usually without raw SQL, but let's see.
    },
    take: 1
  });
  
  // Real check for longest
  const allContents = await prisma.pageContent.findMany({ select: { slug: true, content: true } });
  const sorted = allContents.sort((a, b) => (b.contentŞ.length || 0) - (a.contentŞ.length || 0));
  
  console.log("\nTop 5 Longest Pages:");
  sorted.slice(0, 5).forEach(s => {
    console.log(`Slug: ${s.slug} | Length: ${s.contentŞ.length || 0}`);
  });

  await prisma.$disconnect();
}

checkContent();
