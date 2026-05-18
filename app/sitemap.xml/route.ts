import { NextRequest } from 'next/server';
import { generateSitemapResponse } from '@/lib/seo/sitemap-generator';

export async function GET(request: NextRequest) {
  console.log("💣 [SITEMAP ROUTE TRIGGERED] URL:", request.url, "Headers:", JSON.stringify(Object.fromEntries(request.headers.entries())));
  const host = request.headers.get('host') || 'vipescorthizmeti.com';
  return generateSitemapResponse(host, 'sitemap.xml');
}
