import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🧠 HYDRA BRAIN: REAL DATA FEED & OPTIMIZATION
 * Google Search Console verilerini kullanarak strateji belirler.
 */
export class HydraBrain {
  
  private static async getAuth() {
    const keyFile = path.resolve(process.cwd(), 'config/service-account.json');
    const auth = new google.auth.JWT(
      undefined,
      keyFile,
      undefined,
      ['https://www.googleapis.com/auth/webmasters.readonly']
    );
    await auth.authorize();
    return auth;
  }

  /**
   * Google Search Console'dan son 3 günlük performans verilerini çeker.
   */
  static async fetchPerformanceData(siteUrl: string) {
    console.log(`[BRAIN] GSC verisi çekiliyor: ${siteUrl}`);
    
    try {
      const auth = await this.getAuth();
      const sc = google.searchconsole({ version: 'v1', auth });
      
      const res = await sc.searchanalytics.query({
        siteUrl: siteUrl,
        requestBody: {
          startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          dimensions: ['QUERY'],
          rowLimit: 10
        }
      });

      const rows = res.data.rows || [];
      return {
        topKeywords: rows.map(r => r.keys?.[0] || ''),
        totalClicks: rows.reduce((acc, r) => acc + (r.clicks || 0), 0),
        avgCtr: rows.length > 0 ? rows.reduce((acc, r) => acc + (r.ctr || 0), 0) / rows.length : 0
      };
    } catch (error: any) {
      console.warn(`[BRAIN] ${siteUrl} için veri çekilemedi (Yetki eksik olabilir):`, error.message);
      return null;
    }
  }

  /**
   * Alan adına özgü stratejiyi analiz eder ve aksiyon planı çıkarır.
   */
  static async analyzeAndStrategize(host: string) {
    const data = await this.fetchPerformanceData(`https://${host}`);
    if (!data) return { action: 'NONE', reason: 'No data or unauthorized' };

    if (data.avgCtr < 0.03 && data.totalClicks > 10) {
      return { action: 'REWRITE_METAS', reason: 'Low CTR on high impression keywords' };
    }

    if (data.topKeywords.length > 0) {
      return { action: 'INJECT_NICHE', keywords: data.topKeywords, reason: 'New ranking keywords detected' };
    }

    return { action: 'MAINTAIN', reason: 'Performance stable' };
  }

  /**
   * Kendi Kendini Geliştiren Döngü (Self-Evolution)
   */
  static async evolve() {
    console.log("[BRAIN] Hydra is evolving using real data...");
    // Gelecekte tüm domainleri döngüye sokacak mantık buraya gelecek.
  }
}

