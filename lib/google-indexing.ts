/**
 * DRKCNAY ELITE GOOGLE INDEXING SERVICE (DOMINANCE MODE)
 * Pushes URLs to Google Search Console for near-instant indexing.
 */

export interface IndexingResponse {
  urlNotificationMetadata?: {
    url: string;
    latestUpdate?: {
      url: string;
      type: string;
      notifyTime: string;
    }
  };
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

class GoogleIndexingService {
  private keyFile: any;

  constructor() {
    try {
      this.keyFile = require('../google-key.json');
    } catch (e) {
      console.warn("[INDEXING] Google Key file not found. Indexing service will be disabled.");
    }
  }

  /**
   * 🚀 NUCLEAR BROADCAST
   * Pings Google, Bing, and Yandex simultaneously.
   */
  async broadcast(url: string): Promise<void> {
    console.log(`🚀 [NUCLEAR INDEXING] Broadcasting: ${url}`);
    
    // 1. Google Indexing API (Real-time)
    this.notifyUpdate(url).catch(e => console.error("Google Indexing Error:", e));

    // 2. IndexNow (Bing & Yandex)
    this.pingIndexNow(url).catch(e => console.error("IndexNow Error:", e));

    // 3. Google Ping Service (Legacy but effective)
    this.pingGoogleSitemap(url).catch(e => console.error("Sitemap Ping Error:", e));
  }

  /**
   * Google Indexing API
   */
  async notifyUpdate(url: string): Promise<IndexingResponse | null> {
    if (!this.keyFile) return null;
    try {
      const token = await this.getAccessToken();
      const response = await fetch('https://indexing.googleapis.com/v1/urlNotifications:publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: url,
          type: 'URL_UPDATED',
        }),
      });
      return await response.json();
    } catch (error: any) {
      console.error(`[INDEXING] critical failure: ${error.message}`);
      return null;
    }
  }

  /**
   * 🕸️ INDEX NOW (Bing & Yandex Dominance)
   */
  async pingIndexNow(url: string): Promise<void> {
    const host = new URL(url).hostname;
    const key = process.env.INDEXNOW_KEY || "6aff73cfe0691c00fd5a92beb39bd287"; // Use verification key as fallback
    
    const endpoints = [
      'https://www.bing.com/indexnow',
      'https://yandex.com/indexnow'
    ];

    for (const endpoint of endpoints) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({
            host: host,
            key: key,
            keyLocation: `https://${host}/${key}.txt`,
            urlList: [url]
          })
        });
        console.log(`✅ [INDEXNOW] Sent to ${endpoint}: ${url}`);
      } catch (e) {
        console.error(`❌ [INDEXNOW] Failed for ${endpoint}:`, e);
      }
    }
  }

  /**
   * 📡 GOOGLE SITEMAP PING
   */
  async pingGoogleSitemap(url: string): Promise<void> {
    const sitemapUrl = `${new URL(url).origin}/sitemap.xml`;
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    try {
      await fetch(pingUrl);
      console.log(`✅ [PING] Google Sitemap Ping Sent: ${sitemapUrl}`);
    } catch (e) {
      console.error(`❌ [PING] Google Sitemap Ping Failed:`, e);
    }
  }

  private async getAccessToken(): Promise<string> {
    const { JWT } = require('google-auth-library');
    const client = new JWT({
      email: this.keyFile.client_email,
      key: this.keyFile.private_key,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });
    const tokens = await client.authorize();
    return tokens.access_token || '';
  }
}

export const googleIndexing = new GoogleIndexingService();
