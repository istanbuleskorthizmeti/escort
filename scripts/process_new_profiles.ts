import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  port: 22,
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

const localMediaDir = path.join(process.cwd(), 'public', '_media', 'vitrin');

const profiles = [
  {
    name: 'Ayla',
    rawDir: 'C:\\Users\\onurk\\Desktop\\on34\\Ayla',
    prefix: 'istanbul-kaporasiz-escort-ayla',
    files: [
      'WhatsApp Image 2026-06-07 at 10.15.18.jpeg',
      'WhatsApp Image 2026-06-07 at 10.15.19.jpeg',
      'WhatsApp Image 2026-06-07 at 108.15.19.jpeg',
      'ayla-escort-istanbul.jpeg',
      'ayla-escort-istanbul2.jpeg'
    ]
  },
  {
    name: 'Esila',
    rawDir: 'C:\\Users\\onurk\\Desktop\\on34\\Esila',
    prefix: 'istanbul-kaporasiz-escort-esila',
    files: [
      'WhatsApp Image 2026-06-07 at 049.52.48.jpeg',
      'WhatsApp Image 2026-06-07 at 09.52.47.jpeg',
      'WhatsApp Image 2026-06-07 at 09.52.48.jpeg',
      'esila-escort-34-istanbul.jpeg'
    ]
  },
  {
    name: 'Lamia',
    rawDir: 'C:\\Users\\onurk\\Desktop\\on34\\Lamia',
    prefix: 'istanbul-kaporasiz-escort-lamia',
    files: [
      '22.jpeg',
      '55.jpeg',
      'WhatsApp Ima4ge 2026-06-07 at 09.45.33.jpeg',
      'WhatsApp Image 2026-06-07 a4t 09.45.33.jpeg',
      'WhatsApp Image 2026-06-07 at 09.45.33.jpeg',
      'lamia-escort-2026.jpeg'
    ]
  },
  {
    name: 'Hande',
    rawDir: 'C:\\Users\\onurk\\Desktop\\on34\\Hande',
    prefix: 'istanbul-kaporasiz-escort-hande',
    files: [
      'Wha8tsApp Image 2026-06-07 at 09.42.56.jpeg',
      'WhatsApp Image 2026-06-07 at 09.42.56.jpeg',
      'WhatsApp Image 2026-06-07 at 09.428.56.jpeg',
      'WhatsApp Image 2026-806-07 at 09.42.56.jpeg',
      'hande-escort-2026.jpeg'
    ]
  }
];

async function run() {
  try {
    console.log('🎨 [SHARP] Optimizing and converting profile images...');

    // Ensure local directory exists
    if (!fs.existsSync(localMediaDir)) {
      fs.mkdirSync(localMediaDir, { recursive: true });
    }

    // Process each profile
    const processedFiles: { [key: string]: string[] } = {};

    for (const profile of profiles) {
      console.log(`\n👤 Processing profile: ${profile.name}`);
      processedFiles[profile.name] = [];

      for (let i = 0; i < profile.files.length; i++) {
        const rawFile = profile.files[i];
        const srcPath = path.join(profile.rawDir, rawFile);
        const destName = `${profile.prefix}-${i + 1}.webp`;
        const destPath = path.join(localMediaDir, destName);

        if (!fs.existsSync(srcPath)) {
          console.warn(`⚠️ Warning: Raw image not found: ${srcPath}. Skipping.`);
          continue;
        }

        await sharp(srcPath)
          .webp({ quality: 85, effort: 4 })
          .resize(800, 1000, { fit: 'cover', position: 'top' })
          .toFile(destPath);

        processedFiles[profile.name].push(destName);
        console.log(`    Local WebP generated: ${destName}`);
      }
    }

    console.log('\n🔐 [CONNECTING] Connecting to root@187.77.111.203...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // Upload to production server
    for (const profile of profiles) {
      console.log(`\n📤 Uploading ${profile.name} images...`);
      for (const destName of processedFiles[profile.name]) {
        const localFile = path.join(localMediaDir, destName);

        // Upload to project public folder
        console.log(`   Uploading: ${destName} -> /var/www/escortvip/public/_media/vitrin/`);
        await ssh.putFile(localFile, `/var/www/escortvip/public/_media/vitrin/${destName}`);

        // Check and upload to Nginx CDN if exists (optional safeguard)
        const checkCDN = await ssh.execCommand('[ -d /var/www/cdn/vitrin ] && echo "exists"');
        if (checkCDN.stdout.trim() === 'exists') {
          console.log(`   Uploading: ${destName} -> /var/www/cdn/vitrin/`);
          await ssh.putFile(localFile, `/var/www/cdn/vitrin/${destName}`);
        }
      }
    }

    // Adjust remote permissions
    console.log('\n🔑 Adjusting remote permissions...');
    await ssh.execCommand('chown -R www-data:www-data /var/www/escortvip/public/_media/vitrin');
    await ssh.execCommand('chmod -R 755 /var/www/escortvip/public/_media/vitrin');

    console.log('\n🏁 [SUCCESS] All new profile images processed and deployed to server!');
    ssh.dispose();
  } catch (err) {
    console.error('💥 Error processing profiles:', err);
    ssh.dispose();
  }
}

run();
