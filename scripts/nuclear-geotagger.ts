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

const localMediaDir = path.join(process.cwd(), 'public', '_media', 'vitrin');

// Şişli / İstanbul GPS Koordinatları (Yerel Arama Egemenliği için)
const EXIF_METADATA = {
  IFD0: {
    Artist: 'Vip Escort Hizmeti',
    ImageDescription: 'Istanbul VIP Escort, Rus, Universiteli, Olgun ve Kaporasiz Partnerler 2026',
    Copyright: '© 2026 Vip Escort Hizmeti. Tum Haklari Saklidir.',
  },
  GPSInfo: {
    GPSLatitudeRef: 'N',
    GPSLatitude: [41, 3, 36.72], // 41.0602° N
    GPSLongitudeRef: 'E',
    GPSLongitude: [28, 59, 15.72], // 28.9877° E
  }
};

async function injectGeoTagsAndDeploy() {
  try {
    console.log('🎨 [GEO-TAGGER] Initializing Local Image EXIF Tagging...');

    if (!fs.existsSync(localMediaDir)) {
      console.warn('⚠️ No local vitrin images found to tag.');
      return;
    }

    const files = fs.readdirSync(localMediaDir).filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
    if (files.length === 0) {
      console.warn('⚠️ No image files found in public/_media/vitrin/');
      return;
    }

    console.log(`📸 Found ${files.length} images for Geo-Tagging optimization.`);

    // 1. Her bir görseli sharp ile okuyup EXIF mühürleyerek üzerine yazıyoruz
    for (const f of files) {
      const filePath = path.join(localMediaDir, f);
      const tempPath = path.join(localMediaDir, `temp-${f}`);

      try {
        console.log(`🎯 [TAGGING] Gömülüyor EXIF -> ${f}`);
        
        // sharp ile exif yazarak WebP'ye dönüştürüyoruz
        await sharp(filePath)
          .withMetadata({
            exif: {
              ...EXIF_METADATA
            }
          })
          .webp({ quality: 85 })
          .toFile(tempPath);

        // Orijinal dosyanın üzerine yazıyoruz
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        console.log(`✅ EXIF başarıyla mühürlendi: ${f}`);
      } catch (err: any) {
        console.error(`❌ Tagging failed for ${f}:`, err.message);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    }

    // 2. Uzak sunucuya bağlanıp güncellenen görselleri senkronize ediyoruz
    console.log('🔐 [CONNECTING] Connecting to Production Server...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    for (const f of files) {
      const localFile = path.join(localMediaDir, f);

      // Next.js public klasörüne yükle
      console.log(`📤 Uploading to public folder: ${f}`);
      await ssh.putFile(localFile, `/root/esc/public/_media/vitrin/${f}`);

      // Nginx CDN klasörüne yükle
      console.log(`📤 Uploading to Nginx CDN: ${f}`);
      await ssh.putFile(localFile, `/var/www/cdn/vitrin/${f}`);
    }

    // Yetki ayarları
    console.log('🔑 Adjusting permissions on production CDN...');
    await ssh.execCommand('chown -R www-data:www-data /var/www/cdn/vitrin');
    await ssh.execCommand('chmod -R 755 /var/www/cdn/vitrin');

    ssh.dispose();
    console.log('🏁 [GEO-TAGGED DEPLOY COMPLETE] All local vitrin images EXIF geo-tagged and uploaded successfully!');
  } catch (err: any) {
    console.error('💥 Geo-Tagger Deploy failed:', err.message);
    ssh.dispose();
  }
}

injectGeoTagsAndDeploy();
