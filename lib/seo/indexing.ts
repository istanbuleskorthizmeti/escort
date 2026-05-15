import { googleAuth } from '../google-auth';
import { ProxyHandler } from './proxy-handler';

/**
 * ELITE SYSTEM: GOOGLE INDEXING API (v2.0)
 * High-Speed URL Discovery & Authority Building
 * God Mode: Centralized Auth Integration
 */

class GoogleIndexingService {
  /**
   * Notifies Google of a new or updated URL for rapid indexing.
   */
  async notifyUrlUpdate(url: string) {
    try {
      const auth = await googleAuth.getAuthorizedClient();
      const accessToken = (await auth.getAccessToken()).token;

      if (!accessToken) throw new Error("Failed to retrieve Access Token.");

      const response = await ProxyHandler.proxyFetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          type: 'URL_UPDATED'
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.warn(`⚠️ [INDEXER] API Error [${response.status}] for ${url}:`, JSON.stringify(result));
        return { success: false, error: result };
      }

      console.log(`✅ [INDEXER] Google notified for: ${url}`);
      return { success: true, data: result };
    } catch (e: any) {
      console.error(`❌ [INDEXER] System Failure for ${url}:`, e.message);
      return { success: false, error: e.message };
    }
  }
}

export const indexingService = new GoogleIndexingService();
