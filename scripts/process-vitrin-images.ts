import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { NodeSSH } from 'node-ssh';
import { execSync } from 'child_process';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  port: 22,
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

const localSourceDir = 'C:\\Users\\onurk\\Desktop\\vitrin yeni görsel';
const localDestDir = path.join(process.cwd(), 'public', '_media', 'vitrin');

async function main() {
  console.log('⚡ Starting VIP Profile Image Processing & Deployment...');

  if (!fs.existsSync(localSourceDir)) {
    console.error(`❌ Source directory not found: ${localSourceDir}`);
    process.exit(1);
  }

  // Ensure dest directory exists
  if (!fs.existsSync(localDestDir)) {
    fs.mkdirSync(localDestDir, { recursive: true });
  }

  // Read and sort files numerically to match indices
  const rawFiles = fs.readdirSync(localSourceDir)
    .filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));

  // Sort files. We want to sort them numerically by looking at the first number in the filename.
  // Filename format example: photo_1_2026-05-04_17-54-52.jpg -> 1
  rawFiles.sort((a, b) => {
    const numA = parseInt(a.replace(/[^\d]/g, '').substring(0, 5)) || 0;
    const numB = parseInt(b.replace(/[^\d]/g, '').substring(0, 5)) || 0;
    return numA - numB;
  });

  console.log(`📸 Found ${rawFiles.length} images to process.`);

  // Process images in chunks to avoid memory issues with Sharp
  const chunkSize = 10;
  for (let i = 0; i < rawFiles.length; i += chunkSize) {
    const chunk = rawFiles.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (file, index) => {
      const idx = i + index + 1;
      const srcPath = path.join(localSourceDir, file);
      const destName = `vip-profil-${idx}.webp`;
      const destPath = path.join(localDestDir, destName);

      try {
        await sharp(srcPath)
          .webp({ quality: 80, effort: 4 })
          .resize(800, 1000, { fit: 'cover', position: 'top' })
          .toFile(destPath);
        
        if (idx % 20 === 0 || idx === rawFiles.length) {
          console.log(`⏳ Processed: ${idx}/${rawFiles.length} images.`);
        }
      } catch (err: any) {
        console.error(`❌ Failed to process ${file}:`, err.message);
      }
    }));
  }

  console.log('📦 Bundling processed images into a tarball...');
  const tarballName = 'vitrin_images.tar.gz';
  
  // Create tarball from the processed files
  // Using tar.exe available in Windows
  try {
    execSync(`tar.exe -czf ${tarballName} -C "${localDestDir}" .`);
    console.log('✅ Tarball created successfully.');
  } catch (err: any) {
    console.error('❌ Failed to create tarball:', err.message);
    process.exit(1);
  }

  console.log('🔐 Connecting to remote VPS via SSH...');
  try {
    await ssh.connect(config);
    console.log('✅ SSH Connection established.');

    console.log('📤 Uploading tarball to VPS...');
    const remoteTarballPath = `/root/${tarballName}`;
    await ssh.putFile(path.resolve(tarballName), remoteTarballPath);
    console.log('✅ Tarball uploaded.');

    console.log('🏗️ Preparing directories and extracting on VPS...');
    await ssh.execCommand('mkdir -p /var/www/escortvip/public/_media/vitrin');
    await ssh.execCommand('mkdir -p /var/www/cdn/vitrin');

    console.log('📦 Extracting to project vitrin directory...');
    const extProject = await ssh.execCommand(`tar -xzf ${remoteTarballPath} -C /var/www/escortvip/public/_media/vitrin/`);
    if (extProject.stderr) console.warn('Project extraction warn:', extProject.stderr);

    console.log('📦 Extracting to CDN vitrin directory...');
    const extCDN = await ssh.execCommand(`tar -xzf ${remoteTarballPath} -C /var/www/cdn/vitrin/`);
    if (extCDN.stderr) console.warn('CDN extraction warn:', extCDN.stderr);

    console.log('🧹 Cleaning up remote tarball...');
    await ssh.execCommand(`rm ${remoteTarballPath}`);

    console.log('🔑 Setting permissions...');
    await ssh.execCommand('chown -R www-data:www-data /var/www/escortvip/public/_media/vitrin');
    await ssh.execCommand('chmod -R 755 /var/www/escortvip/public/_media/vitrin');
    await ssh.execCommand('chown -R www-data:www-data /var/www/cdn/vitrin');
    await ssh.execCommand('chmod -R 755 /var/www/cdn/vitrin');

    console.log('🏁 [SUCCESS] ALL 221 PREMIUM VITRIN IMAGES HAVE BEEN DEPLOYED!');
  } catch (err: any) {
    console.error('💥 SSH/Deployment failed:', err.message);
  } finally {
    ssh.dispose();
    if (fs.existsSync(tarballName)) {
      fs.unlinkSync(tarballName);
    }
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
