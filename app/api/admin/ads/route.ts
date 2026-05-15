import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/admin-auth';


export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const ads = await prisma.adProfile.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(ads);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const ad = await prisma.adProfile.create({
      data: {
        name: body.name,
        age: parseInt(body.age),
        phone: body.phone,
        image: body.image,
        tier: body.tier || 'VIP',
        citySlugs: body.citySlugs || [],
        districtSlugs: body.districtSlugs || [],
        features: body.features || [],
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
      }
    });
    return NextResponse.json(ad);
  } catch (error) {
    console.error("Ad Creation Error:", error);
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const { id } = await req.json();
    await prisma.adProfile.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 });
  }
}
