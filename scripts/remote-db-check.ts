import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
  const profiles = await prisma.adProfile.findMany({
    take: 10,
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });
  console.log(JSON.stringify(profiles, null, 2));
  await prisma.$disconnect();
}

check();
