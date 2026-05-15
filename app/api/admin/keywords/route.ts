import { NextResponse } from 'next/server';
import { GSCService } from '@/lib/seo/gsc';
import { requireAdminSession } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '28');
    
    // Calculate date range
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 3); // GSC has ~3 days latency
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const isoStart = startDate.toISOString().split('T')[0];
    const isoEnd = endDate.toISOString().split('T')[0];

    const gsc = GSCService.getInstance();
    
    const [keywords, pages] = await Promise.all([
      gsc.getKeywordPerformance(isoStart, isoEnd),
      gsc.getPagePerformance(isoStart, isoEnd)
    ]);

    return NextResponse.json({
      success: true,
      range: { start: isoStart, end: isoEnd },
      keywords: keywords.map((k: any) => ({
        query: k.keys[0],
        clicks: k.clicks,
        impressions: k.impressions,
        ctr: k.ctr,
        position: k.position
      })),
      pages: pages.map((p: any) => ({
        url: p.keys[0],
        clicks: p.clicks,
        impressions: p.impressions,
        position: p.position
      }))
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}
