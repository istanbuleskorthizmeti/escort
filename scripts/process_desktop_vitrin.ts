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

const desktopDir = 'C:\\Users\\onurk\\Desktop\\vitrin yeni görsel';
const localVitrinDir = path.join(process.cwd(), 'public', '_media', 'vitrin');

const AD_PROFILES = [
  {
    "title": "Escort Melissa",
    "src": "/_media/vitrin/istanbul-kaporasiz-escort-melissa-1.webp",
    "phone": "905330892496",
    "niche": "Elite VIP Partner",
    "isAd": true,
    "age": 27,
    "gallery": [
      "/_media/vitrin/istanbul-kaporasiz-escort-melissa-1.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-melissa-2.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-melissa-3.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-melissa-4.webp"
    ]
  },
  {
    "title": "Escort Aynur",
    "src": "/_media/vitrin/istanbul-kaporasiz-escort-aynur-1.webp",
    "phone": "905016355053",
    "niche": "Kapalı VIP Escort",
    "isAd": true,
    "age": 26,
    "gallery": [
      "/_media/vitrin/istanbul-kaporasiz-escort-aynur-1.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-aynur-2.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-aynur-3.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-aynur-4.webp"
    ]
  },
  {
    "title": "Escort Svetlana",
    "src": "/_media/vitrin/istanbul-kaporasiz-escort-svetlana-1.webp",
    "phone": "447426976466",
    "niche": "Elit Rus Model",
    "isAd": true,
    "age": 29,
    "gallery": [
      "/_media/vitrin/istanbul-kaporasiz-escort-svetlana-1.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-svetlana-2.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-svetlana-3.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-svetlana-4.webp"
    ]
  },
  {
    "title": "Escort Ceren",
    "src": "/_media/vitrin/istanbul-kaporasiz-escort-ceren-1.webp",
    "phone": "905368396114",
    "niche": "VIP Elit Model",
    "isAd": true,
    "age": 28,
    "gallery": [
      "/_media/vitrin/istanbul-kaporasiz-escort-ceren-1.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-ceren-2.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-ceren-3.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-ceren-4.webp"
    ]
  },
  {
    "title": "Escort Ayla",
    "src": "/_media/vitrin/istanbul-kaporasiz-escort-ayla-1.webp",
    "niche": "Türk model - Ateşli uzman sevenlere",
    "isAd": true,
    "age": 25,
    "gallery": [
      "/_media/vitrin/istanbul-kaporasiz-escort-ayla-1.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-ayla-2.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-ayla-3.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-ayla-4.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-ayla-5.webp"
    ]
  },
  {
    "title": "Escort Esila",
    "src": "/_media/vitrin/istanbul-kaporasiz-escort-esila-1.webp",
    "niche": "Boşnak - Ateşli, heyecan verici uzman",
    "isAd": true,
    "age": 27,
    "gallery": [
      "/_media/vitrin/istanbul-kaporasiz-escort-esila-1.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-esila-2.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-esila-3.webp",
      "/_media/vitrin/istanbul-kaporasiz-escort-esila-4.webp"
    ]
  }
];

const TITLES = [
  "VIP ESCORT", "ELİT PARTNER", "BİREYSEL MODEL", "ÜNİVERSİTELİ ÇITIR",
  "OLGUN LADY", "YABANCI MODEL", "PREMIUM SERVİS", "ANALİZ EDİLMİŞ MODEL",
  "GERÇEK GÖRSELLİ", "LÜKS PARTNER", "TÜRBANLI ÇITIR", "RUS MODEL"
];

