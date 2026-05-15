import { prisma } from "../prisma";
import { GSCService } from "./gsc";

/**
 * DRKCNAY PERFORMANCE REPORT ENGINE
 * Tüm SEO KPI'larını tek noktada toplar ve raporlar.
 */
export class PerformanceReportEngine {
  private static instance: PerformanceReportEngine;
  private gsc = GSCService.getInstance();

  public static getInstance(): PerformanceReportEngine {
    if (!PerformanceReportEngine.instance) {
      PerformanceReportEngine.instance = new PerformanceReportEngine();
    }
    return PerformanceReportEngine.instance;
  }

  async buildFullReport(): Promise<PerformanceSnapshot> {
    const [dbStats, gscStats, latestDeltas] = await Promise.all([
      this.getDBStats(),
      this.getGSCSnapshot(),
      this.getLatestDeltas(),
    ]);

    return { dbStats, gscStats, latestDeltas, generatedAt: new Date() };
  }

  private async getDBStats(): Promise<DBStats> {
    const [
      totalPages,
      bloggerPosted,
      tumblrPosted,
      wordpressPosted,
      telegraphPosted,
      pinterestPosted,
      indexedPages,
    ] = await Promise.all([
      prisma.pageContent.count(),
      prisma.pageContent.count({ where: { isBloggerPosted: true } }),
      prisma.pageContent.count({ where: { isTumblrPosted: true } }),
      prisma.pageContent.count({ where: { isWordPressPosted: true } }),
      prisma.pageContent.count({ where: { isTelegraphPosted: true } }),
      prisma.pageContent.count({ where: { isPinterestPosted: true } }),
      prisma.pageContent.count({ where: { isIndexed: true } }),
    ]);

    return {
      totalPages,
      bloggerPosted,
      tumblrPosted,
      wordpressPosted,
      telegraphPosted,
      pinterestPosted,
      indexedPages,
      pendingBlogger: totalPages - bloggerPosted,
      pendingTumblr: totalPages - tumblrPosted,
      pendingWordpress: totalPages - wordpressPosted,
      pendingTelegraph: totalPages - telegraphPosted,
      pendingPinterest: totalPages - pinterestPosted,
    };
  }

  private async getGSCSnapshot(): Promise<MultiDomainGSCSnapshot> {
    try {
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 86_400_000).toISOString().split("T")[0];
      const yesterday = new Date(today.getTime() - 86_400_000).toISOString().split("T")[0];

      // 1. Get all authorized sites
      const sites = await this.gsc.listSites();
      const domains: DomainPerformance[] = [];

      // 2. Fetch data for each site in parallel
      await Promise.all(
        sites.map(async (siteUrl) => {
          try {
            const [keywordRows, pageRows] = await Promise.all([
              this.gsc.getKeywordPerformance(sevenDaysAgo, yesterday, siteUrl),
              this.gsc.getPagePerformance(sevenDaysAgo, yesterday, siteUrl),
            ]);

            const totalClicks = keywordRows.reduce((acc: any, r) => acc + (r.clicks ?? 0), 0);
            const totalImpressions = keywordRows.reduce((acc: any, r) => acc + (r.impressions ?? 0), 0);
            const avgPosition = keywordRows.length > 0
                ? keywordRows.reduce((acc: any, r) => acc + (r.position ?? 0), 0) / keywordRows.length
                : 0;

            const topKeywords = [...keywordRows]
              .sort((a: any, b: any) => (b.clicks ?? 0) - (a.clicks ?? 0))
              .slice(0, 5)
              .map((r) => ({
                keyword: r.keys?.[0] ?? "N/A",
                clicks: r.clicks ?? 0,
                position: +(Number(r.position) || 0).toFixed(1),
              }));

            domains.push({
              siteUrl,
              totalClicks,
              totalImpressions,
              avgPosition: +(Number(avgPosition) || 0).toFixed(1),
              topKeywords
            });
          } catch (e) {
             console.error(`GSC Error for ${siteUrl}`, e);
          }
        })
      );

      // 3. Aggregate totals
      const aggregateClicks = domains.reduce((sum, d: any) => sum + d.totalClicks, 0);
      const aggregateImpressions = domains.reduce((sum, d: any) => sum + d.totalImpressions, 0);

      return {
        aggregateClicks,
        aggregateImpressions,
        domains: domains.sort((a: any, b: any) => b.totalClicks - a.totalClicks),
        isAvailable: domains.length > 0,
      };
    } catch (e) {
      console.error("GSC Snapshot Error", e);
      return {
        aggregateClicks: 0,
        aggregateImpressions: 0,
        domains: [],
        isAvailable: false,
      };
    }
  }

  private async getLatestDeltas(): Promise<RankingDeltaEntry[]> {
    const deltas = await prisma.rankingDelta.findMany({
      orderBy: { timestamp: "desc" },
      take: 5,
    });

    return deltas.map((d: any) => ({
      keyword: d.keyword,
      position: d.position,
      change: d.change ?? 0,
      timestamp: d.timestamp,
    }));
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DBStats {
  totalPages: number;
  bloggerPosted: number;
  tumblrPosted: number;
  wordpressPosted: number;
  telegraphPosted: number;
  pinterestPosted: number;
  indexedPages: number;
  pendingBlogger: number;
  pendingTumblr: number;
  pendingWordpress: number;
  pendingTelegraph: number;
  pendingPinterest: number;
}

export interface DomainPerformance {
  siteUrl: string;
  totalClicks: number;
  totalImpressions: number;
  avgPosition: number;
  topKeywords: { keyword: string; clicks: number; position: number }[];
}

export interface MultiDomainGSCSnapshot {
  aggregateClicks: number;
  aggregateImpressions: number;
  domains: DomainPerformance[];
  isAvailable: boolean;
}

export interface RankingDeltaEntry {
  keyword: string;
  position: number;
  change: number;
  timestamp: Date;
}

export interface PerformanceSnapshot {
  dbStats: DBStats;
  gscStats: MultiDomainGSCSnapshot;
  latestDeltas: RankingDeltaEntry[];
  generatedAt: Date;
}
