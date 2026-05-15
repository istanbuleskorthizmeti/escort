import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function suspendAccounts() {
  console.log('Suspending X accounts...');
  const result = await prisma.botAccount.updateMany({
    where: { status: 'ALIVE' },
    data: { status: 'SUSPENDED' }
  });
  console.log(`Suspended ${result.count} accounts.`);
}

suspendAccounts().catch(console.error).finally(() => prisma.$disconnect());
