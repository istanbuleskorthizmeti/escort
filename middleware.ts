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

  // 1. Handle legacy /ilan/istanbul-escort/[district] pattern
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
    '/ilan/:path*',
    '/besiktas', '/sisli', '/beylikduzu', '/sefakoy', '/bakirkoy', 
    '/kadikoy', '/atasehir', '/esenyurt', '/fatih', '/bagcilar', '/bahcelievler'
  ],
};
