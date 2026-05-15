import { prisma } from './lib/prisma';

async function checkDomain() {
  const domain = 'casus-yazilim-sil.xyz';
  const site = await prisma.site.findFirst({
    where: { domain: { contains: domain } }
  });
  console.log('Site found:', site);
}

checkDomain().catch(console.error);
