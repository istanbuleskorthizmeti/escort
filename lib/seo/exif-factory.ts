import piexif from 'piexifjs';
import { LOCAL_LANDMARKS } from '../geo-data';

/**
 * 🧛‍♂️ DRKCNAY EXIF FACTORY
 * Görsellere otonom olarak GPS, Cihaz ve Zaman verisi gömer.
 * Google'ın "Yerel Görsel" algoritmasını manipüle eder.
 */

const CAMERA_MODELS = [
  { make: "Apple", model: "iPhone 15 Pro Max", lens: "iPhone 15 Pro Max back triple camera 6.86mm f/1.78" },
  { make: "Apple", model: "iPhone 14 Pro", lens: "iPhone 14 Pro back triple camera 6.12mm f/1.78" },
  { make: "Samsung", model: "Galaxy S24 Ultra", lens: "S24 Ultra Main Camera f/1.7" },
  { make: "Google", model: "Pixel 8 Pro", lens: "Pixel 8 Pro Main Camera f/1.68" }
];

function degToExif(deg: number) {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60 * 100);
  return [[degrees, 1], [minutes, 1], [seconds, 100]];
}

function generateRandomRecentDate() {
  const start = new Date(2026, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${randomDate.getFullYear()}:${pad(randomDate.getMonth() + 1)}:${pad(randomDate.getDate())} ${pad(randomDate.getHours())}:${pad(randomDate.getMinutes())}:${pad(randomDate.getSeconds())}`;
}

export class ExifFactory {
  
  /**
   * Bir görsele (binary data) belirlenen semt için EXIF verisi gömer.
   */
  static injectLocationData(imageBuffer: Buffer, district: string): Buffer {
    try {
      const binaryData = imageBuffer.toString('binary');
      const districtLower = district.toLowerCase();
      
      // 📍 Koordinatları Belirle (Varsayılan İstanbul Merkezi)
      let lat = 41.0082;
      let lng = 28.9784;

      // lib/geo-data.ts üzerinden veya manuel eşleşme
      const landmark = LOCAL_LANDMARKS[districtLower]?.[0];
      if (landmark) {
        // Not: LOCAL_LANDMARKS içinde koordinat yoksa varsayılan semt merkezlerini kullanalım
        if (districtLower === 'sisli') { lat = 41.0603; lng = 28.9877; }
        else if (districtLower === 'beylikduzu') { lat = 40.9902; lng = 28.6401; }
        else if (districtLower === 'sefakoy') { lat = 41.0012; lng = 28.7915; }
        else if (districtLower === 'besiktas') { lat = 41.0422; lng = 29.0083; }
        else if (districtLower === 'kadikoy') { lat = 40.9819; lng = 29.0233; }
      }

      const camera = CAMERA_MODELS[Math.floor(Math.random() * CAMERA_MODELS.length)];
      const date = generateRandomRecentDate();

      const exifObj: any = {
        "0th": {
          [piexif.ImageIFD.Make]: camera.make,
          [piexif.ImageIFD.Model]: camera.model,
          [piexif.ImageIFD.DateTime]: date,
          [piexif.ImageIFD.Software]: "iOS 17.4.1",
          [piexif.ImageIFD.ImageDescription]: `${district} VIP Escort ve Elit Partner Hizmetleri - DRKCNAY ELITE 2026`
        },
        "Exif": {
          [piexif.ExifIFD.DateTimeOriginal]: date,
          [piexif.ExifIFD.DateTimeDigitized]: date,
          [piexif.ExifIFD.LensModel]: camera.lens,
          [piexif.ExifIFD.UserComment]: `DRKCNAY ELITE Verified Photo - Location: ${district}`
        },
        "GPS": {
          [piexif.GPSIFD.GPSLatitudeRef]: lat >= 0 ? "N" : "S",
          [piexif.GPSIFD.GPSLatitude]: degToExif(lat),
          [piexif.GPSIFD.GPSLongitudeRef]: lng >= 0 ? "E" : "W",
          [piexif.GPSIFD.GPSLongitude]: degToExif(lng),
          [piexif.GPSIFD.GPSVersionID]: [2, 2, 0, 0]
        }
      };

      const exifBytes = piexif.dump(exifObj);
      const newJpegData = piexif.insert(exifBytes, binaryData);
      return Buffer.from(newJpegData, 'binary');
    } catch (err) {
      console.error(`❌ EXIF Injection failed for ${district}:`, err);
      return imageBuffer;
    }
  }
}
