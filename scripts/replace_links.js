const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.tsx')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

function processFiles() {
  const baseDir = process.cwd();
  const dirs = [
    path.join(baseDir, 'scripts'), 
    path.join(baseDir, 'lib'),
    path.join(baseDir, 'app'),
    path.join(baseDir, 'components')
  ];
  
  let files = [];
  dirs.forEach(d => files = getFiles(d, files));

  let updatedCount = 0;
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Bit.ly linkini güncelle
    if (content.includes('bit.ly/dorukcanmanay') || content.includes('bit.ly/dorukcanmanay')) {
      content = content.replace(/bit\.ly\/istanbulescort2026/g, 'bit.ly/dorukcanmanay');
      content = content.replace(/bit\.ly\/istanbulvipescort2026/g, 'bit.ly/dorukcanmanay');
      changed = true;
    }
    
    // Ana hedef site tanımlarını güncelle
    if (content.includes('istanbulescort.blog')) {
      // Spesifik MONEY_SITE değişiklikleri
      content = content.replace(/MONEY_SITE = "https:\/\/vipescorthizmeti\.com"/g, 'MONEY_SITE = "https://istanbulescort.blog"');
      content = content.replace(/MONEY_SITE = 'https:\/\/vipescorthizmeti\.com'/g, "MONEY_SITE = 'https://istanbulescort.blog'");
      
      // Sadece backlink botlarındaki site ismini değiştir
      content = content.replace(/"https:\/\/vipescorthizmeti\.com"/g, '"https://istanbulescort.blog"');
      content = content.replace(/'https:\/\/vipescorthizmeti\.com'/g, "'https://istanbulescort.blog'");
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ Güncellendi: ${path.relative(__dirname, file)}`);
      updatedCount++;
    }
  }
  console.log(`🔥 BİTTİ! Toplam ${updatedCount} dosyada linkler güncellendi.`);
}

processFiles();
