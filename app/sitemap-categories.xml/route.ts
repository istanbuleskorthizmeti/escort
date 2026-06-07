import { NextRequest } from 'next/server';
import { generateSitemapResponse } from '@/lib/seo/sitemap-generator';
import { getCanonicalHost } from '@/lib/site-context';

export async function GET(request: NextRequest) {
  console.log("💣 [SITEMAP CATEGORIES ROUTE TRIGGERED]");
  const rawHost = request.headers.get('host') || 'istanbulescort.blog';
  const host = getCanonicalHost(rawHost);
  return generateSitemapResponse(host, 'sitemap-categories.xml');
}
