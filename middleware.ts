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
  const host = request.headers.get('host') || '';

  // 🛡️ SECURITY: Block exploit probes, scanners, and legacy PHP pathways
  if (
    pathname.endsWith('.php') ||
    pathname.includes('.php/') ||
    pathname.includes('vendor/') ||
    pathname.includes('phpunit') ||
    pathname.includes('wp-') ||
    pathname.includes('xmlrpc') ||
    pathname.includes('.env') ||
    pathname.includes('composer.json') ||
    pathname.includes('.git/')
  ) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // 🛡️ HYDRA EDGE SECURITY: Block Scanners & Exploits
  const maliciousUAs = /sqlmap|nikto|nmap|netsparker|dirbuster|gobuster|w3af|openvas|nessus|censys|zgrab|acunetix/i;
  if (maliciousUAs.test(ua)) {
    return new NextResponse('Security Alert: Access Denied', { status: 403 });
  }

  // 🛡️ BLOCK COMPETITOR SEO TOOLS & SPY SPIDERS (PBN Obfuscation)
  const spyBots = /ahrefs|semrush|mj12bot|rogerbot|dotbot|screaming|serpstat|backlink|linkdex|webmeup|megaindex|seokicks|bixocrawler|sistrix|ryte/i;
  if (spyBots.test(ua)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const queryStr = request.nextUrl.search || '';
  if (
    queryStr.includes('union select') ||
    queryStr.includes('group_concat') ||
    queryStr.includes('<script>') ||
    queryStr.includes('javascript:') ||
    queryStr.includes('../') ||
    queryStr.includes('etc/passwd')
  ) {
    return new NextResponse('Security Alert: Malicious Request Blocked', { status: 403 });
  }

  // 301 Permanent Redirect from legacy domain and other domains to the new target blog
  if (host.includes('istanbulescdrkcn.com')) {
    const targetUrl = new URL(pathname + request.nextUrl.search, 'https://istanbulescort.blog');
    return NextResponse.redirect(targetUrl, 301);
  }

  // ⚜️ ADVANCED CLOAKED MOBILE-TO-AMP REDIRECT (ONLY FOR MOBILE USERS)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isBot = /bot|crawler|spider|robot|lighthouse|google|yandex|bing|baidu/i.test(ua);

  if (isMobile && !isBot) {
    if (
      !pathname.startsWith('/api') &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/_media') &&
      !pathname.startsWith('/amp') &&
      !pathname.startsWith('/.well-known') &&
      pathname !== '/apple-app-site-association' &&
      pathname !== '/manifest.json' &&
      pathname !== '/robots.txt' &&
      pathname !== '/sitemap.xml' &&
      pathname !== '/favicon.ico' &&
      pathname !== '/icon.png'
    ) {
      const parts = pathname.split('/').filter(Boolean);
      let loc = '';

      if (parts.length > 0) {
        // Extract location slug (e.g. 'besiktas-escort' -> 'besiktas', 'istanbul' -> 'istanbul')
        const lastPart = parts[parts.length - 1].toLowerCase();
        loc = lastPart.replace(/-escort$/i, '').replace(/-eskort$/i, '');
      }

      if (!loc) {
        loc = 'istanbul';
      }

      // Redirect mobile users directly to the clean canonical path on the target site instead of the CDN cache
      const cleanHost = host.split(':')[0].replace('www.', '').toLowerCase();
      const targetUrl = `https://${cleanHost}/istanbul/${loc}`;
      
      // Use 307 Temporary Redirect to prevent search bots from caching the redirect target
      return NextResponse.redirect(targetUrl, 307);
    }
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
    '/((?!api(?:/|$)|_next/static|_next/image|favicon.ico|_media|icon.png|apple-icon.png).*)',
  ],
};

