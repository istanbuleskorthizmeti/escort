const sharp = require('sharp');
const fs = require('fs');
const piexif = require('piexifjs');

const inputPath = 'C:\\Users\\DRKCNAY\\.gemini\\antigravity\\brain\\813e1a54-5ec7-44f2-bc35-4f4c8f7c977a\\media__1777622470187.png';
const jpgPath = inputPath.replace('.png', '_edited.jpg');

const svgSign = '<svg width="280" height="60"><rect width="280" height="60" fill="white" rx="5" ry="5" stroke="#333" stroke-width="2"/><text x="140" y="38" font-family="sans-serif" font-weight="bold" font-size="24" fill="black" text-anchor="middle">ŞİŞLİ ESCORT</text></svg>';

sharp(inputPath)
    .composite([{ input: Buffer.from(svgSign), left: 160, top: 40 }])
    .jpeg({ quality: 90 })
    .toFile(jpgPath)
    .then(() => {
        const jpegData = fs.readFileSync(jpgPath).toString('binary');
        const zeroth = {};
        const exif = {};
        const gps = {};
        zeroth[piexif.ImageIFD.Make] = 'Apple';
        zeroth[piexif.ImageIFD.Model] = 'iPhone 14 Pro Max';
        zeroth[piexif.ImageIFD.Software] = '16.4.1';
        const dateStr = '2026:04:20 14:30:00';
        exif[piexif.ExifIFD.DateTimeOriginal] = dateStr;
        exif[piexif.ExifIFD.DateTimeDigitized] = dateStr;
        gps[piexif.GPSIFD.GPSLatitudeRef] = 'N';
        gps[piexif.GPSIFD.GPSLatitude] = [[41, 1], [3, 1], [1, 100]];
        gps[piexif.GPSIFD.GPSLongitudeRef] = 'E';
        gps[piexif.GPSIFD.GPSLongitude] = [[28, 1], [59, 1], [45, 100]];
        const exifObj = { '0th': zeroth, 'Exif': exif, 'GPS': gps };
        const exifbytes = piexif.dump(exifObj);
        const newJpeg = piexif.insert(exifbytes, jpegData);
        const outBuffer = Buffer.from(newJpeg, 'binary');
        const finalPath = jpgPath.replace('.jpg', '_exif.jpg');
        fs.writeFileSync(finalPath, outBuffer);
        console.log('Edited image with EXIF saved: ' + finalPath);
    })
    .catch(e => console.error(e));
