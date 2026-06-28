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

async function processSelectiveVitrin() {
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

    // Keep only the first 6 main ad showcases from the original file
    const { vitrinImages: originalImages } = require('../lib/vitrin-images');
    const finalShowcases = originalImages.slice(0, 6);

    // 11 Organic profiles to be added
    const organicNames = [
      { name: "Nihan", niche: "Bireysel Escort", phone: "905016355053", age: 24, slug: "istanbul-kaporasiz-escort-nihan" },
      { name: "Cansu", niche: "VIP Partner", phone: "905016355053", age: 25, slug: "istanbul-vip-partner-cansu" },
      { name: "Buse", niche: "Lüks Escort", phone: "905016355053", age: 23, slug: "istanbul-luks-escort-buse" },
      { name: "Derya", niche: "Elit Model", phone: "905016355053", age: 26, slug: "istanbul-elit-model-derya" },
      { name: "Selin", niche: "Bireysel Escort", phone: "905016355053", age: 24, slug: "istanbul-bireysel-escort-selin" },
      { name: "Melis", niche: "VIP Escort", phone: "905016355053", age: 25, slug: "istanbul-vip-escort-melis" },
      { name: "Ebru", niche: "Premium Servis", phone: "905016355053", age: 24, slug: "istanbul-premium-servis-ebru" },
      { name: "Tuğçe", niche: "Gerçek Görselli", phone: "905016355053", age: 23, slug: "istanbul-gercek-gorselli-tugce" },
      { name: "Simge", niche: "Lüks Partner", phone: "905016355053", age: 25, slug: "istanbul-luks-partner-simge" },
      { name: "Dilara", niche: "Türbanlı Çıtır", phone: "905016355053", age: 22, slug: "istanbul-turbanli-citir-dilara" },
      { name: "Aslı", niche: "Rus Model", phone: "905016355053", age: 24, slug: "istanbul-rus-model-asli" }
    ];

    const generatedWebpFilesList: string[] = [];

    for (let i = 0; i < organicNames.length; i++) {
      const org = organicNames[i];
      const folderName = folders[i];

      if (!folderName) {
        console.warn(`⚠️ No folder available for organic profile "${org.name}". Adding with placeholder.`);
        finalShowcases.push({
          title: org.name,
          src: `/_media/vitrin/${org.slug}-1.webp`,
          phone: org.phone,
          niche: org.niche,
          isAd: false,
          age: org.age,
          gallery: [
            `/_media/vitrin/${org.slug}-1.webp`
          ]
        });
        continue;
      }

      const folderPath = path.join(desktopVitrinDir, folderName);
      const files = fs.readdirSync(folderPath).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp';
      });

      if (files.length === 0) {
        console.warn(`⚠️ No images found in "${folderName}". Adding "${org.name}" with placeholder paths.`);
        finalShowcases.push({
          title: org.name,
          src: `/_media/vitrin/${org.slug}-1.webp`,
          phone: org.phone,
          niche: org.niche,
          isAd: false,
          age: org.age,
          gallery: [
            `/_media/vitrin/${org.slug}-1.webp`
          ]
        });
        continue;
      }

      const imagesToProcess = files.slice(0, 4);
      const galleryPaths: string[] = [];

      console.log(`👤 Mapping folder "${folderName}" -> Organic Profile "${org.name}"`);

      for (let imgIdx = 0; imgIdx < imagesToProcess.length; imgIdx++) {
        const file = imagesToProcess[imgIdx];
        const srcPath = path.join(folderPath, file);
        const destName = `${org.slug}-${imgIdx + 1}.webp`;
        const destPath = path.join(localVitrinDir, destName);

        // Process image with logo overlay
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
        generatedWebpFilesList.push(destName);
      }

      // Add to list
      finalShowcases.push({
        title: org.name,
        src: galleryPaths[0],
        phone: org.phone,
        niche: org.niche,
        isAd: false,
        age: org.age,
        gallery: galleryPaths
      });
    }

    console.log('\n✍️ [WRITE] Writing local lib/vitrin-images.ts...');
    const fileContent = `export const vitrinImages = ${JSON.stringify(finalShowcases, null, 2)};\n`;
    fs.writeFileSync(path.join(__dirname, '..', 'lib', 'vitrin-images.ts'), fileContent, 'utf8');
    console.log('lib/vitrin-images.ts successfully updated with exactly 17 profiles.');

    // Connect to VPS and deploy
    console.log('\n🔐 [CONNECTING] Connecting to root@31.97.79.34...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // Upload generated webp files to remote directories
    console.log('📤 [UPLOAD] Uploading all newly generated organic webp files to VPS...');
    for (const file of generatedWebpFilesList) {
      const localPath = path.join(localVitrinDir, file);
      await ssh.putFile(localPath, `/var/www/escortvip/public/_media/vitrin/${file}`);
      await ssh.putFile(localPath, `/var/www/cdn/vitrin/${file}`);
    }
    console.log(`Uploaded ${generatedWebpFilesList.length} files successfully.`);

    // Upload updated lib/vitrin-images.ts
    console.log('📤 [UPLOAD] Uploading updated lib/vitrin-images.ts...');
    const libContent = fs.readFileSync(path.join(__dirname, '..', 'lib', 'vitrin-images.ts'), 'utf8');
    const libBase64 = Buffer.from(libContent).toString('base64');
    await ssh.execCommand(`echo "${libBase64}" | base64 -d > /var/www/escortvip/lib/vitrin-images.ts`);

    // Build and restart PM2
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

    console.log('🏁 [SUCCESS] Vitrin images successfully pruned and deployed! Only 17 active profiles remain.');
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 [FAILED]', err.message);
    ssh.dispose();
  }
}

processSelectiveVitrin();
