const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { NodeSSH } = require('node-ssh');

const RAW_DIR = 'C:\\Users\\onurk\\Desktop\\DORUKCAN_AY_ELITE_VITRIN';
const WEBP_DIR = 'C:\\Users\\onurk\\Desktop\\vitrin_webp';
const ZIP_FILE = 'C:\\Users\\onurk\\Desktop\\vitrin_cdn.zip';

async function processImages() {
  console.log('🖼️ Starting Vitrin Image Optimization for Mobile...');
  
  if (!fs.existsSync(WEBP_DIR)) {
    fs.mkdirSync(WEBP_DIR, { recursive: true });
  }

  const files = fs.readdirSync(RAW_DIR).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
  console.log(`Found ${files.length} images to process.`);

  let count = 0;
  for (const file of files) {
    const inputPath = path.join(RAW_DIR, file);
    const outputName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const outputPath = path.join(WEBP_DIR, outputName);

    try {
      await sharp(inputPath)
        .webp({ quality: 80, effort: 4 })
        .resize(800, 1000, { fit: 'cover', position: 'top' }) // Optimal for mobile profile showcase
        .toFile(outputPath);
      count++;
      if (count % 50 === 0) console.log(`  Processed ${count}/${files.length}...`);
    } catch (e) {
      console.error(`Error processing ${file}:`, e.message);
    }
  }

  console.log('✅ Optimization complete. Zipping...');
  
  // Create ZIP using powershell
  if (fs.existsSync(ZIP_FILE)) fs.unlinkSync(ZIP_FILE);
  const zipCmd = `powershell "Compress-Archive -Path '${WEBP_DIR}\\*' -DestinationPath '${ZIP_FILE}'"`;
  execSync(zipCmd);
  
  const size = fs.statSync(ZIP_FILE).size / (1024 * 1024);
  console.log(`📦 Zip created: ${size.toFixed(2)} MB`);

  console.log('🚀 Uploading to Nginx CDN directory...');
  const ssh = new NodeSSH();
  await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!', readyTimeout: 20000});
  
  await ssh.putFile(ZIP_FILE, '/root/vitrin_cdn.zip');
  
  console.log('🏗️ Extracting to /var/www/cdn/vitrin/ ...');
  await ssh.execCommand('mkdir -p /var/www/cdn/vitrin');
  await ssh.execCommand('unzip -o /root/vitrin_cdn.zip -d /var/www/cdn/vitrin/');
  await ssh.execCommand('rm /root/vitrin_cdn.zip');
  
  // Map permissions correctly for Nginx
  await ssh.execCommand('chown -R www-data:www-data /var/www/cdn/vitrin');
  await ssh.execCommand('chmod -R 755 /var/www/cdn/vitrin');

  console.log('🏁 VITRIN CDN UPLOAD COMPLETE!');
  ssh.dispose();
}

processImages().catch(console.error);
