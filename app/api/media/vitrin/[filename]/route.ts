import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // 1. Sanitize filename to prevent directory traversal
  const safeFilename = path.basename(filename);
  if (safeFilename !== filename) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', '_media', 'vitrin', safeFilename);

  // 2. Check if file exists
  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const ext = path.extname(safeFilename).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
  };

  const mimeType = mimeTypes[ext] || 'application/octet-stream';

  try {
    const isImage = ['.webp', '.png', '.jpg', '.jpeg'].includes(ext);

    if (isImage) {
      const host = request.headers.get('host') || 'istanbulescort.blog';
      const safeHost = host.replace(/[^a-zA-Z0-9.-]/g, '_');
      const cacheDir = path.join(process.cwd(), 'public', '_media', 'vitrin_cache');
      const cacheFilePath = path.join(cacheDir, `${safeHost}_${safeFilename}`);

      // 1. Try serving from cache first
      try {
        const cacheExists = await fs.promises.access(cacheFilePath).then(() => true).catch(() => false);
        if (cacheExists) {
          const cachedBuffer = await fs.promises.readFile(cacheFilePath);
          return new NextResponse(cachedBuffer, {
            status: 200,
            headers: {
              'Content-Type': mimeType,
              'Cache-Control': 'public, max-age=31536000, immutable',
              'Vary': 'Host',
            },
          });
        }
      } catch (cacheErr) {
        console.error(`[Morph Cache Read Error]`, cacheErr);
      }

      // 2. Cache miss: Load and morph image using sharp based on requesting host header
      // Generate a deterministic numerical seed from the host string
      let seed = 0;
      for (let i = 0; i < host.length; i++) {
        seed = (seed * 31 + host.charCodeAt(i)) & 0xffffffff;
      }
      const absSeed = Math.abs(seed);

      const image = sharp(filePath);
      const metadata = await image.metadata();

      const width = metadata.width || 0;
      const height = metadata.height || 0;

      // Apply deterministic micro-crop
      if (width > 10 && height > 10) {
        const cropX = absSeed % 2; // crop 0 or 1 pixel
        const cropY = (absSeed >> 1) % 2; // crop 0 or 1 pixel
        if (cropX > 0 || cropY > 0) {
          image.extract({ left: 0, top: 0, width: width - cropX, height: height - cropY });
        }
      }

      // Apply deterministic subtle brightness and contrast/saturation adjustments via modulation
      const brightnessVal = 1 + (((absSeed % 3) - 1) * 0.005); // 0.995, 1, or 1.005
      const saturationVal = 1 + ((((absSeed >> 2) % 3) - 1) * 0.005); // 0.995, 1, or 1.005
      
      image.modulate({ brightness: brightnessVal, saturation: saturationVal });

      // Apply deterministic quality setting
      const qualityVal = 78 + (absSeed % 5); // 78 to 82

      if (ext === '.webp') {
        image.webp({ quality: qualityVal });
      } else if (ext === '.png') {
        image.png({ quality: qualityVal });
      } else if (ext === '.jpg' || ext === '.jpeg') {
        image.jpeg({ quality: qualityVal });
      }

      // Get processed buffer
      const buffer = await image.toBuffer();

      // Save to cache directory asynchronously to speed up future requests
      try {
        await fs.promises.mkdir(cacheDir, { recursive: true });
        await fs.promises.writeFile(cacheFilePath, buffer);
      } catch (writeErr) {
        console.error(`[Morph Cache Write Error]`, writeErr);
      }

      return new NextResponse(buffer as any, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Vary': 'Host',
        },
      });
    } else {
      // Serve non-image files directly (with maximum cache lifetime)
      const fileBuffer = await fs.promises.readFile(filePath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (error: any) {
    console.warn(`⚠️ [Morph Engine Fallback] Failed processing ${safeFilename}:`, error.message);
    try {
      const rawBuffer = fs.readFileSync(filePath);
      return new NextResponse(rawBuffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch (fallbackError: any) {
      console.error('❌ [Morph Engine Fallback Critical] Failed serving raw fallback image:', fallbackError.message);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }
}

