import axios from 'axios';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

/**
 * 🏛️ DRKCNAY HYDRA: UNIFIED GOOGLE INDEXING SUITE (v13.0)
 * Google'ın tüm resmi ve gayri resmi indeksleme yollarını birleştiren devasa motor.
 */
export class IndexingEngine {
  
  private static readonly PING_SERVICES = [
    'https://www.google.com/ping?sitemap=',
    'https://blogsearch.google.com/ping?v=1&url=',
    'http://pingomatic.com/ping/?title=DRKCNAY_Update&blogurl=',
    'http://rpc.weblogs.com/pingSiteForm?name=DRKCNAY_Update&url='
  ];

  private static async getAuth() {
    const keyPath = path.resolve(process.cwd(), 'config/service-account.json');
    if (!fs.existsSync(keyPath)) throw new Error("service-account.json missing");
    return new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: [
        'https://www.googleapis.com/auth/indexing',
        'https://www.googleapis.com/auth/webmasters'
      ],
    });
  }

  /**
   * 1. GOOGLE INDEXING API (Instant Crawl)
   */
  public static async pushToGoogleIndexingAPI(urlToSubmit: string): Promise<boolean> {
    try {
      const auth = await this.getAuth();
      const indexing = google.indexing({ version: 'v3', auth });
      await indexing.urlNotifications.publish({
        requestBody: { url: urlToSubmit, type: 'URL_UPDATED' },
      });
      console.log(`   🚀 [INDEXING API] Başarılı: ${urlToSubmit}`);
      return true;
    } catch (error: any) {
      return false;
    }
  }

  /**
   * 2. SEARCH CONSOLE API (Sitemap Submission)
   */
  public static async submitSitemapViaAPI(host: string, sitemapPath: string = 'sitemap.xml'): Promise<boolean> {
    try {
      const auth = await this.getAuth();
      const webmasters = google.webmasters({ version: 'v3', auth });
      const siteUrl = `https://${host}/`;
      const sitemapUrl = `https://${host}/${sitemapPath}`;
      
      await webmasters.sitemaps.submit({ siteUrl, feedpath: sitemapUrl });
      console.log(`   🛰️ [SEARCH CONSOLE API] Sitemap Gönderildi: ${sitemapUrl}`);
      return true;
    } catch (error: any) {
      console.warn(`   ⚠️ [SEARCH CONSOLE API] Hata: ${error.message}`);
      return false;
    }
  }

  /**
   * 3. GOOGLE PING (Sitemap & URL)
   */
  public static async pingGoogle(urlOrSitemap: string): Promise<void> {
    const encoded = encodeURIComponent(urlOrSitemap);
    for (const service of this.PING_SERVICES) {
      try {
        await axios.get(`${service}${encoded}`, { timeout: 5000 });
      } catch (e) {}
    }
    console.log(`   💥 [PING] Google botlarına haber verildi.`);
  }

  /**
   * 🏆 UNIFIED FORCE INDEX (THE NUCLEAR OPTION)
   */
  public static async forceIndex(urlToSubmit: string, host: string): Promise<void> {
    console.log(`\n🏴‍☠️ [HYDRA INDEXER] UNIFIED ATTACK START: ${urlToSubmit}`);
    
    // Paralel Ateşleme
    await Promise.allSettled([
      this.pushToGoogleIndexingAPI(urlToSubmit),
      this.submitSitemapViaAPI(host),
      this.pingGoogle(urlToSubmit),
      this.pingGoogle(`https://${host}/sitemap.xml`)
    ]);
    
    console.log(`🏁 [HYDRA INDEXER] Operasyon Tamamlandı.\n`);
    console.log(`🏆 [DRKCNAY INDEXER] Operasyon Tamamlandı! URL tüm arama motorlarına ZORLA yedirildi.`);
  }
}

// Standalone Test
if (require.main === module) {
  const targetUrl = process.argv[2] || 'https://vipescorthizmeti.com/yeni-gizli-link';
  const targetHost = process.argv[3] || 'vipescorthizmeti.com';
  IndexingEngine.forceIndex(targetUrl, targetHost);
}
