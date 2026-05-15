import { NextResponse } from 'next/server';
import { googleAuth } from '../../../../../../lib/google-auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    console.log("🔐 [OAUTH] Received authorization code. Exchanging for tokens...");
    const tokens = await googleAuth.handleCallback(code);

    return NextResponse.json({
      success: true,
      message: 'Google OAuth authentication successful! The tokens have been securely saved to the database. The Blogger Autopilot can now run on behalf of your Google Account.',
      hasRefreshToken: !!tokens.refresh_token
    });

  } catch (error: any) {
    console.error('❌ [OAUTH] Callback error:', error);
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}
