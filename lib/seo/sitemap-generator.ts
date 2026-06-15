import { NextResponse } from 'next/server';
import { prisma } from '../prisma';
import { getSiteId, getCanonicalHost } from '../site-context';
import { getDomainConfig } from '@/config/domains';
import { cities } from '../locations';

/**
 * 🗺️ DRKCNAY ELITE HYDRA SITEMAP GENERATOR (v4.0 - Consolidated Default)
 * Generates structured, crawlable sitemap segments to prevent
 * GSC duplicate index sitemap warnings.
 */
export async function generateSitemapResponse(host: string, file: string): Promise<NextResponse> {
  const canonicalHost = getCanonicalHost(host);
  const siteId = await getSiteId(canonicalHost);
  const config = getDomainConfig(canonicalHost);
  const isCloaker = config?.role === 'CLOAKER';
  const timestamp = new Date().toISOString();

  console.log(`[SITEMAP-GENERATOR] Generating ${file} for ${canonicalHost} (SiteId: ${siteId})`);

  try {
    // 1. Sitemap Index File
    if (file === 'sitemap-index.xml') {
      const sitemaps = [
        'sitemap.xml',
        'sitemap-districts.xml',
        'sitemap-categories.xml',
        'sitemap-vip.xml'
      ];

      const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(s => `
  <sitemap>
    <loc>https://${canonicalHost}/${s}</loc>
    <lastmod>${timestamp}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`.trim();

      return new NextResponse(sitemapIndexXml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600'
        }
      });
    }

    // 2. Fetch pages from the DB for this site context
    const dbPages = await prisma.pageContent.findMany({
      where: { siteId, content: { not: null } },
      take: 50000,
      select: { slug: true, updatedAt: true }
    });

    const targetCity = config?.targetCity?.toLowerCase() || 'istanbul';
    const targetDistrict = config?.targetDistrict?.toLowerCase();
    
    // Dynamic Fallback: generate default target districts
    const istanbulDistricts = [
      'besiktas', 'sisli', 'beylikduzu', 'kadikoy', 'bakirkoy', 
      'atasehir', 'esenyurt', 'fatih', 'bagcilar', 'bahcelievler',
      'umraniye', 'pendik', 'maltepe', 'kartal', 'sariyer', 
      'uskudar', 'avcilar', 'kagitthane', 'sancaktepe', 'basaksehir',
      'esenler', 'eyupsultan', 'beykoz', 'beyoglu', 'cekmekoy', 
      'tuzla', 'arnavutkoy', 'gaziosmanpasa', 'sultanbeyli', 'güngören',
      'zeytinburnu', 'sile', 'catalca', 'silivri', 'buyukcekmece',
      'kucukcekmece', 'adalar', 'bayrampasa', 'sultangazi'
    ];

    const defaultDistricts = targetDistrict 
      ? [targetDistrict] 
      : istanbulDistricts;

    const pageMap = new Map<string, { slug: string; updatedAt: Date }>();

    // Seed with default districts to ensure baseline coverage
    defaultDistricts.forEach(dist => {
      const slug = `${targetCity}-${dist}`;
      pageMap.set(slug, { slug, updatedAt: new Date() });
    });

    // Merge in database pages (including custom categories or neighborhoods)
    dbPages.forEach((p: { slug: string; updatedAt: Date }) => {
      pageMap.set(p.slug.toLowerCase(), p);
    });

    const pages = Array.from(pageMap.values());

    // Filter pages for satellite rules
    let filteredPages = pages.filter((p: { slug: string; updatedAt: Date }) => p.slug !== 'home' && p.slug !== 'index');

    if (config && config.role === 'SATELLITE') {
      const targetCityName = config.targetCity?.toLowerCase();
      const targetDistrictName = config.targetDistrict?.toLowerCase();

      filteredPages = pages.filter((p: { slug: string; updatedAt: Date }) => {
        const slug = p.slug.toLowerCase()
          .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ı/g, 'i').replace(/İ/g, 'i')
          .replace(/ğ/g, 'g').replace(/ö/g, 'o').replace(/ü/g, 'u');
        const targetDistNormalized = targetDistrictName
          ?.replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ı/g, 'i').replace(/İ/g, 'i')
          .replace(/ğ/g, 'g').replace(/ö/g, 'o').replace(/ü/g, 'u');

        if (targetCityName && slug === targetCityName) return true;
        if (targetDistNormalized && slug.includes(targetDistNormalized)) return true;
        if (targetCityName) return slug.startsWith(targetCityName) || slug.includes(targetCityName);
        return false;
      });
    }


    // Normalizing and formatting function to clean combined dot characters and trailing dashes
    const formatUrlNode = (slug: string, updatedAt: Date, priority = 0.8) => {
      let finalSlug = slug.toLowerCase().trim();
      
      if (!finalSlug.includes('/') && finalSlug.includes('-')) {
        const parts = finalSlug.split('-');
        const firstPart = parts[0];
        
        if (cities[firstPart]) {
          const cityObj = cities[firstPart];
          if (parts.length > 1) {
            const districtCandidate = parts[1];
            const matchingDistrict = cityObj.districts.find(d => d.slug === districtCandidate);
            
            if (matchingDistrict) {
              if (parts.length > 2) {
                // E.g., 'istanbul-esenyurt-cumhuriyet' -> 'istanbul/esenyurt/cumhuriyet'
                const neighborhoodCandidate = parts.slice(2).join('-');
                finalSlug = `${firstPart}/${districtCandidate}/${neighborhoodCandidate}`;
              } else {
                // E.g., 'istanbul-esenyurt' -> 'istanbul/esenyurt'
                finalSlug = `${firstPart}/${districtCandidate}`;
              }
            } else {
              // E.g., 'istanbul-merkez' -> 'istanbul/merkez'
              finalSlug = `${firstPart}/${parts.slice(1).join('/')}`;
            }
          }
        }
      }

      const slugPrefix = finalSlug.startsWith('/') ? '' : '/';
      
      // Unicode Normalization to resolve i%CC%87 issues in canonical URL representation
      const cleanSlug = finalSlug
        .replace(/i̇/g, 'i')
        .replace(/I/g, 'ı')
        .replace(/İ/g, 'i')
        .normalize('NFC');

      const encodedPath = cleanSlug
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/');

      return `
  <url>
    <loc>https://${canonicalHost}${slugPrefix}${encodedPath}</loc>
    <lastmod>${updatedAt.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
    };

    let xmlBody = '';

    // 3. Segmented Output Selection
    if (file === 'sitemap-districts.xml') {
      // Return only location/district pages
      const districtPages = filteredPages.filter(p => p.slug.includes('-'));
      xmlBody = districtPages.map(p => formatUrlNode(p.slug, p.updatedAt, 0.8)).join('');
    } 
    else if (file === 'sitemap-categories.xml') {
      // Categories and niches sitemap
      const niches = isCloaker 
        ? [] 
        : ['rus', 'yabanci', 'ogrenci', 'turbanli', 'bireysel'];
      
      const city = config?.targetCity?.toLowerCase() || 'istanbul';
      xmlBody = niches.map(niche => `
  <url>
    <loc>https://${canonicalHost}/${city}/kategori/${niche}</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');
    } 
    else if (file === 'sitemap-vip.xml') {
      // High priority/custom content pages from the DB (excluding plain locations)
      const vipPages = filteredPages.filter(p => !p.slug.includes('-'));
      
      // Fetch active profile slugs from AdProfile model in PostgreSQL
      const activeProfiles = await prisma.adProfile.findMany({
        where: { isActive: true },
        select: { name: true, updatedAt: true }
      });
      
      const profileSlugNodes = activeProfiles.map((p: { name: string; updatedAt: Date }) => {
        const slugifiedName = p.name.toLowerCase().trim()
          .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ı/g, 'i').replace(/İ/g, 'i')
          .replace(/ğ/g, 'g').replace(/ö/g, 'o').replace(/ü/g, 'u')
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '');
        return formatUrlNode(`profile/${slugifiedName}`, p.updatedAt, 0.95);
      }).join('');
      
      xmlBody = vipPages.map(p => formatUrlNode(p.slug, p.updatedAt, 0.9)).join('') + profileSlugNodes;
    } 
    else {
      // default: sitemap.xml (Consolidated sitemap containing ALL routes)
      const coreRoutes = isCloaker
        ? [
            '',
            '/terms',
            '/privacy',
            '/contact',
            '/cerez-politikasi',
            '/dmca',
            '/gizlilik-politikasi',
            '/hukuki-bilgilendirme',
            '/kvkk',
            '/sik-sorulan-sorular',
            '/telif-haklari',
            '/hakkimizda',
            '/reklam',
            '/iletisim'
          ]
        : [
            '',
            '/rehber',
            '/faq',
            '/terms',
            '/privacy',
            '/contact',
            '/cerez-politikasi',
            '/dmca',
            '/gizlilik-politikasi',
            '/hukuki-bilgilendirme',
            '/kvkk',
            '/sik-sorulan-sorular',
            '/telif-haklari',
            '/hakkimizda',
            '/reklam',
            '/iletisim'
          ];

      const coreXml = coreRoutes.map(route => `
  <url>
    <loc>https://${canonicalHost}${route}</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>`).join('');

      // District pages
      const districtPages = filteredPages.filter(p => p.slug.includes('-'));
      const districtsXml = districtPages.map(p => formatUrlNode(p.slug, p.updatedAt, 0.8)).join('');

      // Categories and niches
      const niches = isCloaker 
        ? [] 
        : ['rus', 'yabanci', 'ogrenci', 'turbanli', 'bireysel'];
      const city = config?.targetCity?.toLowerCase() || 'istanbul';
      const categoriesXml = niches.map(niche => `
  <url>
    <loc>https://${canonicalHost}/${city}/kategori/${niche}</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

      // VIP Pages
      const vipPages = filteredPages.filter(p => !p.slug.includes('-'));
      const activeProfiles = await prisma.adProfile.findMany({
        where: { isActive: true },
        select: { name: true, updatedAt: true }
      });
      const profileSlugNodes = activeProfiles.map((p: { name: string; updatedAt: Date }) => {
        const slugifiedName = p.name.toLowerCase().trim()
          .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ı/g, 'i').replace(/İ/g, 'i')
          .replace(/ğ/g, 'g').replace(/ö/g, 'o').replace(/ü/g, 'u')
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '');
        return formatUrlNode(`profile/${slugifiedName}`, p.updatedAt, 0.95);
      }).join('');
      const vipXml = vipPages.map(p => formatUrlNode(p.slug, p.updatedAt, 0.9)).join('') + profileSlugNodes;

      xmlBody = coreXml + districtsXml + categoriesXml + vipXml;
    }

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${xmlBody}
</urlset>`.trim();

    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600'
      }
    });

  } catch (error) {
    console.error(`[SITEMAP-GENERATOR] Error generating ${file}:`, error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
