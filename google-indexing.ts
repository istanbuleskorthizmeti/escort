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
      this.keyFile = require('./config/service-account.json');
    } catch (e) {
      try {
        this.keyFile = require('../google-key.json');
      } catch (e2) {
        console.warn("[INDEXING] Google Key file not found. Indexing service will be disabled.");
      }
    }
  }

  /**
   * Google'a yeni veya güncellenmiş bir URL'yi bildirir.
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

      const data = await response.json();
      
      if (!response.ok) {
        console.error(`[INDEXING] API Error: ${JSON.stringify(data)}`);
      } else {
        console.log(`[INDEXING] Success: ${url}`);
      }
      
      return data;
    } catch (error: any) {
      console.error(`[INDEXING] critical failure: ${error.message}`);
      return null;
    }
  }

  /**
   * Service Account Key kullanarak Google OAuth2 token'ı alır.
   * Node.js ortamında JWT oluşturur.
   */
  private async getAccessToken(): Promise<string> {
    // Note: In a production App Router environment, it's better to use 'google-auth-library'.
    // Here we simulate the process for the edge/node hybrid used in this project.
    // Assuming 'google-auth-library' is available in the environment.
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
