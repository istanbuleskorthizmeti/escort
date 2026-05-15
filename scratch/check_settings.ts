import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const settings = await prisma.systemSetting.findMany();
  console.log('Settings Keys:', settings.map(s => s.key));
  process.exit(0);
}
main();
