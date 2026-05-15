
import fs from 'fs';
import path from 'path';
import { istanbulCity } from '../lib/locations-registry/istanbul';
import { execSync } from 'child_process';
import piexif from 'piexifjs';

const TELEGRAM_DIR = "C:\\Users\\onurk\\Downloads\\Telegram Desktop";
const OUTPUT_DIR = path.join(process.cwd(), 'scratch', 'processed_vitrin');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// SEO Titles
const titles = [
    "BİREYSEL PARTNER", "ELİTE VİP", "YABANCI MODEL", "ÜNİVERSİTELİ", 
    "OLGUN LADY", "ANALİZ EDİLMİŞ", "VIP ESCORT", "MODEL PARTNER", 
    "PREMIUM SEÇENEK", "TÜRBANLI MODEL", "GENÇ ÖĞRENCİ", "SEVGİLİ TADINDA"
];

async function processImages() {
    const files = fs.readdirSync(TELEGRAM_DIR).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    console.log(`🚀 Found ${files.length} images to process.`);

    const locationPool = [];
    istanbulCity.districts.forEach(d => {
        d.neighborhoods.forEach(n => {
            locationPool.push({ district: d.slug, neighborhood: n.slug, districtName: d.name, neighborhoodName: n.name });
        });
    });

    const processedImages = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = path.join(TELEGRAM_DIR, file);
        
        // Pick a random location
        const locIndex = i % locationPool.length;
        const loc = locationPool[locIndex];
        
        // Generate SEO name
        const seoName = `istanbul-escort-${loc.district}-${loc.neighborhood}-${i}.webp`;
        const outputPath = path.join(OUTPUT_DIR, seoName);

        // Pick a title
        const title = titles[i % titles.length];

        console.log(`📸 Processing: ${file} -> ${seoName} (${title})`);

        try {
            // 1. Convert to WebP using ffmpeg
            execSync(`ffmpeg -i "${filePath}" -q:v 75 "${outputPath}" -y`, { stdio: 'ignore' });

            // 2. Inject Metadata (Basic placeholder for now as piexif requires specific formats)
            // Note: For WebP, piexif might not work as it's primarily for JPEG. 
            // For WebP we can use XMP, but let's stick to naming for now which is 80% of SEO.
            
            processedImages.push({
                title: title,
                src: `/_media/vitrin/${seoName}`
            });

        } catch (err) {
            console.error(`❌ Error processing ${file}:`, err.message);
        }
    }

    // Save metadata for lib/vitrin-images.ts
    fs.writeFileSync(path.join(OUTPUT_DIR, 'vitrin-data.json'), JSON.stringify(processedImages, null, 2));
    console.log(`✅ Finished! Processed ${processedImages.length} images.`);
}

processImages();
