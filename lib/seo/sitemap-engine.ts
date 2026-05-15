import { DOMAIN_MATRIX } from '../../config/domains';
import { taxonomyCategories } from '../taxonomy';
import { IndexingEngine } from './indexing-engine';

/**
 * 🗺️ DYNAMIC SITEMAP & INDEXING PINGER
 * Tüm uydular için sitemap üretir ve Google'a anlık bildirir.
 */
export class SitemapEngine {
  
  static generateSitemap(host: string): string {
    const config = DOMAIN_MATRIX.find(d => d.host === host);
    const baseUrl = `https://${host}`;
    const date = new Date().toISOString();

    const urls = [
      { loc: `${baseUrl}/`, priority: '1.0' },
      { loc: `${baseUrl}/iletisim`, priority: '0.8' }
    ];

    // Kategori ve Semt Kombinasyonlarını Ekle
    if (config?.targetDistrict) {
      Object.entries(taxonomyCategories).forEach(([slug, cat]) => {
        urls.push({
          loc: `${baseUrl}/${config.targetDistrict}-${slug}`,
          priority: '0.9'
        });
      });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(u => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('')}
</urlset>`;

    return xml;
  }

  /**
   * 🚀 NUCLEAR PING: Google'a tüm URL'leri zorla bildirir.
   */
  static async pingAll(host: string) {
    console.log(`📡 [SITEMAP-PING] ${host} için Google operasyonu başladı...`);
    const sitemapUrl = `https://${host}/sitemap.xml`;
    
    await IndexingEngine.pingGoogle(sitemapUrl);
    await IndexingEngine.submitSitemapViaAPI(host);
    
    console.log(`✅ [SITEMAP-PING] Google botları yola çıktı.`);
  }
}
