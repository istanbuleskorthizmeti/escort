const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      const base = path.basename(filePath);
      if (base === 'node_modules' || base === '.next' || base === '.git' || base === 'dist' || base === 'dist_scripts' || base === 'artifacts' || base === '.gemini') {
        continue;
      }
      getFiles(filePath, fileList);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.tsx') || filePath.endsWith('.json') || filePath.endsWith('.xml')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

function processFiles() {
  const baseDir = path.join(__dirname, '..');
  const dirs = [
    baseDir
  ];
  
  let files = [];
  dirs.forEach(d => files = getFiles(d, files));

  let updatedCount = 0;
  for (const file of files) {
    if (file === __filename) continue; // Skip this script itself
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // replace vipescorthizmeti.com with istanbulescort.blog
    if (/vipescorthizmeti\.com/gi.test(content)) {
      content = content.replace(/vipescorthizmeti\.com/gi, 'istanbulescort.blog');
      changed = true;
    }

    // replace istanbulescdrkcn.com with istanbulescort.blog
    if (/istanbulescdrkcn\.com/gi.test(content)) {
      content = content.replace(/istanbulescdrkcn\.com/gi, 'istanbulescort.blog');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ Updated: ${path.relative(baseDir, file)}`);
      updatedCount++;
    }
  }
  console.log(`🔥 SUCCESS! Total ${updatedCount} files updated with new primary domain istanbulescort.blog.`);
}

processFiles();
