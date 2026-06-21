import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import NodeCache from 'node-cache';

// Rate limiting cache: 60 seconds TTL
const ipLimitCache = new NodeCache({ stdTTL: 60, checkperiod: 10 });
const MAX_REQUESTS_PER_MINUTE = 60;

/**
 * 🕵️‍♂️ HYDRA IMAGE OBFUSCATION ENGINE (MD5 & EXIF Bypass)
 * Modifies the MD5 checksum of images dynamically per domain host.
 * Trailing bytes are appended so that image rendering engines ignore them,
 * but search engine crawlers detect a completely unique file hash.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // IP Rate Limiting Check
  const reqAny = request as any;
  const ip = reqAny.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
  const requestCount = (ipLimitCache.get(ip) as number) || 0;

  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  ipLimitCache.set(ip, requestCount + 1);

  // Try getting parameters via standard request.url fallback first if searchParams is empty
  let src = request.nextUrl.searchParams.get('src') || request.headers.get('x-hydra-src');
  if (!src && request.url) {
    try {
      const parsedUrl = new URL(request.url);
      src = parsedUrl.searchParams.get('src');
    } catch (e) { }
  }

  const host = request.headers.get('host') || '';

  if (!src) {
    return new NextResponse('Missing src', { status: 400 });
  }

  // Double-guard directory traversal checks
  if (src.includes('..') || src.includes('\0')) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  // Prevent directory traversal attacks using strict path resolution boundary check
  const publicDir = path.join(process.cwd(), 'public');
  const filePath = path.resolve(publicDir, src.replace(/^[/\\]+/, ''));

  if (!filePath.startsWith(publicDir)) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File Not Found', { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);

    // Compute host-specific deterministic checksum modifier
    const hostHash = host.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Append a hidden comment string to shift the file hash uniquely per domain
    const obfuscationPadding = Buffer.from(`\n/* ${host}-${hostHash} */`);
    const obfuscatedBuffer = Buffer.concat([fileBuffer, obfuscationPadding]);

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'image/webp';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.gif') contentType = 'image/gif';

    return new NextResponse(obfuscatedBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Hydra-Obfuscated': 'true'
      },
    });
  } catch (error) {
    console.error('❌ [HYDRA-MEDIA] Failed serving dynamic obfuscated image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

