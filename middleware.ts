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

  // 🗺️ BYPASS MIDDLEWARE FOR SITEMAPS & ROBOTS.TXT (CRAWLER OPTIMIZATION)
  if (pathname.startsWith('/sitemap') || pathname === '/robots.txt' || pathname === '/feed.xml') {
    return NextResponse.next();
  }

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
  const spyBots = /ahrefs|semrush|mj12bot|rogerbot|dotbot|screaming|serpstat|backlink|linkdex|webmeup|megaindex|seokicks|bixocrawler|sistrix|ryte|petalbot|barkrowler|blexbot|ia_archiver|python|curl|wget|go-http-client|axios|node-fetch|java/i;
  if (spyBots.test(ua)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // 🛡️ ADVANCED INJECTION FILTER (SQLi, XSS, LFI, Command Injection)
  const queryStr = request.nextUrl.search || '';
  const decodedQuery = (() => {
    try {
      return decodeURIComponent(queryStr).toLowerCase();
    } catch {
      return queryStr.toLowerCase();
    }
  })();

  const decodedPath = (() => {
    try {
      return decodeURIComponent(pathname).toLowerCase();
    } catch {
      return pathname.toLowerCase();
    }
  })();

  const injectionPatterns = [
    /union\s+select/i,
    /group_concat/i,
    /concat\s*\(/i,
    /information_schema/i,
    /select\s+.*\s+from/i,
    /insert\s+into/i,
    /update\s+.*set/i,
    /delete\s+from/i,
    /<script>/i,
    /javascript:/i,
    /onclick/i,
    /onerror/i,
    /onload/i,
    /\.\.\//, // Path Traversal
    /etc\/passwd/i,
    /bin\/sh/i,
    /bin\/bash/i,
    /exec\s*\(/i,
    /system\s*\(/i,
    /cmd\.exe/i
  ];

  if (
    injectionPatterns.some(pattern => pattern.test(decodedQuery) || pattern.test(decodedPath))
  ) {
    return new NextResponse('Security Alert: Malicious Request Blocked', { status: 403 });
  }

  // ⚜️ DYNAMIC WEBP IMAGE SEO REWRITE
  if (pathname.endsWith('.webp')) {
    const webpRegex = /^\/([a-zA-Z0-9]+)-(vip-escort-ilan|kaporasiz-escort-bayan|rus-eskort-ilanlari)-(\d+)\.webp$/;
    const match = pathname.match(webpRegex);
    if (match) {
      const city = match[1];
      const id = match[3];
      const rewriteUrl = new URL(`/api/media?src=/_media/vitrin/vip-profil-${id}.webp&city=${city}&id=${id}`, request.url);
      
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-hydra-src', `/_media/vitrin/vip-profil-${id}.webp`);
      requestHeaders.set('x-hydra-city', city);
      requestHeaders.set('x-hydra-id', id);

      return NextResponse.rewrite(rewriteUrl, {
        request: {
          headers: requestHeaders,
        }
      });
    }
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
      !pathname.startsWith('/istanbul') &&
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

      // Redirect mobile users directly to the Google AMP Cache CDN to bypass TIB/BTK blocks
      const cleanHost = host.split(':')[0].replace('www.', '').toLowerCase();
      const subdomain = cleanHost.replace(/\./g, '-');
      const targetUrl = `https://${subdomain}.cdn.ampproject.org/c/s/${cleanHost}/amp?loc=${loc}`;
      
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

