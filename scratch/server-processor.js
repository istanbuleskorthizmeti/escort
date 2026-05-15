
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORK_DIR = '/root/hydra/tmp/telegram_vitrin';
const OUTPUT_DIR = '/root/hydra/public/_media/vitrin';
const LOCATIONS_FILE = '/root/hydra/lib/locations-registry/istanbul.ts';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Minimal parser for the TS locations file to get slugs
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
    "BİREYSEL PARTNER", "ELİTE VİP", "YABANCI MODEL", "ÜNİVERSİTELİ", 
    "OLGUN LADY", "ANALİZ EDİLMİŞ", "VIP ESCORT", "MODEL PARTNER", 
    "PREMIUM SEÇENEK", "TÜRBANLI MODEL", "GENÇ ÖĞRENCİ", "SEVGİLİ TADINDA"
];

async function process() {
    const locations = getLocations();
    const files = fs.readdirSync(WORK_DIR).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    
    console.log(`Processing ${files.length} files...`);
    const results = [];

    files.forEach((file, i) => {
        const ext = path.extname(file);
        const loc = locations[i % locations.length] || 'istanbul';
        const seoName = `vitrin-escort-${loc}-${i}.webp`;
        const inputPath = path.join(WORK_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, seoName);
        const title = titles[i % titles.length];

        try {
            console.log(`Converting ${file} to ${seoName}...`);
            execSync(`ffmpeg -i "${inputPath}" -q:v 75 "${outputPath}" -y`);
            results.push({ title, src: `/_media/vitrin/${seoName}` });
        } catch (e) {
            console.error(`Error processing ${file}:`, e.message);
        }
    });

    fs.writeFileSync('/root/hydra/tmp/vitrin_results.json', JSON.stringify(results, null, 2));
    console.log('✅ Done! Results saved to /root/hydra/tmp/vitrin_results.json');
}

process();
