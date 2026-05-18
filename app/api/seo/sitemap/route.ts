import { NextRequest } from 'next/server';
import { generateSitemapResponse } from '@/lib/seo/sitemap-generator';

export async function GET(request: NextRequest) {
  const host = request.nextUrl.searchParams.get('host') || request.headers.get('host') || 'vipescorthizmeti.com';
  return generateSitemapResponse(host, 'sitemap.xml');
}
