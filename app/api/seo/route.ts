import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSiteId } from '@/lib/site-context';

/* 🏴‍☠️ HYDRA PARASITE HUBS (High-Authority Satellites) */
const PARASITE_HUBS = [
  'https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa'
];

/**
 * 💣 HYDRA SEO ENGINE - SITEMAP BOMBING MODULE
 * Segmented sitemaps for the entire network with SiteId isolation.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const host = searchParams.get('host') || request.headers.get('host') || '';
  const file = searchParams.get('file') || 'robots.txt';
  const siteId = await getSiteId(host);

  console.log(`[SEO-ENGINE] Serving ${file} for ${host} (SiteId: ${siteId})`);

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
Sitemap: https://${host}/sitemap-index.xml
Sitemap: https://${host}/sitemap-districts.xml
Sitemap: https://${host}/sitemap-categories.xml
Sitemap: https://${host}/sitemap-vip.xml
Sitemap: https://${host}/feed.xml
    `.trim();

    return new NextResponse(robots, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  // 2. DYNAMIC SITEMAP GENERATION (Per Domain)
  if (file === 'sitemap.xml' || file.startsWith('sitemap-')) {
    try {
      // 🛡️ Fetch pages specifically for this SiteId
      const pages = await prisma.pageContent.findMany({
        where: { siteId, content: { not: null } },
        take: 5000, // Increased limit for massive Hydra indexing
        select: { slug: true, updatedAt: true }
      });

      const urlEntries = pages.map((p: any) => {
          let finalSlug = p.slug;
          
          // 🔱 HYDRA SMART MAPPING: Convert 'city-district' slugs back to '/city/district' paths
          // This ensures Sitemap URL matches the Canonical URL exactly.
          if (finalSlug.includes('-')) {
             const parts = finalSlug.split('-');
             // If first part is a known city, we format it as /city/district
             const potentialCity = parts[0].toLowerCase();
             const knownCities = ['istanbul', 'ankara', 'izmir', 'antalya', 'bursa', 'adana', 'eskisehir', 'kocaeli', 'mugla'];
             if (knownCities.includes(potentialCity)) {
                finalSlug = `${potentialCity}/${parts.slice(1).join('-')}`;
             }
          }

          const slugPrefix = finalSlug.startsWith('/') ? '' : '/';
          return `
  <url>
    <loc>https://${host}${slugPrefix}${finalSlug}</loc>
    <lastmod>${p.updatedAt.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
      }).join('');

      // Add Core Routes
      const coreUrls = ['', '/rehber', '/faq'].map(route => `
  <url>
    <loc>https://${host}${route}</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>`).join('');

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${coreUrls}
  ${urlEntries}
</urlset>`.trim();

      return new NextResponse(sitemap, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' }
      });
    } catch (error) {
      console.error('[SEO-ENGINE] Sitemap Error:', error);
      return new NextResponse('Error generating sitemap', { status: 500 });
    }
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

