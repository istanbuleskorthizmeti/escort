const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  const profiles = await prisma.adProfile.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  });
  console.log(JSON.stringify(profiles, null, 2));
  await prisma.$disconnect();
}

checkDb();
