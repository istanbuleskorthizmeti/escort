
import { GoogleSitesAdapter } from '../lib/parasite/google-sites';
import { BloggerAdapter } from '../lib/parasite/blogger';
import { TelegramService } from '../lib/crm/telegram';
import fs from 'fs';
import path from 'path';

/**
 * 🧛‍♂️ HYDRA HIVE COMMANDER
 * Orchestrates multiple parasite platforms for total SERP dominance.
 */

const DISTRICTS = [
    "Şişli", "Beşiktaş", "Bakırköy", "Kadıköy", "Florya", "Beylikdüzü", 
    "Sefaköy", "Beşyol", "Bahçelievler", "Avcılar", "Esenyurt", "Sarıyer",
    "Zeytinburnu", "Fatih", "Üsküdar", "Maltepe", "Kartal", "Pendik",
    "Ataşehir", "Ümraniye", "Bağcılar", "Bahçelievler", "Küçükçekmece"
];

const NICHES = [
    "VIP Escort", 
    "Rus Escort", 
    "Üniversiteli Escort", 
    "Lüks Escort",
    "Genç Escort",
    "Sarışın Escort",
    "Olgun Escort",
    "Esmer Escort"
];

const STATE_FILE = path.join(process.cwd(), 'hydra_hive_state.json');

async function getNextTarget() {
    let state: { done: string[], currentWave: number } = { done: [], currentWave: 1 };
    if (fs.existsSync(STATE_FILE)) {
        try {
            const saved = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
            state = { ...state, ...saved };
        } catch (e) {
            console.warn("⚠️ [STATE] Corrupted state file. Resetting...");
        }
    }
    
    if (!state.currentWave) state.currentWave = 1;

    // Try to find a target in the current wave
    for (const district of DISTRICTS) {
        for (const niche of NICHES) {
            const target = `${district}-${niche}-w${state.currentWave}`;
            if (!state.done.includes(target)) return { district, niche, target, wave: state.currentWave };
        }
    }

    // If all targets in current wave are done, start next wave!
    state.currentWave++;
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    await TelegramService.sendMessage(`🌊 <b>WAVE ${state.currentWave} BAŞLATILDI!</b>\n\nTüm İstanbul fethedildi, şimdi daha güçlü ve farklı varyasyonlarla en baştan başlıyoruz. 🧛‍♂️💎`);
    
    return { district: DISTRICTS[0], niche: NICHES[0], target: `${DISTRICTS[0]}-${NICHES[0]}-w${state.currentWave}`, wave: state.currentWave };
}

async function markAsDone(target: string) {
    let state = { done: [], currentWave: 1 };
    if (fs.existsSync(STATE_FILE)) {
        state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
    state.done.push(target);
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function executeSiege() {
    const target = await getNextTarget();
    
    const displayTitle = `${target.district} ${target.niche}`;
    const waveLog = target.wave > 1 ? `[WAVE ${target.wave}] ` : '';
    console.log(`⚔️ [SIEGE] ${waveLog}Target: ${displayTitle}`);
    
    // Clean slug: No version suffix for Wave 1
    const vSuffix = target.wave > 1 ? `-v${target.wave}` : '';
    const slug = `${target.district.toLowerCase()}-${target.niche.toLowerCase()}${vSuffix}`.replace(/ /g, '-');

    try {
        // 1. Google Sites Mühürlemesi (2000px Vitrin)
        const siteUrl = await GoogleSitesAdapter.createSite(target.district, target.niche, slug);
        
        // 2. Blogger Makale Desteği (Backlink Gücü)
        if (siteUrl) {
            const blogTitle = `${target.district} Bölgesinde ${target.niche} Deneyimi`;
            const blogContent = `
                <h2>${target.district} ${target.niche} - Yeni Nesil Rehber</h2>
                <p>İstanbul'un yükselen değeri ${target.district} için hazırladığımız özel edisyon yayında...</p>
                <a href="${siteUrl}">🌐 Orijinal Vitrin Sitesini Ziyaret Edin</a>
            `;
            await BloggerAdapter.createPost(process.env.BLOGGER_ID || '', blogTitle, blogContent);
        }

        await markAsDone(target.target);
        console.log(`✅ [SUCCESS] Wave ${target.wave} - ${target.target} is SEALED.`);

    } catch (err: any) {
        console.error(`❌ [SIEGE_ERROR] ${target.target}:`, err.message);
    }
}

// Infinite Loop with 20-40 min delay to stay stealthy
(async () => {
    console.log("🧛‍♂️ HYDRA HIVE COMMANDER: ACTIVE");
    while (true) {
        await executeSiege();
        const delay = Math.floor(Math.random() * (2400000 - 1200000) + 1200000);
        console.log(`💤 [STEALTH] Waiting ${Math.floor(delay / 60000)} minutes...`);
        await new Promise(r => setTimeout(r, delay));
    }
})();
