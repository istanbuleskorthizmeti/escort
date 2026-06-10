import { JWT } from 'google-auth-library';

/**
 * ⚡ SOVEREIGN GOOGLE SEARCH CONSOLE COMMAND CENTER
 * Programmatic interface for Search Analytics, URL Inspection, and Sitemap Management.
 */

export interface URLInspectionResponse {
  inspectionResult?: {
    inspectionResultLink: string;
    indexStatusResult?: {
      verdict: 'VERDICT_UNSPECIFIED' | 'PASSING' | 'FAILING' | 'NEUTRAL';
      coverageState: string;
      robotsTxtState: 'ROBOTS_TXT_STATE_UNSPECIFIED' | 'ALLOWED' | 'DISALLOWED';
      indexingState: 'INDEXING_STATE_UNSPECIFIED' | 'INDEXED' | 'NOT_INDEXED';
      lastCrawlTime?: string;
    };
  };
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

export interface SearchAnalyticsResponse {
  rows?: Array<{
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
}

export class GoogleSearchConsoleService {
  private keyFile: any;
  private scopes = ['https://www.googleapis.com/auth/webmasters'];

  constructor() {
    try {
      this.keyFile = require('../google-key.json');
    } catch (e) {
      console.warn("[GSC] Sovereign Google Key not found. GSC functions disabled.");
    }
  }

  /**
   * Generates a secure OAuth2 Token using JWT service account credentials.
   */
  private async getAccessToken(): Promise<string> {
    if (!this.keyFile) {
      throw new Error("GSC credentials not loaded.");
    }
    const client = new JWT({
      email: this.keyFile.client_email,
      key: this.keyFile.private_key,
      scopes: this.scopes,
    });
    const tokens = await client.authorize();
    if (!tokens.access_token) {
      throw new Error("Failed to generate OAuth2 access token.");
    }
    return tokens.access_token;
  }

  /**
   * 📡 URL INSPECTION ENDPOINT
   * Gets inspection details for a specific URL on a registered GSC site.
   */
  async inspectUrl(inspectionUrl: string, siteUrl: string): Promise<URLInspectionResponse> {
    try {
      const token = await this.getAccessToken();
      const endpoint = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          inspectionUrl,
          siteUrl,
          languageCode: 'tr',
        }),
      });

      const responseText = await response.text();
      return JSON.parse(responseText);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`[GSC-INSPECT] Critical failure for ${inspectionUrl}:`, errorMessage);
      return { error: { code: 500, message: errorMessage, status: 'INTERNAL' } };
    }
  }

  /**
   * 📊 SEARCH ANALYTICS ENDPOINT
   * Queries click, impression, CTR, and keyword position data.
   */
  async queryAnalytics(
    siteUrl: string,
    startDate: string,
    endDate: string,
    dimensions: ('query' | 'page' | 'device' | 'country')[],
    rowLimit = 100
  ): Promise<SearchAnalyticsResponse> {
    try {
      const token = await this.getAccessToken();
      const encodedSiteUrl = encodeURIComponent(siteUrl);
      const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions,
          rowLimit,
        }),
      });

      const responseText = await response.text();
      return JSON.parse(responseText);
    } catch (err: unknown) {
      console.error(`[GSC-ANALYTICS] Failed querying ${siteUrl}:`, err instanceof Error ? err.message : String(err));
      return { rows: [] };
    }
  }

  /**
   * 🕸️ SITEMAP REGISTRATION ENDPOINT
   * Registers a sitemap feed for the target site in Search Console.
   */
  async registerSitemap(siteUrl: string, sitemapUrl: string): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      const encodedSiteUrl = encodeURIComponent(siteUrl);
      const encodedFeedUrl = encodeURIComponent(sitemapUrl);
      const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/sitemaps/${encodedFeedUrl}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 204 || response.ok) {
        console.log(`✅ [GSC-SITEMAP] Registered sitemap: ${sitemapUrl}`);
        return true;
      }
      const text = await response.text();
      console.warn(`⚠️ [GSC-SITEMAP] Registration status ${response.status}: ${text}`);
      return false;
    } catch (err: unknown) {
      console.error(`[GSC-SITEMAP] Failed to register:`, err instanceof Error ? err.message : String(err));
      return false;
    }
  }
}

export const gscService = new GoogleSearchConsoleService();
