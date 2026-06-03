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
  const ua = request.headers.get('user-agent') || '';

  // ⚜️ ADVANCED CLOAKED MOBILE-TO-AMP REDIRECT
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isBot = /googlebot|yandex|bingbot|baiduspider|crawler|spider|robot/i.test(ua);

  if (isMobile && !isBot) {
    if (
      !pathname.startsWith('/api') &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/_media') &&
      !pathname.startsWith('/amp') &&
      pathname !== '/robots.txt' &&
      pathname !== '/sitemap.xml' &&
      pathname !== '/favicon.ico'
    ) {
      const parts = pathname.split('/').filter(Boolean);
      let loc = '';

      if (parts.length > 0) {
        loc = parts[parts.length - 1];
      }

      const ampUrl = new URL('/amp', request.url);
      if (loc) {
        ampUrl.searchParams.set('loc', loc);
      }
      
      return NextResponse.redirect(ampUrl, 307);
    }
  }

  // 1. Handle dynamic robots.txt rewrites
  if (pathname === '/robots.txt') {
    const host = request.headers.get('host') || 'vipescorthizmeti.com';
    return NextResponse.rewrite(new URL(`/api/seo?host=${host}&file=robots.txt`, request.url));
  }

  // 2. Handle dynamic sitemaps (Only /sitemap.xml for performance)
  if (pathname === '/sitemap.xml') {
    const host = request.headers.get('host') || 'vipescorthizmeti.com';
    return NextResponse.rewrite(new URL(`/api/seo?host=${host}&file=sitemap.xml`, request.url));
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
    '/ilan/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|_media|icon.png|apple-icon.png).*)',
  ],
};

