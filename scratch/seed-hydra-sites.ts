import { PrismaClient } from '@prisma/client';
import { DOMAIN_MATRIX } from '../config/domains';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 SEEDING 111-DOMAIN HYDRA MATRIX...');
  
  for (const domain of DOMAIN_MATRIX) {
    try {
      const site = await prisma.site.upsert({
        where: { domain: domain.host },
        update: {
          status: 'ACTIVE'
        },
        create: {
          domain: domain.host,
          status: 'ACTIVE'
        }
      });
      console.log(`✅ [${site.id}] ${site.domain} synced.`);
    } catch (e) {
      console.error(`❌ FAILED: ${domain.host}`, e);
    }
  }
  
  console.log('🌟 HYDRA AWAKENING COMPLETE!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
