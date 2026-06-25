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

const TITLES = [
  "Melissa", "Aynur", "Svetlana", "Ceren", "Ayla", "Esila",
  "Nihan", "Cansu", "Buse", "Derya", "Selin", "Melis"
];

const NICHES = [
  "Elite VIP Partner", "Kapalı VIP Escort", "Elit Rus Model", "VIP Elit Model",
  "Türk model - Ateşli uzman sevenlere", "Boşnak - Ateşli, heyecan verici uzman",
  "Lüks Konsept Partner", "VIP Masaj & Terapi Uzmanı", "Bireysel Vip Model",
  "Premium Escort Hizmeti", "VIP Sosyal Refakatçi"
];

// Dosya adlarında kullanılacak SEO dostu slug listesi
const SLUGS = [
  "istanbul-kaporasiz-escort",
  "istanbul-vip-partner",
  "istanbul-luks-escort",
  "istanbul-elit-model",
  "istanbul-bireysel-escort",
  "istanbul- premium-partner"
];

async function processNewProfiles() {
  try {
    if (!fs.existsSync(localVitrinDir)) {
      fs.mkdirSync(localVitrinDir, { recursive: true });
    }

    console.log('📂 [READ] Reading Desktop profile folders...');
    const folders = fs.readdirSync(desktopVitrinDir).filter(f => {
      return fs.statSync(path.join(desktopVitrinDir, f)).isDirectory();
    });

    console.log(`Found ${folders.length} profile folders.`);

    // Mevcut vitrin-images.ts dosyasındaki sabit ilk 6 reklam profilini koruyalım
    const AD_PROFILES_COUNT = 6;
    const { vitrinImages } = require('../lib/vitrin-images');
    const adProfiles = vitrinImages.slice(0, AD_PROFILES_COUNT);

    const outputProfiles: any[] = [...adProfiles];
    const logoMetadata = await sharp(logoPath).metadata();

    let imageCounter = 1;

    for (let folderIdx = 0; folderIdx < folders.length; folderIdx++) {
      const folderName = folders[folderIdx];
      const folderPath = path.join(desktopVitrinDir, folderName);
      
      console.log(`\n👤 Processing Folder: "${folderName}"...`);

      const files = fs.readdirSync(folderPath).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp';
      });

      if (files.length === 0) {
        console.warn(`⚠️ No images found in "${folderName}". Skipping.`);
        continue;
      }

      const galleryPaths: string[] = [];
      const profileName = TITLES[folderIdx % TITLES.length] || `Model-${folderIdx + 1}`;
      const niche = NICHES[folderIdx % NICHES.length];
      const slug = SLUGS[folderIdx % SLUGS.length];

      // Her klasörden en fazla 4 resim alıp işleyelim (kullanıcı talebi doğrultusunda)
      const imagesToProcess = files.slice(0, 4);

      for (let imgIdx = 0; imgIdx < imagesToProcess.length; imgIdx++) {
        const file = imagesToProcess[imgIdx];
        const srcPath = path.join(folderPath, file);
        
        // SEO dostu dosya ismi
        const destName = `${slug}-${profileName.toLowerCase()}-${imgIdx + 1}.webp`;
        const destPath = path.join(localVitrinDir, destName);

        // Resim boyutlarını al
        const imgMetadata = await sharp(srcPath).metadata();
        const targetWidth = Math.round((imgMetadata.width || 800) * 0.22); // Resmin %22'si oranında logo

        // Logoyu yeniden boyutlandır
        const resizedLogoBuffer = await sharp(logoPath)
          .resize({ width: targetWidth })
          .toBuffer();

        // Sharp ile resmi convert et, resize yap ve logoyu sağ alta yapıştır
        await sharp(srcPath)
          .resize(800, 1000, { fit: 'cover', position: 'top' })
          .composite([{
            input: resizedLogoBuffer,
            gravity: 'southeast',
            blend: 'over'
          }])
          .webp({ quality: 80, effort: 4 })
          .toFile(destPath);

        console.log(`   Processed and logo added: ${destName}`);
        galleryPaths.push(`/_media/vitrin/${destName}`);
        imageCounter++;
      }

      outputProfiles.push({
        title: profileName,
        src: galleryPaths[0],
        niche: niche,
        age: 22 + (folderIdx % 8),
        gallery: galleryPaths
      });
    }

    console.log('\n✍️ [WRITE] Updating local lib/vitrin-images.ts...');
    const fileContent = `export const vitrinImages = ${JSON.stringify(outputProfiles, null, 2)};\n`;
    fs.writeFileSync(path.join(__dirname, '..', 'lib', 'vitrin-images.ts'), fileContent, 'utf8');
    console.log('lib/vitrin-images.ts updated successfully.');

    // Sunucu deployment
    console.log('\n🔐 [CONNECTING] Connecting to root@31.97.79.34 for deployment...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // Upload files to remote VPS
    console.log('📤 [UPLOAD] Uploading new .webp files to VPS...');
    const allWebpFiles = fs.readdirSync(localVitrinDir).filter(f => f.endsWith('.webp'));

    for (const file of allWebpFiles) {
      const localPath = path.join(localVitrinDir, file);
      // Hem /root/esc projesine hem de yayın klasörüne kopyalayalım
      await ssh.putFile(localPath, `/var/www/escortvip/public/_media/vitrin/${file}`);
    }
    console.log(`Uploaded ${allWebpFiles.length} images to remote /var/www/escortvip/public/_media/vitrin/`);

    // Upload updated lib/vitrin-images.ts
    console.log('📤 [UPLOAD] Uploading updated lib/vitrin-images.ts...');
    const libContent = fs.readFileSync(path.join(__dirname, '..', 'lib', 'vitrin-images.ts'), 'utf8');
    const libBase64 = Buffer.from(libContent).toString('base64');
    await ssh.execCommand(`echo "${libBase64}" | base64 -d > /var/www/escortvip/lib/vitrin-images.ts`);

    // PM2 and Next Rebuild
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

    console.log('🏁 [SUCCESS] New branded vitrin and profiles deployed successfully!');
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 [FAILED]', err.message);
    ssh.dispose();
  }
}

processNewProfiles();
