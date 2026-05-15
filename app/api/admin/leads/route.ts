import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/admin-auth';

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Get latest 100 leads for dashboard
    });

    return NextResponse.json(leads);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedLead);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
