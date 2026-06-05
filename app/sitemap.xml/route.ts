import { NextRequest } from 'next/server';
import { generateSitemapResponse } from '@/lib/seo/sitemap-generator';
import { getCanonicalHost } from '@/lib/site-context';

export async function GET(request: NextRequest) {
  console.log("💣 [SITEMAP ROUTE TRIGGERED] URL:", request.url, "Headers:", JSON.stringify(Object.fromEntries(request.headers.entries())));
  const rawHost = request.headers.get('host') || 'istanbulescdrkcn.com';
  const host = getCanonicalHost(rawHost);
  return generateSitemapResponse(host, 'sitemap.xml');
}
