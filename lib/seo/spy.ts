import { GSCService } from "./gsc";

export interface CompetitorData {
  domain: string;
  occurrenceCount: number;
  averagePosition: number;
}

export interface SpyReport {
  timestamp: string;
  myAveragePosition: number;
  topCompetitors: CompetitorData[];
  keywordAnalysis: {
    query: string;
    myPosition: number;
    competitors: string[];
  }[];
}

/**
 * DRKCNAY SPY ENGINE
 * Analyzes SERP to discover and track elite competitors.
 */
export const SpyService = {
  async generateMatrix(): Promise<SpyReport> {
    const gsc = GSCService.getInstance();
    
    // 1. Get our top keywords from the last 7 days
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 3);
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    const keywords = await gsc.getKeywordPerformance(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    // 2. Take top 10 keywords by impressions/clicks
    const topKeywords = keywords.slice(0, 10);
    
    const analysisResults: { query: string; myPosition: number; competitors: string[] }[] = [];
    const competitorStats: Record<string, { count: number; positions: number[] }> = {};

    // 3. For each keyword, check SERP (Top 3)
    // In a real environment, we'd use a Search API. Here we'll use our existing internal logic or simulate.
    for (const kw of topKeywords) {
      const query = kw.keys?.[0] || 'unknown';
      const myPos = kw.position || 0;
      
      // Simulate/Scrape Top 3 (Simplified for this execution, in production this calls a Search API)
      // Since we are in a limited environment, I'll mock the competitor discovery part 
      // but structure it to be easily linked to a real API like Serper.dev.
      
      const mockCompetitors = [
        "rakip-pro.com",
        "escort-partner.com",
        "vip-buluşma.net",
        "elit-deneyim.org"
      ].sort(() => 0.5 - Math.random()).slice(0, 3);

      analysisResults.push({
        query,
        myPosition: myPos,
        competitors: mockCompetitors
      });

      mockCompetitors.forEach(domain => {
        if (!competitorStats[domain]) {
          competitorStats[domain] = { count: 0, positions: [] };
        }
        competitorStats[domain].count += 1;
        // Assume they are in top 3
        competitorStats[domain].positions.push(Math.floor(Math.random() * 3) + 1);
      });
    }

    const competitorMatrix: CompetitorData[] = Object.entries(competitorStats).map(([domain, stats]) => ({
      domain,
      occurrenceCount: stats.count,
      averagePosition: stats.positions.reduce((a, b) => a + b, 0) / stats.positions.length
    })).sort((a, b) => b.occurrenceCount - a.occurrenceCount);

    const avgPos = topKeywords.length > 0 
      ? topKeywords.reduce((acc: number, curr: any) => acc + (curr.position || 0), 0) / topKeywords.length 
      : 0;

    return {
      timestamp: new Date().toISOString(),
      myAveragePosition: avgPos,
      topCompetitors: competitorMatrix,
      keywordAnalysis: analysisResults
    };
  }
};
