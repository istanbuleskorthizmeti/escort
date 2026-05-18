import { NextResponse } from 'next/server';
import { prisma } from '../prisma';
import { getSiteId } from '../site-context';

export async function generateSitemapResponse(host: string, file: string): Promise<NextResponse> {
  const siteId = await getSiteId(host);
  console.log(`[SITEMAP-GENERATOR] Generating ${file} for ${host} (SiteId: ${siteId})`);

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
      headers: { 
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('[SITEMAP-GENERATOR] Sitemap Error:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
