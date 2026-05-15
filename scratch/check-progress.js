const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const filledCount = await prisma.pageContent.count({
    where: {
      content: {
        not: null
      }
    }
  });

  const totalCount = await prisma.pageContent.count();
  const emptyCount = totalCount - filledCount;
  const progressPercent = ((filledCount / totalCount) * 100).toFixed(2);

  console.log(`\n📊 DRKCNAY HYDRATION PROGRESS REPORT`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ TAMAMLANAN : ${filledCount}`);
  console.log(`⏳ BEKLEYEN   : ${emptyCount}`);
  console.log(`📈 TOPLAM     : ${totalCount}`);
  console.log(`🚀 İLERLEME   : %${progressPercent}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
