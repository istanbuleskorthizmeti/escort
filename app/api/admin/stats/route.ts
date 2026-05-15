import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/admin-auth';


export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const totalLeads = await prisma.lead.count();
    const completedLeads = await prisma.lead.count({ where: { status: 'COMPLETED' } });
    const activeAdsCount = await prisma.adProfile.count({ where: { isActive: true } });
    
    const leads = await prisma.lead.findMany({
      where: { status: 'COMPLETED' },
      select: { paymentAmount: true }
    });
    const totalRevenue = leads.reduce((acc: any, lead: any) => acc + (lead.paymentAmount || 0), 0);

    // District breakdown logic
    const cityGroups = await prisma.lead.groupBy({
      by: ['cityName'],
      _count: { _all: true },
      _sum: { paymentAmount: true }
    });

    const regions = cityGroups.map((group: any) => ({
      name: group.cityName,
      count: group._count._all,
      revenue: group._sum.paymentAmount || 0
    })).sort((a: any, b: any) => b.revenue - a.revenue);

    const recentLogs = await prisma.leadLog.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: { lead: true }
    });

    return NextResponse.json({
      stats: {
        totalLeads,
        completed: completedLeads,
        revenue: totalRevenue,
        efficiency: totalLeads > 0 ? (Number((completedLeads / totalLeads) * 100) || 0).toFixed(1) : 0,
        activeAds: activeAdsCount
      },
      regions,
      recentActions: recentLogs.map((log: any) => ({
        id: log.id,
        time: formatRelativeTime(log.timestamp),
        action: log.action,
        admin: log.adminId || 'System',
        region: log.lead.districtName,
        amount: log.action === 'PAYMENT_RECEIVED' ? log.lead.paymentAmount : undefined
      }))
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

function formatRelativeTime(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Az önce';
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat önce`;
  return new Date(date).toLocaleDateString('tr-TR');
}
