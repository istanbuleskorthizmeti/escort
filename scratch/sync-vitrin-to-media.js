const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '..', 'public', 'vitrin');
const TARGET_DIR = path.join(__dirname, '..', 'public', '_media', 'vitrin');

async function syncImages() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
  console.log(`📸 Found ${files.length} images to sync...`);

  for (const file of files) {
    const inputPath = path.join(SOURCE_DIR, file);
    const outputName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const outputPath = path.join(TARGET_DIR, outputName);

    if (fs.existsSync(outputPath)) continue;

    try {
      await sharp(inputPath)
        .webp({ quality: 80 })
        .resize(800, 1000, { fit: 'cover', position: 'top' })
        .toFile(outputPath);
      console.log(`✅ Converted: ${outputName}`);
    } catch (e) {
      console.error(`❌ Error ${file}:`, e.message);
    }
  }
  console.log('🏁 Sync complete!');
}

syncImages();
