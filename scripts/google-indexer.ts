import axios from 'axios';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

// ==============================================================================
// DRKCNAY HYDRA: GOOGLE INDEXING API SNIPER (v1.0)
// Uses Google OAuth2 Service Accounts to force-index URLs in < 15 minutes.
// ==============================================================================

interface GoogleCredentials {
  client_email: string;
  private_key: string;
}

export class GoogleIndexer {
  private static activeKeyIndex = 0;

  private static getCredentialsPool(): GoogleCredentials[] {
    const rawCreds = process.env.GOOGLE_INDEXING_CREDS;
    if (!rawCreds) {
      console.warn('⚠️ [INDEX-API] GOOGLE_INDEXING_CREDS environment variable is missing.');
      return [];
    }
    try {
      const parsed = JSON.parse(rawCreds);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [parsed];
    } catch (e) {
      console.error('❌ [INDEX-API] Failed to parse GOOGLE_INDEXING_CREDS JSON.');
      return [];
    }
  }

  private static generateAccessToken(creds: GoogleCredentials): string {
    const payload = {
      iss: creds.client_email,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: 'https://oauth2.googleapis.com/token',
    };

    // Signs the JWT with the service account private key (expires in 1 hour)
    return jwt.sign(payload, creds.private_key, {
      algorithm: 'RS256',
      expiresIn: '1h',
    });
  }

  private static async getOAuthToken(creds: GoogleCredentials): Promise<string | null> {
    try {
      const signedJwt = this.generateAccessToken(creds);
      
      const response = await axios.post('https://oauth2.googleapis.com/token', 
        new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: signedJwt
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data.access_token;
    } catch (error: any) {
      console.error('❌ [INDEX-API] OAuth token retrieval failed:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Submits a single URL to Google Indexing API
   * @param url The page URL to be indexed
   * @param type 'URL_UPDATED' (for new/updated pages) or 'URL_DELETED'
   */
  public static async submitUrl(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'): Promise<boolean> {
    const pool = this.getCredentialsPool();
    if (pool.length === 0) return false;

    // Rotate keys
    const creds = pool[this.activeKeyIndex % pool.length];
    this.activeKeyIndex++;

    const token = await this.getOAuthToken(creds);
    if (!token) return false;

    try {
      console.log(`📡 [INDEX-API] Submitting URL using key index ${this.activeKeyIndex - 1} (${creds.client_email}): ${url} (${type})`);
      const response = await axios.post(
        'https://indexing.googleapis.com/v3/urlNotifications:publish',
        {
          url: url,
          type: type
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        console.log(`✅ [INDEX-API] Indexing request successful for: ${url}`);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(`❌ [INDEX-API] Submission failed for ${url}:`, error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Syncs and indexes all cold or newly added database pages
   */
  public static async indexAllPages(host: string, limit: number = 20): Promise<void> {
    try {
      // Find pages that haven't been indexed recently (or ever)
      const pages = await prisma.pageContent.findMany({
        where: {
          site: {
            domain: host
          }
        },
        take: limit,
        orderBy: {
          updatedAt: 'desc'
        }
      });

      console.log(`🚀 [INDEX-API] Found ${pages.length} pages to ping for ${host}`);
      for (const page of pages) {
        const fullUrl = `https://${host}/${page.slug}`;
        await this.submitUrl(fullUrl);
        // Sleep to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error: any) {
      console.error('❌ [INDEX-API] Bulk indexing error:', error.message);
    }
  }
}
