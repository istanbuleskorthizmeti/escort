import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.site.count({ where: { status: 'ACTIVE' } });
  const sites = await prisma.site.findMany({ where: { status: 'ACTIVE' }, select: { domain: true } });
  console.log(`Total Active Sites: ${count}`);
  console.log('Sites:', sites.map(s => s.domain).join(', '));
}
main().finally(() => prisma.$disconnect());
