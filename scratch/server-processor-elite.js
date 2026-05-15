
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORK_DIR = '/root/hydra/tmp/elite_processing';
const VITRIN_DIR = '/root/hydra/public/_media/vitrin';
const PROFILES_DIR = '/root/hydra/public/_media/profiles';
const LOCATIONS_FILE = '/root/hydra/lib/locations-registry/istanbul.ts';

// Ensure directories exist and are CLEAN
[VITRIN_DIR, PROFILES_DIR, WORK_DIR].forEach(dir => {
    if (fs.existsSync(dir)) {
        execSync(`rm -rf ${dir}/*`);
    } else {
        fs.mkdirSync(dir, { recursive: true });
    }
});

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

const titles = [
    "ELİTE VİP", "BİREYSEL PARTNER", "YABANCI MODEL", "PREMIUM SEÇENEK", 
    "ÜNİVERSİTELİ", "TÜRBANLI GÜZEL", "OLGUN LADY", "VIP ESCORT", 
    "MODEL PARTNER", "GENÇ ÖĞRENCİ", "SEVGİLİ TADINDA", "ANALİZ EDİLMİŞ"
];

async function process() {
    const locations = getLocations();
    const files = fs.readdirSync(WORK_DIR).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    
    console.log(`🚀 Processing ${files.length} ELITE files...`);
    const vitrinResults = [];

    files.forEach((file, i) => {
        const loc = locations[i % locations.length] || 'istanbul';
        const seoBase = `doruk-elite-${loc}-${i}`;
        const inputPath = path.join(WORK_DIR, file);
        
        // Output Paths
        const vitrinPath = path.join(VITRIN_DIR, `${seoBase}.webp`);
        const profilePath = path.join(PROFILES_DIR, `${seoBase}.webp`);

        try {
            console.log(`📸 Converting & Naming: ${seoBase}`);
            
            // Convert and Save to VITRIN
            execSync(`ffmpeg -i "${inputPath}" -q:v 80 "${vitrinPath}" -y`);
            
            // Copy to PROFILES (Hard link or copy)
            execSync(`cp "${vitrinPath}" "${profilePath}"`);

            vitrinResults.push({ 
                title: titles[i % titles.length], 
                src: `/_media/vitrin/${seoBase}.webp` 
            });

        } catch (e) {
            console.error(`❌ Error processing ${file}:`, e.message);
        }
    });

    // Save metadata for the frontend
    fs.writeFileSync('/root/hydra/tmp/elite_vitrin_data.json', JSON.stringify(vitrinResults, null, 2));
    console.log('✅ ELITE Deployment Complete! Metadata saved to /root/hydra/tmp/elite_vitrin_data.json');
}

process();
