import { HydraOrchestrator } from '../lib/parasite/hydra-orchestrator';
import { generateTemplateContent } from '../lib/ai-seo';
import fs from 'fs';
import path from 'path';

/**
 * 🧛‍♂️ HYDRA TIER-2 BOMBARDMENT ENGINE (GOD MODE)
 * Reads Google Sites URLs and blasts them with Tier 2 PBN Backlinks (Blogger, etc.)
 */

const G_SITES_FILE = path.join(process.cwd(), 'data', 'live_google_sites.json');
// Default Blog ID for PBN (can be mapped per site later)
const DEFAULT_BLOG_ID = '6433291244460505199'; 

async function runTier2Bombardment() {
    console.log("🚀 [TIER-2] GOD MODE Bombardiman baslatiliyor...");

    if (!fs.existsSync(G_SITES_FILE)) {
        console.error(`❌ [TIER-2] Google Sites dosyalari bulunamadi: ${G_SITES_FILE}`);
        process.exit(1);
    }

    const sitesRaw = fs.readFileSync(G_SITES_FILE, 'utf8');
    let targetUrls: string[] = [];
    try {
        targetUrls = JSON.parse(sitesRaw);
    } catch (e) {
        console.error("❌ [TIER-2] JSON Parse hatasi.");
        process.exit(1);
    }

    if (targetUrls.length === 0) {
        console.log("⚠️ [TIER-2] Hedef URL listesi bos.");
        process.exit(0);
    }

    console.log(`📡 [TIER-2] Hedeflenecek Google Sites sayisi: ${targetUrls.length}`);

    // Generate a master template to save tokens
    console.log(`🧠 [TIER-2] Master Template uretiliyor (Token tasarrufu aktif)...`);
    const masterTemplate = await generateTemplateContent({ city: 'İstanbul', host: 'vipescorthizmeti.com' });
    console.log(`✅ [TIER-2] Master Template hazir.`);

    for (let i = 0; i < targetUrls.length; i++) {
        const targetUrl = targetUrls[i];
        console.log(`\n🎯 [TIER-2] HEDEF (${i+1}/${targetUrls.length}): ${targetUrl}`);

        try {
            // Clone the template to safely modify it
            const localTemplate = JSON.parse(JSON.stringify(masterTemplate));

            // ⚡ GOD MODE: Dinamik Link Degistirme (O(1) Karmaşiklik)
            // Sistem hardcoded olarak vipescorthizmeti.com'a link basar.
            // Biz bu linki Google Sites URL'miz ile degistirerek PBN gucunu aktariyoruz.
            const swapUrl = (str: string) => str.replace(/https:\/\/vipescorthizmeti\.com/g, targetUrl);

            localTemplate.wordpress.content = swapUrl(localTemplate.wordpress.content);
            localTemplate.blogger.content = swapUrl(localTemplate.blogger.content);
            localTemplate.tumblr.content = swapUrl(localTemplate.tumblr.content);

            // Execute the siege using the modified template
            await HydraOrchestrator.executeSiege({
                city: 'Global', // Generic for Tier 2
                district: `Tier2-Backlink-${i}`,
                host: 'vipescorthizmeti.com', // Keeps AI persona intact
                blogId: DEFAULT_BLOG_ID,
                templateContent: localTemplate
            });

            console.log(`✅ [TIER-2] SUCCESS: ${targetUrl} adresine backlink gonderildi.`);
        } catch (err: any) {
            console.error(`❌ [TIER-2] FAILED for ${targetUrl}:`, err.message);
        }

        // Anti-spam delay
        if (i < targetUrls.length - 1) {
            console.log("⏳ Anti-spam beklemesi (3 saniye)...");
            await new Promise(r => setTimeout(r, 3000));
        }
    }

    console.log("\n🏆 [TIER-2] BOMBARDIMAN TAMAMLANDI. Tum PBN gucu Google Sites'lara aktarildi.");
}

runTier2Bombardment();
