
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORK_DIR = '/root/hydra/tmp/elite_processing';
const VITRIN_DIR = '/root/hydra/public/_media/vitrin';
const PROFILES_DIR = '/root/hydra/public/_media/profiles';
const LOCATIONS_FILE = '/root/hydra/lib/locations-registry/istanbul.ts';

// Niche Lists (Hardcoded from lib/niche-matrix.ts for the script)
const ADULT_RACES = ["Turkish", "Russian", "Asian", "Ebony", "Latina", "European", "Ukrainian", "Belarusian", "Arab", "Persian"];
const ADULT_CATEGORIES = ["Anal Fantezi", "Dominatrix", "Sınırsız Escort", "Kaporasız Escort", "Evli Escort", "Dul Escort", "Üniversiteli Escort", "Öğrenci Escort", "Manken Escort", "Model Escort"];
const ADULT_NICHES = ["Lüks", "Gizli", "Kaçamak", "Otel", "Rezidans", "Evlere Servis", "Otele Servis", "Kaporasız", "Güvenilir"];
const ADULT_ADJECTIVES = ["Ateşli", "Sıcak", "Nefes Kesen", "Baştan Çıkarıcı", "Vahşi", "Doyumsuz", "Kışkırtıcı", "Egzotik"];

function getLocations() {
    const content = fs.readFileSync(LOCATIONS_FILE, 'utf8');
    const districtRegex = /"slug":\s*"([^"]+)"/g;
    const slugs = [];
    let match;
    while ((match = districtRegex.exec(content)) !== null) {
        if (!slugs.includes(match[1])) slugs.push(match[1]);
    }
    return slugs;
}

function getRandomTitle(i) {
    const adj = ADULT_ADJECTIVES[i % ADULT_ADJECTIVES.length];
    const race = ADULT_RACES[(i * 3) % ADULT_RACES.length];
    const cat = ADULT_CATEGORIES[(i * 7) % ADULT_CATEGORIES.length];
    return `${adj} ${race} ${cat}`.toUpperCase();
}

async function process() {
    const locations = getLocations();
    const files = fs.readdirSync(WORK_DIR).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    
    console.log(`🚀 Processing ${files.length} ELITE NICHE files...`);
    const vitrinResults = [];

    files.forEach((file, i) => {
        const loc = locations[i % locations.length] || 'istanbul';
        const seoBase = `doruk-elite-${loc}-${i}`;
        const inputPath = path.join(WORK_DIR, file);
        const vitrinPath = path.join(VITRIN_DIR, `${seoBase}.webp`);
        const profilePath = path.join(PROFILES_DIR, `${seoBase}.webp`);

        try {
            console.log(`📸 SEO & Niche: ${seoBase}`);
            execSync(`ffmpeg -i "${inputPath}" -q:v 80 "${vitrinPath}" -y`);
            execSync(`cp "${vitrinPath}" "${profilePath}"`);

            vitrinResults.push({ 
                title: getRandomTitle(i), 
                src: `/_media/vitrin/${seoBase}.webp` 
            });
        } catch (e) {
            console.error(`❌ Error: ${e.message}`);
        }
    });

    fs.writeFileSync('/root/hydra/tmp/elite_vitrin_data.json', JSON.stringify(vitrinResults, null, 2));
    console.log('✅ NICHE Deployment Complete!');
}

process();
