import { NextResponse } from 'next/server';
import { prisma } from '../prisma';
import { getSiteId, getCanonicalHost } from '../site-context';
import { getDomainConfig } from '@/config/domains';

export async function generateSitemapResponse(host: string, file: string): Promise<NextResponse> {
  const canonicalHost = getCanonicalHost(host);
  const siteId = await getSiteId(canonicalHost);
  console.log(`[SITEMAP-GENERATOR] Generating ${file} for ${canonicalHost} (SiteId: ${siteId})`);

  try {
    // 🛡️ Fetch pages specifically for this SiteId
    let pages = await prisma.pageContent.findMany({
      where: { siteId, content: { not: null } },
      take: 5000, // Increased limit for massive Hydra indexing
      select: { slug: true, updatedAt: true }
    });

    const config = getDomainConfig(canonicalHost);

    // Dynamic Fallback: If no database pages exist yet for this domain/siteId, dynamically generate default local indexing path stubs
    if (!siteId || pages.length === 0) {
      const targetCity = config?.targetCity?.toLowerCase() || 'istanbul';
      const targetDistrict = config?.targetDistrict?.toLowerCase();
      
      const defaultDistricts = targetDistrict 
        ? [targetDistrict] 
        : ['besiktas', 'sisli', 'beylikduzu', 'kadikoy', 'bakirkoy', 'atasehir', 'esenyurt', 'fatih', 'bagcilar', 'bahcelievler'];
      
      pages = defaultDistricts.map(dist => ({
        slug: `${targetCity}-${dist}`,
        updatedAt: new Date()
      }));
    }

    let filteredPages = pages.filter((p: any) => p.slug !== 'home' && p.slug !== 'index');

    if (config && config.role === 'SATELLITE') {
      const targetCity = config.targetCity?.toLowerCase();
      const targetDistrict = config.targetDistrict?.toLowerCase();

      filteredPages = pages.filter((p: any) => {
        const slug = p.slug.toLowerCase();

        // Always include target city slug
        if (targetCity && slug === targetCity) {
          return true;
        }

        // If target district is configured, only include matching slugs
        if (targetDistrict) {
          return slug.includes(targetDistrict);
        }

        // If it is a city-wide satellite (no target district), only include slugs of this city
        if (targetCity) {
          return slug.startsWith(targetCity) || slug.includes(targetCity);
        }

        return false;
      });
    }

    const urlEntries = filteredPages.map((p: any) => {
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
    <loc>https://${canonicalHost}${slugPrefix}${finalSlug}</loc>
    <lastmod>${p.updatedAt.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('');

    // Add Core Routes & dynamic SEO-boosted tags
    const isCloaker = config?.role === 'CLOAKER';
    const dynamicRoutes = isCloaker
      ? ['', '/terms', '/privacy', '/contact']
      : ['', '/rehber', '/faq', '/terms', '/privacy', '/contact'];

    const coreUrls = dynamicRoutes.map(route => `
  <url>
    <loc>https://${canonicalHost}${route}</loc>
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

