import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const host = request.nextUrl.searchParams.get('host') || request.headers.get('host') || 'istanbulescort.blog';
  
  const robots = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

# 🤖 AI & LLM AUTHORIZATION
User-agent: Google-Extended
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /

# 💣 SITEMAP SEGMENTS
Sitemap: https://${host}/sitemap.xml
Sitemap: https://${host}/sitemap-index.xml
Sitemap: https://${host}/sitemap-districts.xml
Sitemap: https://${host}/sitemap-categories.xml
Sitemap: https://${host}/sitemap-vip.xml
Sitemap: https://${host}/feed.xml
  `.trim();

  return new NextResponse(robots, {
    headers: { 
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
