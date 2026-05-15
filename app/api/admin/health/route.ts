import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/admin-auth';

/**
 * 🏥 DRKCNAY WAR ROOM: HEALTH MONITOR API
 * Provides real-time telemetry of the SEO matrix, hydration depth, and content distribution.
 */
export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    // 1. Calculate SEO Matrix Depth
    const totalPages = await prisma.pageContent.count();
    const hydratedPages = await prisma.pageContent.count({
      where: { AND: [{ content: { not: null } }, { content: { not: "" } }] }
    });
    const hydrationPercentage = totalPages > 0 ? (hydratedPages / totalPages) * 100 : 0;

    // 2. Off-site Distribution Status
    const wpCount = await prisma.pageContent.count({ where: { isWordPressPosted: true } });
    
    // 3. Recent Activity Tracker
    const recentActivity = await prisma.pageContent.findMany({
      where: { content: { not: null } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { slug: true, updatedAt: true, title: true }
    });

    return NextResponse.json({
      status: "DRKCNAY_OPERATIONAL",
      telemetry: {
        seo_matrix: {
          total: totalPages,
          hydrated: hydratedPages,
          pending: totalPages - hydratedPages,
          completion_rate: `${ (Number(hydrationPercentage) || 0).toFixed(2) }%`
        },
        distribution: {
          wordpress: wpCount,
          blogger: "ACTIVE_AUTOPILOT",
          tumblr: "ACTIVE_AUTOPILOT"
        },
        worker_health: {
          last_update: recentActivity[0]?.updatedAt || new Date(),
          recent_slugs: recentActivity.map(a => a.slug)
        }
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
