const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RAW_DIR = '/root/esc/public/cdn/vitrin_raw';
const CDN_DIR = '/root/esc/public/cdn/vitrin';

async function processVitrin() {
  try {
    console.log('🚀 [GOD MODE] Image Conversion & SEO Population Initialized...');

    if (!fs.existsSync(CDN_DIR)) fs.mkdirSync(CDN_DIR, { recursive: true });

    const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));
    console.log(`📸 Found ${files.length} images to process...`);

    const processedImages = [];

    for (const file of files) {
      const inputPath = path.join(RAW_DIR, file);
      const outputName = file.replace(/\.(jpg|jpeg)$/, '.webp');
      const outputPath = path.join(CDN_DIR, outputName);

      await sharp(inputPath)
        .webp({ quality: 80 })
        .resize(800, 1000, { fit: 'cover' }) // Optimized for profile display
        .toFile(outputPath);
      
      processedImages.push(`/assets/img/${outputName}`);
      if (processedImages.length % 50 === 0) console.log(`  [${processedImages.length}/${files.length}] Converted...`);
    }

    console.log('🧬 [GEO SEO] Populating database with hyper-local content...');

    // 1. Get Istanbul Districts (Common list if not in DB, but we'll try to find them)
    const districts = [
      'Atasehir', 'Avcilar', 'Bagcilar', 'Bahcelievler', 'Bakirkoy', 'Basaksehir', 'Bayrampasa', 'Besiktas',
      'Beykoz', 'Beylikduzu', 'Beyoglu', 'Buyukcekmece', 'Catalca', 'Cekmekoy', 'Esenler', 'Esenyurt',
      'Eyup', 'Fatih', 'Gaziosmanpasa', 'Gungoren', 'Kadikoy', 'Kagithane', 'Kartal', 'Kucukcekmece',
      'Maltepe', 'Pendik', 'Sancaktepe', 'Sariyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Sile',
      'Sisli', 'Tuzla', 'Umraniye', 'Uskudar', 'Zeytinburnu'
    ];

    for (let i = 0; i < districts.length; i++) {
      const district = districts[i];
      const image = processedImages[i % processedImages.length];

      // Create a "showcase" profile for each district
      await prisma.adProfile.create({
        data: {
          name: `Elite Vitrin - ${district}`,
          age: 24,
          phone: "05000000000",
          image: image,
          tier: "VIP",
          citySlugs: ["istanbul"],
          districtSlugs: [district.toLowerCase()],
          features: ["Showcase", "Elite", "Verified"],
          isActive: true
        }
      });
    }

    console.log('✅ [GOD MODE] Images processed and SEO matrix populated!');
  } catch (err) {
    console.error('❌ SEO Processing Failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

processVitrin();
