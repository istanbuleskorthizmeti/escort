const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const Jimp = require('jimp');

const TARGET_DIR = path.join(__dirname, '..', 'public');

console.log('==============================================');
console.log('⚡ STARTING HYDRA NODE COMPRESSION ENGINE');
console.log('==============================================');
console.log(`📂 Scanning: ${TARGET_DIR}`);

let totalSavedBytes = 0;
let filesProcessed = 0;

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

// Helper to check if file size decreased and print results
function recordSavings(filePath, oldSize, newSize) {
  if (newSize < oldSize) {
    const saved = oldSize - newSize;
    totalSavedBytes += saved;
    console.log(`✅ Optimized: ${path.basename(filePath)} (${(oldSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB | -${(saved/1024).toFixed(1)}KB)`);
  } else {
    console.log(`ℹ️ No savings for: ${path.basename(filePath)}`);
  }
}

async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const oldSize = fs.statSync(filePath).size;
  
  if (oldSize === 0) return;

  try {
    if (ext === '.webp') {
      // Compress WebP using server's native cwebp/dwebp
      const tempPng = `${filePath}.temp.png`;
      execSync(`dwebp "${filePath}" -o "${tempPng}"`, { stdio: 'ignore' });
      execSync(`cwebp -q 75 "${tempPng}" -o "${filePath}"`, { stdio: 'ignore' });
      if (fs.existsSync(tempPng)) fs.unlinkSync(tempPng);
      
      const newSize = fs.statSync(filePath).size;
      recordSavings(filePath, oldSize, newSize);
      filesProcessed++;
    } else if (ext === '.jpg' || ext === '.jpeg') {
      // Compress JPG using Jimp
      const image = await Jimp.read(filePath);
      await image.quality(75).writeAsync(filePath);
      
      const newSize = fs.statSync(filePath).size;
      recordSavings(filePath, oldSize, newSize);
      filesProcessed++;
    } else if (ext === '.png') {
      // Compress PNG using Jimp
      const image = await Jimp.read(filePath);
      // Jimp compresses PNG by default during write
      await image.writeAsync(filePath);
      
      const newSize = fs.statSync(filePath).size;
      recordSavings(filePath, oldSize, newSize);
      filesProcessed++;
    }
  } catch (err) {
    console.error(`❌ Failed processing ${path.basename(filePath)}:`, err.message);
  }
}

// For echo compatibility
function echo(msg) {
  console.log(msg);
}

async function main() {
  const fileList = [];
  walkDir(TARGET_DIR, (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) {
      fileList.push(filePath);
    }
  });

  console.log(`📊 Found ${fileList.length} candidate images.`);
  
  for (const file of fileList) {
    await processImage(file);
  }

  console.log('==============================================');
  console.log(`🎉 COMPLETE! Processed ${filesProcessed} files.`);
  console.log(`💾 Total savings: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log('==============================================');
}

main().catch(console.error);
