import { NextResponse } from 'next/server';
import { googleAuth } from '@/lib/google-auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key !== 'GODMODE2026') {
    return new NextResponse('Unauthorized: Invalid HQ Key', { status: 401 });
  }

  try {
    const url = googleAuth.getAuthUrl();
    return NextResponse.redirect(url);
  } catch (error: any) {
    return new NextResponse(`Internal Error during OAuth Init: ${error.message}`, { status: 500 });
  }
}
