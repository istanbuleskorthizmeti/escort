
import { prisma } from '../lib/prisma';
import { generateEliteOmniContent } from '../lib/ai-seo';
import { cities } from '../lib/locations';
import { DOMAIN_MATRIX } from '../config/domains';
import { sendTelegramReport } from '../lib/telegram';

async function executeGlobalWarfare() {
    const report = "🧛‍♂️ [HYDRA-WARFARE] Taarruz Başladı! ⚔️\n56 Domainlik ordu harekete geçti. Frankfurt Kalesi'nden selamlar! 🛰️🚀";
    await sendTelegramReport(report);
    
    console.log("⚔️ [GLOBAL-WARFARE] Launching 56-Domain Content Siege...");

    const allSites = await prisma.site.findMany({ where: { status: 'ACTIVE' } });
    console.log(`📡 [GLOBAL-WARFARE] Active sites to conquer: ${allSites.length}`);

    for (const site of allSites) {
        const config = DOMAIN_MATRIX.find(d => d.host === site.domain);
        const host = site.domain;
        
        // Determine target districts for this site
        let targetDistricts = [];
        if (config?.targetDistrict) {
            const districtObj = cities.istanbul.districts.find(d => d.slug === config.targetDistrict);
            if (districtObj) targetDistricts = [districtObj];
        } else if (config?.role === 'MONEY_SITE' || !config?.targetDistrict) {
            // Money sites or general satellites get all major Istanbul districts
            targetDistricts = cities.istanbul.districts.slice(0, 15); // Top 15 districts for speed/cost balance
        }

        console.log(`🎯 [GLOBAL-WARFARE] Siege target: ${host} (${targetDistricts.length} districts)`);

        for (const district of targetDistricts) {
            const slug = `${district.slug}-escort`;
            
            try {
                // Check existing content
                const existing = await prisma.pageContent.findUnique({
                    where: { slug_siteId: { slug, siteId: site.id } }
                });

                if (existing && existing.content && existing.content.length > 2000) {
                    continue; // Skip if already high-quality
                }

                console.log(`🤖 [GLOBAL-WARFARE] DeepSeek Generation: ${host} -> ${district.name}`);
                const aiData = await generateEliteOmniContent({
                    city: "istanbul",
                    district: slug,
                    host: host
                });

                // Enforce "Siege Report" Style Titles
                let title = aiData.wordpress.title;
                if (!title.includes('%100') && !title.includes('Kaporasız')) {
                    title = `🔥 ${district.name} VIP Escort | %100 Gerçek & Kaporasız | ${host}`;
                }

                await prisma.pageContent.upsert({
                    where: { slug_siteId: { slug, siteId: site.id } },
                    update: { title, content: aiData.wordpress.content, updatedAt: new Date() },
                    create: { 
                        slug, 
                        siteId: site.id, 
                        title, 
                        content: aiData.wordpress.content 
                    }
                });

                console.log(`✅ [GLOBAL-WARFARE] Sealed: ${host}/${slug}`);
                await sendTelegramReport(`✅ [HYDRA-VICTORY] Mühürlendi: <b>${host}/${slug}</b>\n💎 Başlık: ${title.slice(0, 50)}...`);
            } catch (err: any) {
                console.error(`❌ [GLOBAL-WARFARE] Failed ${host}/${slug}:`, err.message);
            }
        }
    }

    console.log("🏆 [GLOBAL-WARFARE] Total Victory. 56 domains are now armored with DeepSeek authority content.");
}

executeGlobalWarfare();