async function processVitrin() {
  try {
    console.log('🧹 [CLEANUP] Deleting old organic vip-profil-*.webp files...');
    const localFiles = fs.readdirSync(localVitrinDir);
    let deletedCount = 0;
    localFiles.forEach(file => {
      if (file.startsWith('vip-profil-') && file.endsWith('.webp')) {
        fs.unlinkSync(path.join(localVitrinDir, file));
        deletedCount++;
      }
    });
    console.log(`Deleted ${deletedCount} local vip-profil-*.webp files.`);

    console.log('📂 [READ] Reading desktop images...');
    const desktopFiles = fs.readdirSync(desktopDir);
    const profilesMap: { [key: string]: string[] } = {};

    desktopFiles.forEach(f => {
      if (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.jpeg')) {
        const match = f.match(/^photo_(\d+)_/);
        if (match) {
          const id = match[1];
          if (!profilesMap[id]) {
            profilesMap[id] = [];
          }
          profilesMap[id].push(f);
        }
      }
    });

    const sortedIds = Object.keys(profilesMap).sort((a, b) => parseInt(a) - parseInt(b));
    console.log(`Found ${sortedIds.length} profiles to process.`);

    const outputProfiles: any[] = [...AD_PROFILES];
    let globalImageIndex = 1;

    for (let pIdx = 0; pIdx < sortedIds.length; pIdx++) {
      const id = sortedIds[pIdx];
      const photos = profilesMap[id].sort(); // sort to keep order deterministic

      console.log(`👤 Processing Profile ID ${id} (${photos.length} photos)...`);
      const galleryPaths: string[] = [];

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const srcPath = path.join(desktopDir, photo);
        const destName = `vip-profil-${globalImageIndex}.webp`;
        const destPath = path.join(localVitrinDir, destName);

        // Convert and resize using sharp
        await sharp(srcPath)
          .webp({ quality: 80, effort: 4 })
          .resize(800, 1000, { fit: 'cover', position: 'top' })
          .toFile(destPath);

        galleryPaths.push(`/_media/vitrin/${destName}`);
        globalImageIndex++;
      }

      // Add to output list
      const titleType = TITLES[pIdx % TITLES.length];
      outputProfiles.push({
        title: `${titleType} ${pIdx + 1}`,
        src: galleryPaths[0],
        gallery: galleryPaths
      });
    }

    console.log('✍️ [WRITE] Writing new vitrinImages back to lib/vitrin-images.ts...');
    const fileContent = `export const vitrinImages = ${JSON.stringify(outputProfiles, null, 2)};\n`;
    fs.writeFileSync(path.join(process.cwd(), 'lib', 'vitrin-images.ts'), fileContent, 'utf8');
    console.log('lib/vitrin-images.ts updated successfully.');

    // Connect to server and perform sync
    console.log('\n🔐 [CONNECTING] Connecting to root@31.97.79.34 for deployment...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // Clear server vip-profil-*.webp files
    console.log('🧹 [VPS CLEANUP] Deleting old remote vip-profil-*.webp files...');
    await ssh.execCommand('rm -f /root/esc/public/_media/vitrin/vip-profil-*.webp');
    await ssh.execCommand('rm -f /var/www/escortvip/public/_media/vitrin/vip-profil-*.webp');

    // Upload new files
    console.log('📤 [UPLOAD] Uploading new vip-profil-*.webp files to VPS...');
    const newLocalFiles = fs.readdirSync(localVitrinDir).filter(f => f.startsWith('vip-profil-') && f.endsWith('.webp'));

    for (const file of newLocalFiles) {
      const localPath = path.join(localVitrinDir, file);
      console.log(`   Uploading: ${file}`);
      await ssh.putFile(localPath, `/root/esc/public/_media/vitrin/${file}`);
    }

    // Upload updated lib/vitrin-images.ts
    console.log('📤 [UPLOAD] Uploading updated lib/vitrin-images.ts...');
    const libContent = fs.readFileSync(path.join(process.cwd(), 'lib', 'vitrin-images.ts'), 'utf8');
    const libBase64 = Buffer.from(libContent).toString('base64');
    await ssh.execCommand(`echo "${libBase64}" | base64 -d > /root/esc/lib/vitrin-images.ts`);

    // Clean up PM2 and Rebuild
    console.log('🛑 [PM2 STOP] Stopping PM2 cluster...');
    await ssh.execCommand('pm2 stop all', { cwd: '/root/esc' });

    console.log('⚙️ [BUILD] Triggering Next.js build...');
    const buildResult = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log(buildResult.stdout);
    if (buildResult.stderr) console.warn(buildResult.stderr);

    console.log('🚀 [LAUNCH] Restarting PM2 apps...');
    await ssh.execCommand('pm2 delete all && pm2 start ecosystem.config.js --env production', { cwd: '/root/esc' });

    console.log('🌐 [NGINX] Restarting Nginx...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('🏁 [SUCCESS] Deploy completed.');
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 [FAILED]', err.message);
    ssh.dispose();
  }
}

processVitrin();
