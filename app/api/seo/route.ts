import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSiteId, getCanonicalHost } from '@/lib/site-context';
import { generateSitemapResponse } from '@/lib/seo/sitemap-generator';

/* 🏴‍☠️ HYDRA PARASITE HUBS (High-Authority Satellites) */
const PARASITE_HUBS = [
  'https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa'
];

/**
 * 💣 HYDRA SEO ENGINE - SITEMAP BOMBING MODULE
 * Segmented sitemaps for the entire network with SiteId isolation.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawHost = searchParams.get('host') || request.headers.get('host') || 'istanbulescdrkcn.com';
  const host = getCanonicalHost(rawHost);
  
  // 🔱 God Mode: Extract file with multi-layered routing fallbacks
  const invokePath = (request.headers.get('x-invoke-path') || '').toLowerCase();
  let file = searchParams.get('file') || '';
  
  if (!file) {
    const urlString = request.url.toLowerCase();
    
    if (urlString.includes('sitemap') || invokePath.includes('sitemap')) {
      const match = request.url.match(/sitemap[a-zA-Z0-9-]*\.xml/i);
      file = match ? match[0].toLowerCase() : 'sitemap.xml';
    } else if (urlString.includes('robots.txt') || invokePath.includes('robots.txt')) {
      file = 'robots.txt';
    } else {
      file = 'robots.txt'; // Ultimate fallback
    }
  }

  const siteId = await getSiteId(host);

  console.log(`[SEO-ENGINE] Serving ${file} for ${host} (SiteId: ${siteId}, InvokePath: ${invokePath})`);


  // 1. DYNAMIC ROBOTS.TXT GENERATION
  if (file === 'robots.txt') {
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
Sitemap: https://${host}/feed.xml
    `.trim();

    return new NextResponse(robots, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  // 2. DYNAMIC SITEMAP GENERATION (Per Domain)
  if (file === 'sitemap.xml') {
    return generateSitemapResponse(host, file);
  }

  // 4. SMART TAG REDIRECT (Fix for /api/seo?tag=...)
  const tag = searchParams.get('tag');
  if (tag) {
    console.log(`[SEO-ENGINE] Handling Tag: ${tag} for ${host}`);
    
    // Normalize tag for Turkish characters to prevent 404s on target pages
    // Logic: Convert to lowercase, handle İ/I, and replace hyphens with spaces for internal search if needed
    const normalizedTag = tag
      .replace(/i̇/g, 'i') // Handle combining dot
      .replace(/I/g, 'ı')
      .replace(/İ/g, 'i')
      .toLowerCase();

    // Determine target route based on tag content
    let targetRoute = '/istanbul'; // Default city
    
    if (normalizedTag.includes('ankara')) targetRoute = '/ankara';
    if (normalizedTag.includes('izmir')) targetRoute = '/izmir';
    if (normalizedTag.includes('antalya')) targetRoute = '/antalya';
    if (normalizedTag.includes('bursa')) targetRoute = '/bursa';

    // Redirect to the city page with the tag as a query parameter
    // This keeps the link juice while preventing 404s
    const redirectUrl = new URL(targetRoute, `https://${host}`);
    redirectUrl.searchParams.set('q', tag.replace(/-/g, ' '));
    
    return NextResponse.redirect(redirectUrl.toString(), 301);
  }

  return new NextResponse('File not found', { status: 404 });
}

