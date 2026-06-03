import { NextRequest, NextResponse } from 'next/server';
import { getPageContent } from '@/lib/data-cache';
import { getSiteId } from '@/lib/site-context';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const host = searchParams.get('host') || request.headers.get('host') || 'esenyurtescorthizmeti.shop';
  const slug = searchParams.get('slug') || 'istanbul-merkez-kategori-rus-escort';

  const siteId = await getSiteId(host);
  const dbDistRaw = await getPageContent(slug, siteId);

  // Also query directly via prisma to compare
  const directPage = await prisma.pageContent.findFirst({
    where: { 
      slug, 
      OR: [{ siteId }, { siteId: null }]
    }
  });

  return NextResponse.json({
    host,
    slug,
    siteId,
    cacheResult: dbDistRaw,
    directResult: directPage
  });
}
