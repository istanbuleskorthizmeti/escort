
import { prisma } from '../lib/prisma';
import { DOMAIN_MATRIX } from '../config/domains';

async function registerSites() {
    console.log("📝 [HYDRA-REG] Registering 56 domains in the Site table...");

    for (const config of DOMAIN_MATRIX) {
        try {
            await prisma.site.upsert({
                where: { domain: config.host },
                update: { status: 'ACTIVE' },
                create: { 
                    domain: config.host,
                    status: 'ACTIVE'
                }
            });
            console.log(`✅ [HYDRA-REG] Registered: ${config.host}`);
        } catch (err: any) {
            console.error(`❌ [HYDRA-REG] Failed to register ${config.host}:`, err.message);
        }
    }

    console.log("🏆 [HYDRA-REG] All domains are now managed in the Hive database.");
}

registerSites();
