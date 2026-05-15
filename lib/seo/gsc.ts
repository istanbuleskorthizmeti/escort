import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import path from 'node:path';
import fs from 'node:fs';
import { googleAuth } from '../google-auth';

/**
 * 🧛‍♂️ ELİT GSC SERVİSİ (VIP Elite Analytics & Indexing)
 * Google Search Console verilerini ve sitemap otomasyonunu yönetir.
 */
export class GSCService {
  private static instance: GSCService;
  private auth: JWT | null = null;
  private sc = google.searchconsole('v1');

  private constructor() {
    this.initServiceAccount();
  }

  private initServiceAccount() {
    try {
      const keyPath = path.join(process.cwd(), 'google-key.json');
      if (fs.existsSync(keyPath)) {
        const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        
        this.auth = new JWT({
          email: keys.client_email,
          key: keys.private_key,
          scopes: ['https://www.googleapis.com/auth/webmasters'],
        });
      }
    } catch (err) {
      console.warn('⚠️ GSC Service: Service Account fallback failed.');
    }
  }

  private async getAuth() {
    try {
       const client = await googleAuth.getAuthorizedClient();
       if (client) return client;
    } catch (e: any) {
       console.warn(`🛡️ [GSC] OAuth fallback failed, checking static Service Account... Error: ${e.message}`);
    }
    
    if (this.auth) {
      console.log(`🔑 [GSC] Using static Service Account from google-key.json`);
      return this.auth;
    }
    
    throw new Error('GSC Auth Failure: No OAuth tokens and no Service Account found. Check your google-key.json');
  }

  public static getInstance(): GSCService {
    if (!GSCService.instance) {
      GSCService.instance = new GSCService();
    }
    return GSCService.instance;
  }

  /**
   * Servis hesabının erişebildiği tüm onaylı mülkleri (domainleri) getirir.
   */
  async listSites(): Promise<string[]> {
    try {
      const auth = await this.getAuth();
      const res = await this.sc.sites.list({ auth });
      return (res.data.siteEntry || []).map(entry => entry.siteUrl!).filter(Boolean);
    } catch (error) {
      console.error('GSC List Sites Error:', error);
      return [];
    }
  }

  /**
   * 📡 NUCLEAR SITEMAP SUBMISSION
   * Forces Google to crawl the sitemap for a specific domain.
   */
  async submitSitemap(siteUrl: string, sitemapUrl: string) {
    try {
      const auth = await this.getAuth();
      console.log(`🚀 [GSC] Submitting sitemap for ${siteUrl}: ${sitemapUrl}`);
      await this.sc.sitemaps.submit({
        auth,
        siteUrl,
        feedpath: sitemapUrl
      });
      return { success: true };
    } catch (error: any) {
      console.error(`❌ [GSC] Sitemap Submission Error (${siteUrl}):`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Belirli bir tarih aralığı için anahtar kelime performansını getirir.
   */
  async getKeywordPerformance(startDate: string, endDate: string, siteUrl: string = 'https://vipescorthizmeti.com/') {
    try {
      const auth = await this.getAuth();
      const res = await this.sc.searchanalytics.query({
        auth,
        siteUrl: siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 250,
          aggregationType: 'auto'
        },
      });

      return res.data.rows || [];
    } catch (error) {
      console.error('GSC Keywords Error:', error);
      return [];
    }
  }

  /**
   * En çok trafik çeken sayfaları getirir.
   */
  async getPagePerformance(startDate: string, endDate: string, siteUrl: string = 'https://vipescorthizmeti.com/') {
    try {
      const auth = await this.getAuth();
      const res = await this.sc.searchanalytics.query({
        auth,
        siteUrl: siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['page'],
          rowLimit: 100
        },
      });

      return res.data.rows || [];
    } catch (error) {
      console.error('GSC Pages Error:', error);
      return [];
    }
  }

  /**
   * Belirli anahtar kelimelerin güncel sıralamasını getirir.
   */
  async getKeywordRankings(keywords: string[], siteUrl: string = 'https://vipescorthizmeti.com/') {
    const today = new Date();
    const threeDaysAgo = new Date(today.setDate(today.getDate() - 3)).toISOString().split('T')[0];
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

    try {
      const auth = await this.getAuth();
      const res = await this.sc.searchanalytics.query({
        auth,
        siteUrl: siteUrl,
        requestBody: {
          startDate: threeDaysAgo,
          endDate: yesterday,
          dimensions: ['query'],
          rowLimit: 5000
        },
      });

      const rows = res.data.rows || [];
      return keywords.map(kw => {
        const match = rows.find(r => r.keys?.[0]?.toLowerCase() === kw.toLowerCase());
        return {
          keyword: kw,
          position: match ? Math.round(match.position || 0 * 10) / 10 : 'N/A',
          clicks: match ? match.clicks : 0
        };
      });
    } catch (error) {
      console.error('GSC Ranking Error:', error);
      return [];
    }
  }
}
