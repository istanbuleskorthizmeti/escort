const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sites = await prisma.site.findMany();
  console.log("Registered Sites in DB:", sites);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
