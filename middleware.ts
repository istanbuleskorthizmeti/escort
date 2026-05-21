import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REDIRECT_MAP: Record<string, string> = {
  'besiktas': 'besiktas-escort',
  'sisli': 'sisli-escort',
  'beylikduzu': 'beylikduzu-escort',
  'sefakoy': 'sefakoy-escort',
  'bakirkoy': 'bakirkoy-escort',
  'kadikoy': 'kadikoy-escort',
  'atasehir': 'atasehir-escort',
  'esenyurt': 'esenyurt-escort',
  'fatih': 'fatih-escort',
  'bagcilar': 'bagcilar-escort',
  'bahcelievler': 'bahcelievler-escort',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle dynamic robots.txt rewrites
  if (pathname === '/robots.txt') {
    const host = request.headers.get('host') || 'vipescorthizmeti.com';
    return NextResponse.rewrite(new URL(`/api/seo?host=${host}&file=robots.txt`, request.url));
  }

  // 2. Handle dynamic sitemaps (/sitemap.xml, /sitemap-index.xml, /sitemap-districts.xml, etc.)
  if (pathname.startsWith('/sitemap') && pathname.endsWith('.xml')) {
    const host = request.headers.get('host') || 'vipescorthizmeti.com';
    const file = pathname.substring(1); // e.g. "sitemap-index.xml"
    return NextResponse.rewrite(new URL(`/api/seo?host=${host}&file=${file}`, request.url));
  }

  // 3. Handle legacy /ilan/istanbul-escort/[district] pattern
  if (pathname.startsWith('/ilan/istanbul-escort/')) {
    const district = pathname.split('/').pop()?.toLowerCase();
    if (district && REDIRECT_MAP[district]) {
      const target = REDIRECT_MAP[district];
      // Avoid redirecting to the same path
      if (pathname !== `/${target}`) {
        return NextResponse.redirect(new URL(`/${target}`, request.url), 301);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/robots.txt',
    '/sitemap.xml',
    '/sitemap-index.xml',
    '/sitemap-districts.xml',
    '/sitemap-categories.xml',
    '/sitemap-vip.xml',
    '/ilan/:path*',
    '/besiktas', '/sisli', '/beylikduzu', '/sefakoy', '/bakirkoy', 
    '/kadikoy', '/atasehir', '/esenyurt', '/fatih', '/bagcilar', '/bahcelievler'
  ],
};
