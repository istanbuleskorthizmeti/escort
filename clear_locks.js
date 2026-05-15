const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.botLock.deleteMany({});
  console.log('Locks cleared successfully'');
}
main().catch(console.error).finally(() => prisma.$disconnect());
