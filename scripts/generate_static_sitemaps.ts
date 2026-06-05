import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma';
import { cities } from '../lib/locations';
import { slugify } from '../lib/utils';

/**
 * 🗺️ HYDRA STATIC SITEMAP GENERATOR
 * This worker generates physical sitemap files to offload the main web server.
 */
async function generateAllSitemaps() {
  console.log('📡 [HYDRA-WORKER] Starting Global Static Sitemap Export...');
  
  let sites: any[] = [];
  try {
    sites = await prisma.site.findMany({ where: { status: 'ACTIVE' } });
  } catch (e) {
    console.warn('⚠️ [SITEMAP] DB Fetch failed, using fallback domain list.');
    // Fallback to active domains if DB is unreachable
    sites = [
      { domain: 'istanbulescdrkcn.com' },
      { domain: 'sisliescort.shop' },
      { domain: 'sefakoyescorthizmeti.shop' },
      { domain: 'beylikduzuescort.shop' },
      { domain: 'kucukcekmecescort.shop' },
      { domain: 'casus-yazilim-sil.xyz' }
      // ... more can be added
    ];
  }
  
  for (const site of sites) {
    try {
      const baseUrl = `https://${site.domain}`;
      const urls: string[] = [];

      // 1. Core
      urls.push(baseUrl);
      urls.push(`${baseUrl}/rehber`);

      // 2. Locations (Lightweight)
      const cityLimit = 5;
      Object.keys(cities).slice(0, cityLimit).forEach(citySlug => {
        const city = cities[citySlug];
        const sCity = slugify(city.name);
        urls.push(`${baseUrl}/${sCity}-escort`);
        city.districts.slice(0, 5).forEach(dist => {
          urls.push(`${baseUrl}/${sCity}-escort/${slugify(dist.name)}-escort`);
        });
      });

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(u => `<url><loc>${u}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`).join('\n  ')}
</urlset>`;

      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

      const exportPath = path.join(publicDir, `sitemap-${site.domain}.xml`);
      fs.writeFileSync(exportPath, xml);
      console.log(`✅ [SITEMAP] Exported: ${site.domain} (${urls.length} URLs)`);
    } catch (err) {
      console.error(`❌ [SITEMAP] Failed for ${site.domain}:`, err);
    }
  }
}

generateAllSitemaps().then(() => process.exit(0)).catch(console.error);
