import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  port: 22,
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

const desktopVitrinDir = 'C:\\Users\\onurk\\Desktop\\dorukcan ay vitrin';
const localVitrinDir = path.join(__dirname, '..', 'public', '_media', 'vitrin');
const logoPath = 'c:/Users/onurk/esc/public/sovereign_logo.png';

async function processOrganicProfiles() {
  try {
    if (!fs.existsSync(localVitrinDir)) {
      fs.mkdirSync(localVitrinDir, { recursive: true });
    }

    console.log('📂 [READ] Reading Desktop profile folders...');
    const folders = fs.readdirSync(desktopVitrinDir).filter(f => {
      return fs.statSync(path.join(desktopVitrinDir, f)).isDirectory();
    });

    // Sort folders numerically so that "kadın 10" and "kadın 11" are sorted after "kadın 9"
    const getNum = (name: string) => {
      const match = name.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };
    folders.sort((a, b) => getNum(a) - getNum(b));

    console.log('Sorted Folders:', folders);

    // Read the current vitrin-images.ts (which has been reverted to original state)
    const { vitrinImages } = require('../lib/vitrin-images');

    // We will modify the first 11 organic profiles (starting at index 6 of vitrinImages)
    // Index 6 is "VIP ESCORT 1", Index 16 is "TÜRBANLI ÇITIR 11"
    const START_INDEX = 6;
    const ORGANIC_COUNT = 11;

    for (let i = 0; i < folders.length && i < ORGANIC_COUNT; i++) {
      const folderName = folders[i];
      const folderPath = path.join(desktopVitrinDir, folderName);
      const profileIndex = START_INDEX + i;
      const targetProfile = vitrinImages[profileIndex];

      if (!targetProfile) {
        console.warn(`⚠️ No profile found at index ${profileIndex}. Skipping folder "${folderName}".`);
        continue;
      }

      console.log(`\n👤 Mapping folder "${folderName}" to profile "${targetProfile.title}" (Index ${profileIndex})`);

      const files = fs.readdirSync(folderPath).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp';
      });

      if (files.length === 0) {
        console.warn(`⚠️ No images found in "${folderName}". Skipping.`);
        continue;
      }

      // Process up to 4 images per profile
      const imagesToProcess = files.slice(0, 4);
      const galleryPaths: string[] = [];
      
      // Each organic profile i has a starting image index matching: i * 5 + 1
      const baseNum = i * 5 + 1;

      for (let imgIdx = 0; imgIdx < imagesToProcess.length; imgIdx++) {
        const file = imagesToProcess[imgIdx];
        const srcPath = path.join(folderPath, file);
        
        // Target filename
        const destName = `vip-profil-${baseNum + imgIdx}.webp`;
        const destPath = path.join(localVitrinDir, destName);

        // Image dimensions
        const imgMetadata = await sharp(srcPath).metadata();
        const targetWidth = Math.round((imgMetadata.width || 800) * 0.22); // 22% logo size

        // Resize logo
        const resizedLogoBuffer = await sharp(logoPath)
          .resize({ width: targetWidth })
          .toBuffer();

        // Convert image, resize, and add logo overlay in bottom-right corner
        await sharp(srcPath)
          .resize(800, 1000, { fit: 'cover', position: 'top' })
          .composite([{
            input: resizedLogoBuffer,
            gravity: 'southeast',
            blend: 'over'
          }])
          .webp({ quality: 80, effort: 4 })
          .toFile(destPath);

        console.log(`   Processed: ${destName}`);
        galleryPaths.push(`/_media/vitrin/${destName}`);
      }

      // Update the profile's src and gallery in the memory array
      targetProfile.src = galleryPaths[0];
      targetProfile.gallery = galleryPaths;
    }

    console.log('\n✍️ [WRITE] Saving local lib/vitrin-images.ts...');
    const fileContent = `export const vitrinImages = ${JSON.stringify(vitrinImages, null, 2)};\n`;
    fs.writeFileSync(path.join(__dirname, '..', 'lib', 'vitrin-images.ts'), fileContent, 'utf8');
    console.log('lib/vitrin-images.ts updated successfully.');

    // Connect to remote VPS for deployment
    console.log('\n🔐 [CONNECTING] Connecting to root@31.97.79.34...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // Upload only the generated vip-profil-*.webp files to VPS
    console.log('📤 [UPLOAD] Uploading new .webp files to VPS...');
    const generatedWebpFiles = fs.readdirSync(localVitrinDir).filter(f => f.startsWith('vip-profil-') && f.endsWith('.webp'));

    for (const file of generatedWebpFiles) {
      const localPath = path.join(localVitrinDir, file);
      // Upload to public/media folder and the CDN folder
      await ssh.putFile(localPath, `/var/www/escortvip/public/_media/vitrin/${file}`);
      await ssh.putFile(localPath, `/var/www/cdn/vitrin/${file}`);
    }
    console.log(`Uploaded ${generatedWebpFiles.length} images to both VPS media directories.`);

    // Upload updated lib/vitrin-images.ts
    console.log('📤 [UPLOAD] Uploading updated lib/vitrin-images.ts...');
    const libContent = fs.readFileSync(path.join(__dirname, '..', 'lib', 'vitrin-images.ts'), 'utf8');
    const libBase64 = Buffer.from(libContent).toString('base64');
    await ssh.execCommand(`echo "${libBase64}" | base64 -d > /var/www/escortvip/lib/vitrin-images.ts`);

    // Build and Reload
    console.log('🛑 [PM2 STOP] Stopping PM2 apps...');
    await ssh.execCommand('pm2 stop all', { cwd: '/var/www/escortvip' });

    console.log('⚙️ [BUILD] Triggering Next.js build on VPS...');
    const buildResult = await ssh.execCommand('npm run build', { cwd: '/var/www/escortvip' });
    console.log(buildResult.stdout);
    if (buildResult.stderr) console.warn(buildResult.stderr);

    console.log('🚀 [LAUNCH] Restarting PM2 apps...');
    await ssh.execCommand('pm2 delete all && pm2 start ecosystem.config.js --env production', { cwd: '/var/www/escortvip' });

    console.log('🌐 [NGINX] Restarting Nginx...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('🏁 [SUCCESS] Organic vitrin profiles successfully processed and deployed!');
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 [FAILED]', err.message);
    ssh.dispose();
  }
}

processOrganicProfiles();
