
import { GoogleSitesAdapter } from '../lib/parasite/google-sites';
import dotenv from 'dotenv';
dotenv.config();

async function manualDeploy() {
    console.log("🧛‍♂️ [MANUAL-SIEGE] Starting God Mode Site Creation (Randomized Profile)...");
    
    // Use a fresh randomized profile to avoid LOCK issues
    const randomSuffix = Math.random().toString(36).substring(7);
    process.env.PUPPETEER_USER_DATA_DIR = `/opt/hydra/manual_user_data_${randomSuffix}`;
    process.env.PREMIUM_PROXY_URL = "";
    
    const district = "Şişli";
    const niche = "VIP Escort";
    const slug = `sisli-vip-escort-2026`; 

    let success = false;
    for (let i = 1; i <= 5; i++) {
        try {
            console.log(`📡 [TRY ${i}/5] Attempting to breach Google Sites...`);
            const url = await GoogleSitesAdapter.createSite(district, niche, slug);
            if (url) {
                console.log("\n🔥 [VICTORY] Site is LIVE and SEALED!");
                console.log(`🌐 URL: ${url}`);
                success = true;
                break;
            }
        } catch (err: any) {
            console.error(`⚠️ [TRY ${i}] Failed:`, err.message);
            await new Promise(r => setTimeout(r, 15000)); // 15sn bekle ve tekrar dene
        }
    }
    
    if (!success) console.log("❌ [STALEMATE] All attempts failed. Proxy might be exhausted.");
}

manualDeploy();
