import { NextRequest } from 'next/server';
import { generateSitemapResponse } from '@/lib/seo/sitemap-generator';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const host = request.headers.get('host') || 'vipescorthizmeti.com';
  const { id } = await params;
  return generateSitemapResponse(host, `sitemap-${id}.xml`);
}
