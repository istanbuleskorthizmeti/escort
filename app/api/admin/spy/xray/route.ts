import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { SpamScorerService } from '@/lib/seo/spam-scorer';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  // Ensure the user is authenticated as Admin
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const { htmlContent, targetUrl } = body;

    if (!htmlContent || typeof htmlContent !== 'string') {
      return NextResponse.json({ success: false, error: "Geçersiz veya eksik HTML içeriği." }, { status: 400 });
    }

    // Run the analysis using Cheerio
    const analysisReport = SpamScorerService.analyzeHTML(htmlContent, targetUrl);

    return NextResponse.json({
      success: true,
      report: analysisReport
    });
  } catch (error) {
    console.error("[Spam Scorer API] Error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
