import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://vuc2026_user:vuc2026_pass@213.232.235.181:5432/vuc2026?sslmode=disable"
    }
  }
});

async function main() {
  console.log('=== Fetching SystemSettings ===');
  const settings = await prisma.systemSetting.findMany();
  console.log(settings);
  
  console.log('=== Fetching BotLocks ===');
  const locks = await prisma.botLock.findMany();
  console.log(locks);
  
  await prisma.$disconnect();
}

main().catch(console.error);
