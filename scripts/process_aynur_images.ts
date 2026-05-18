import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

const aynurRawDir = 'C:\\Users\\onurk\\Desktop\\vitrin dorukcan\\aynur';
const localMediaDir = path.join(process.cwd(), 'public', '_media', 'vitrin');

const files = [
  'WhatsApp Image 2026-05-15 at 09.05.13.jpeg',
  '2.jpeg',
  '3.jpeg',
  '4.jpeg'
];

async function run() {
  try {
    console.log('🎨 [SHARP] Processing Aynur profile images...');

    // Ensure directory exists
    if (!fs.existsSync(localMediaDir)) {
      fs.mkdirSync(localMediaDir, { recursive: true });
    }

    // 1. Process and save WebP files locally
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const srcPath = path.join(aynurRawDir, f);
      const destName = `istanbul-kaporasiz-escort-aynur-${i + 1}.webp`;
      const destPath = path.join(localMediaDir, destName);

      if (!fs.existsSync(srcPath)) {
        throw new Error(`Raw image not found: ${srcPath}`);
      }

      await sharp(srcPath)
        .webp({ quality: 85, effort: 4 })
        .resize(800, 1000, { fit: 'cover', position: 'top' })
        .toFile(destPath);
      
      console.log(`✅ Processed: ${f} -> ${destName}`);
    }

    console.log('🔐 [CONNECTING] Connecting to Production Server...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 2. Upload WebP files to remote public folder and CDN folder
    for (let i = 0; i < files.length; i++) {
      const destName = `istanbul-kaporasiz-escort-aynur-${i + 1}.webp`;
      const localFile = path.join(localMediaDir, destName);

      // Upload to Next.js public folder on server
      console.log(`📤 Uploading to public folder: ${destName}`);
      await ssh.putFile(localFile, `/root/esc/public/_media/vitrin/${destName}`);

      // Upload to CDN folder on server
      console.log(`📤 Uploading to Nginx CDN: ${destName}`);
      await ssh.putFile(localFile, `/var/www/cdn/vitrin/${destName}`);
    }

    // Set correct permissions on remote CDN files
    console.log('🔑 Adjusting permissions on production CDN...');
    await ssh.execCommand('chown -R www-data:www-data /var/www/cdn/vitrin');
    await ssh.execCommand('chmod -R 755 /var/www/cdn/vitrin');

    console.log('🏁 [SUCCESS] All Aynur profile images are optimized and deployed!');
    ssh.dispose();
  } catch (err) {
    console.error('💥 Error:', err);
    ssh.dispose();
  }
}

run();
