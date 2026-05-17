import { HydraOrchestrator } from '../lib/parasite/hydra-orchestrator';
import { cities } from '../lib/locations';
import { generateTemplateContent } from '../lib/ai-seo';

/**
 * 🧛‍♂️ HYDRA MASS OFFENSIVE (TOKEN SAVER MODE)
 * Deploys backlinks to multiple districts using a pool of pre-generated templates.
 */

async function launchMassOffensive() {
    const args = process.argv.slice(2);
    const targetCity = args[0] || 'istanbul';
    const host = args[1] || 'vipescorthizmeti.com';
    const blogId = args[2] || '6433291244460505199';
    const limit = parseInt(args[3] || '5'); // Default to 5 districts for safety

    console.log(`🚀 [HYDRA-MASS] Starting token-saving campaign for ${targetCity}...`);

    // 1. Generate a pool of Master Templates (e.g., 3 unique drafts)
    console.log(`🧠 [HYDRA-MASS] Generating Master Templates...`);
    const templatePool = await Promise.all([
        generateTemplateContent({ city: targetCity, host }),
        generateTemplateContent({ city: targetCity, host }),
        generateTemplateContent({ city: targetCity, host })
    ]);
    console.log(`✅ [HYDRA-MASS] 3 Templates ready. Scaling to ${limit} districts.`);

    const districts = cities.istanbul.districts.slice(0, limit);

    for (const district of districts) {
        // Pick a random template from the pool
        const template = templatePool[Math.floor(Math.random() * templatePool.length)];
        
        console.log(`🎯 [HYDRA-MASS] Target: ${district.name}`);
        
        try {
            await HydraOrchestrator.executeSiege({
                city: targetCity,
                district: district.name,
                host: host,
                blogId: blogId,
                templateContent: template
            });
        } catch (err: any) {
            console.error(`❌ [HYDRA-MASS] Failed ${district.name}:`, err.message);
        }
        
        // Anti-Spam Safety: Short delay between districts
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log(`🏆 [HYDRA-MASS] Total Victory. ${districts.length} districts conquered with minimum token usage.`);
}

launchMassOffensive();
