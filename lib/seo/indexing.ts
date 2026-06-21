import { googleAuth } from '../google-auth';
import { ProxyHandler } from './proxy-handler';

/**
 * ELITE SYSTEM: GOOGLE INDEXING API (v2.0)
 * High-Speed URL Discovery & Authority Building
 * VIP Elite: Centralized Auth Integration
 */

class GoogleIndexingService {
  /**
   * Notifies Google of a new or updated URL for rapid indexing.
   */
  async notifyUrlUpdate(url: string) {
    const maxAttempts = Math.max(1, googleAuth.getServiceAccountCount());
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
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
          throw new Error(`API Error [${response.status}]: ${JSON.stringify(result)}`);
        }

        console.log(`✅ [INDEXER] Google notified for: ${url} (Attempt ${attempt}/${maxAttempts})`);
        return { success: true, data: result };
      } catch (e: any) {
        console.warn(`⚠️ [INDEXER] Attempt ${attempt}/${maxAttempts} failed for ${url}:`, e.message);
        lastError = e;
      }
    }

    console.error(`❌ [INDEXER] All ${maxAttempts} attempts failed for ${url}. Last error:`, lastError?.message);
    return { success: false, error: lastError?.message };
  }
}

export const indexingService = new GoogleIndexingService();
