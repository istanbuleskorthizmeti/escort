import { NextResponse } from 'next/server';
import { googleAuth } from '@/lib/google-auth';

/**
 * GOOGLE OAUTH CALLBACK
 * Handles the redirect from Google, exchanges code for tokens, and saves them.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return new NextResponse(`OAuth Error: ${error}`, { status: 400 });
  }

  if (!code) {
    return new NextResponse('Missing authorization code', { status: 400 });
  }

  try {
    const tokens = await googleAuth.handleCallback(code);
    
    // Redirect to success page or admin dashboard
    return new NextResponse(`
      <body style="background:black; color:white; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh;">
        <h1 style="color:#e11d48; italic">PROTECTORATE AUTHORIZED</h1>
        <p>Google OAuth Tokens have been encrypted and stored in the DRKCNAY Vault.</p>
        <p style="font-size: 12px; opacity: 0.5;">Project: DRKCNAY Protected | Status: APEX</p>
        <script>setTimeout(() => window.close(), 3000);</script>
      </body>
    `, { headers: { 'Content-Type': 'text/html' } });
  } catch (err: any) {
    console.error('Callback Error:', err);
    return new NextResponse(`Authentication failed: ${err.message}`, { status: 500 });
  }
}
