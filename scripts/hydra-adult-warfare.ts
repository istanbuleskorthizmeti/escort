
import { prisma } from '../lib/prisma';
import { AdultContentEngine } from '../lib/parasite/adult-engine';
import { DOMAIN_MATRIX } from '../config/domains';
import { sendTelegramReport } from '../lib/telegram';

async function executeAdultWarfare() {
    console.log("🔞 [ADULT-WARFARE] Taarruz Başladı! ⚔️");
    await sendTelegramReport("🔞 [ADULT-WARFARE] Adult/İfşa siteleri için İçerik Kuşatması Başladı! ⚔️\nGhost Player & DeepSeek SEO aktif! 🛰️🚀");

    const allSites = await prisma.site.findMany({ where: { status: 'ACTIVE' } });
    
    // Filter sites that are likely adult/ifsa based on domain name or matrix config
    const adultSites = allSites.filter(site => {
        const domain = site.domain.toLowerCase();
        return domain.includes('ifsa') || 
               domain.includes('videos') || 
               domain.includes('onlyfans') || 
               domain.includes('xvideo') ||
               domain.includes('izle');
    });

    console.log(`📡 [ADULT-WARFARE] Target sites identified: ${adultSites.length}`);

    for (const site of adultSites) {
        console.log(`🎯 [ADULT-WARFARE] Seeding Site: ${site.domain}`);
        
        try {
            // Deploy 5 videos per category for initial saturation
            await AdultContentEngine.massDeploy(site.id, 5);
            
            console.log(`✅ [ADULT-WARFARE] Completed: ${site.domain}`);
            await sendTelegramReport(`✅ [ADULT-VICTORY] ${site.domain} kalesi içerikle dolduruldu! 🔞💎\nKategoriler mühürlendi, Ghost Player aktif.`);
        } catch (err: any) {
            console.error(`❌ [ADULT-WARFARE] Failed ${site.domain}:`, err.message);
        }
    }

    console.log("🏆 [ADULT-WARFARE] Mission Accomplished.");
}

executeAdultWarfare();
