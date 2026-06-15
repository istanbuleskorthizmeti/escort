import { NextRequest, NextResponse } from 'next/server';
import { getCanonicalHost } from '@/lib/site-context';

export async function GET(request: NextRequest) {
  console.log("🤖 [ROBOTS ROUTE TRIGGERED] URL:", request.url, "Headers:", JSON.stringify(Object.fromEntries(request.headers.entries())));
  const rawHost = request.headers.get('host') || 'istanbulescort.blog';
  const host = getCanonicalHost(rawHost);
  
  const robots = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# 🤖 GLOBAL AI & LLM CRAWLERS
User-agent: Google-Extended
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: GPTBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: Applebot
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: FacebookBot
Allow: /
User-agent: Cohere-ai
Allow: /
User-agent: OMgilibot
Allow: /
User-agent: Diffbot
Allow: /
User-agent: YouBot
Allow: /

# 📡 GLOBAL SEARCH ENGINE BOT MATRIX
User-agent: Baiduspider
Allow: /
User-agent: Baiduspider-video
Allow: /
User-agent: Baiduspider-image
Allow: /
User-agent: Yeti
Allow: /
User-agent: NaverBot
Allow: /
User-agent: SeznamBot
Allow: /
User-agent: Sogou web spider
Allow: /
User-agent: Sogou instant spider
Allow: /
User-agent: 360Spider
Allow: /
User-agent: YandexBot
Allow: /
User-agent: Bingbot
Allow: /
User-agent: Googlebot
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
