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

async function processAllVitrin() {
  try {
    if (!fs.existsSync(localVitrinDir)) {
      fs.mkdirSync(localVitrinDir, { recursive: true });
    }

    console.log('📂 [READ] Reading Desktop profile folders...');
    const folders = fs.readdirSync(desktopVitrinDir).filter(f => {
      return fs.statSync(path.join(desktopVitrinDir, f)).isDirectory();
    });

    // Numerical sort
    const getNum = (name: string) => {
      const match = name.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };
    folders.sort((a, b) => getNum(a) - getNum(b));

    console.log('Sorted Folders:', folders);

    // Load original vitrin-images (Melissa, Aynur, Svetlana, Ceren, Ayla, Esila)
    const { vitrinImages } = require('../lib/vitrin-images');

    // Define prefix slugs for the first 6 ad showcases
    const AD_SLUGS = [
      "istanbul-kaporasiz-escort-melissa",
      "istanbul-kaporasiz-escort-aynur",
      "istanbul-kaporasiz-escort-svetlana",
      "istanbul-kaporasiz-escort-ceren",
      "istanbul-kaporasiz-escort-ayla",
      "istanbul-kaporasiz-escort-esila"
    ];

    for (let i = 0; i < folders.length; i++) {
      const folderName = folders[i];
      const folderPath = path.join(desktopVitrinDir, folderName);

      // Read images in folder
      const files = fs.readdirSync(folderPath).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp';
      });

      if (files.length === 0) {
        console.warn(`⚠️ No images found in "${folderName}". Skipping.`);
        continue;
      }

      const imagesToProcess = files.slice(0, 4);
      const galleryPaths: string[] = [];

      let targetProfileIndex = 0;
      let filePrefix = '';

      if (i < 6) {
        // First 6 folders go to the 6 main ad showcases (index 0 to 5)
        targetProfileIndex = i;
        filePrefix = AD_SLUGS[i];
      } else {
        // Next folders (index 6 to 9) go to organic profiles:
        // Folder index 6 -> VIP ESCORT 1 (index 6 in vitrinImages)
        // Folder index 7 -> ELİT PARTNER 2 (index 7 in vitrinImages)
        // Folder index 8 -> BİREYSEL MODEL 3 (index 8 in vitrinImages)
        // Folder index 9 -> ÜNİVERSİTELİ ÇITIR 4 (index 9 in vitrinImages)
        targetProfileIndex = i;
        const organicIndex = i - 6; // 0, 1, 2, 3
        const baseNum = organicIndex * 5 + 1; // 1, 6, 11, 16
        filePrefix = `vip-profil-base-${baseNum}`; // temporary to generate unique but structured files
      }

      const targetProfile = vitrinImages[targetProfileIndex];
      if (!targetProfile) {
        console.warn(`⚠️ No profile found at index ${targetProfileIndex}. Skipping.`);
        continue;
      }

      console.log(`👤 Mapping folder "${folderName}" -> Profile "${targetProfile.title}" (Index ${targetProfileIndex})`);

      for (let imgIdx = 0; imgIdx < imagesToProcess.length; imgIdx++) {
        const file = imagesToProcess[imgIdx];
        const srcPath = path.join(folderPath, file);

        let destName = '';
        if (i < 6) {
          destName = `${filePrefix}-${imgIdx + 1}.webp`;
        } else {
          // For organic profiles, write exactly to their vip-profil-X.webp file names
          const organicIndex = i - 6;
          const baseNum = organicIndex * 5 + 1;
          destName = `vip-profil-${baseNum + imgIdx}.webp`;
        }

        const destPath = path.join(localVitrinDir, destName);

        // Process watermark and conversion
        const imgMetadata = await sharp(srcPath).metadata();
        const targetWidth = Math.round((imgMetadata.width || 800) * 0.22); // 22% logo

        const resizedLogoBuffer = await sharp(logoPath)
          .resize({ width: targetWidth })
          .toBuffer();

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

      // Update in-memory database
      targetProfile.src = galleryPaths[0];
      targetProfile.gallery = galleryPaths;
    }

    console.log('\n✍️ [WRITE] Updating local lib/vitrin-images.ts...');
    const fileContent = `export const vitrinImages = ${JSON.stringify(vitrinImages, null, 2)};\n`;
    fs.writeFileSync(path.join(__dirname, '..', 'lib', 'vitrin-images.ts'), fileContent, 'utf8');
    console.log('lib/vitrin-images.ts updated successfully.');

    // Connect and deploy
    console.log('\n🔐 [CONNECTING] Connecting to root@31.97.79.34...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // Upload generated webp files to remote directories
    console.log('📤 [UPLOAD] Uploading all generated webp files to VPS...');
    const generatedWebpFiles = fs.readdirSync(localVitrinDir).filter(f => f.endsWith('.webp'));

    for (const file of generatedWebpFiles) {
      const localPath = path.join(localVitrinDir, file);
      await ssh.putFile(localPath, `/var/www/escortvip/public/_media/vitrin/${file}`);
      await ssh.putFile(localPath, `/var/www/cdn/vitrin/${file}`);
    }
    console.log(`Uploaded ${generatedWebpFiles.length} files successfully.`);

    // Upload updated lib/vitrin-images.ts
    console.log('📤 [UPLOAD] Uploading updated lib/vitrin-images.ts...');
    const libContent = fs.readFileSync(path.join(__dirname, '..', 'lib', 'vitrin-images.ts'), 'utf8');
    const libBase64 = Buffer.from(libContent).toString('base64');
    await ssh.execCommand(`echo "${libBase64}" | base64 -d > /var/www/escortvip/lib/vitrin-images.ts`);

    // Rebuild next.js and reload
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

    console.log('🏁 [SUCCESS] Main vitrin and organic profiles fully updated on production!');
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 [FAILED]', err.message);
    ssh.dispose();
  }
}

processAllVitrin();
