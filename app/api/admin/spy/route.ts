import { NextResponse } from 'next/server';
import { SpyService } from '@/lib/seo/spy';
import { requireAdminSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const report = await SpyService.generateMatrix();
    
    return NextResponse.json({
      success: true,
      report
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const { action } = await req.json();
    
    if (action === 'refresh') {
      const report = await SpyService.generateMatrix();
      return NextResponse.json({ success: true, report });
    }

    return NextResponse.json({ success: false, error: "Geçersiz işlem" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}
