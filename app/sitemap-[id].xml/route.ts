import { NextRequest } from 'next/server';
import { generateSitemapResponse } from '@/lib/seo/sitemap-generator';
import { getCanonicalHost } from '@/lib/site-context';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const rawHost = request.headers.get('host') || 'istanbulescdrkcn.com';
  const host = getCanonicalHost(rawHost);
  const { id } = await params;
  return generateSitemapResponse(host, `sitemap-${id}.xml`);
}
