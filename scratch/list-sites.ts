import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sites = await prisma.site.findMany({
    orderBy: { domain: 'asc' },
  });
  
  console.log('--- HYDRA SITE DIRECTORY ---');
  sites.forEach(s => {
    console.log(`[${s.id}] ${s.domain} - Status: ${s.status || 'N/A'}`);
  });
  console.log('----------------------------');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
