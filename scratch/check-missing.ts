import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.pageContent.count({
    where: {
      OR: [
        { content: null },
        { content: '' }
      ]
    }
  });

  const total = await prisma.pageContent.count();

  console.log(`Missing content: ${count}`);
  console.log(`Total pages: ${total}`);
  console.log(`Completion: ${((total - count) / total * 100).toFixed(2)}%`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
