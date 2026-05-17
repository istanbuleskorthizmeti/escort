import { HydraOrchestrator } from '../lib/parasite/hydra-orchestrator';
import { cities } from '../lib/locations';

/**
 * 🧛‍♂️ HYDRA PARASITE OFFENSIVE (RED BUTTON)
 * Massive backlink deployment across all platforms.
 */

async function launchOffensive() {
    const args = process.argv.slice(2);
    const targetCity = args[0] || 'istanbul';
    const targetDistrictSlug = args[1] || 'sisli';
    const host = args[2] || 'vipescorthizmeti.com';
    const blogId = args[3] || '6433291244460505199'; // Fallback to a known blog ID

    console.log(`🚀 [HYDRA-OFFENSIVE] Starting massive campaign...`);
    console.log(`📍 Target: ${targetCity}/${targetDistrictSlug} via ${host}`);

    const district = cities.istanbul.districts.find(d => d.slug === targetDistrictSlug);
    const districtName = district ? district.name : targetDistrictSlug;

    try {
        await HydraOrchestrator.executeSiege({
            city: targetCity,
            district: districtName,
            host: host,
            blogId: blogId
        });
        
        console.log(`✅ [HYDRA-OFFENSIVE] Mission accomplished. Check Telegram for Victory Report.`);
    } catch (err: any) {
        console.error(`❌ [HYDRA-OFFENSIVE] Critical failure:`, err.message);
        process.exit(1);
    }
}

launchOffensive();
