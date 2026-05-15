
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

/**
 * 🧛‍♂️ DRKCNAY HYDRA: GOOGLE INDEXING API INTEGRATION (v1.0)
 * Automatically notifies Google to crawl new content instantly.
 */
export async function notifyGoogleIndexing(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
  try {
    const keyPath = path.join(process.cwd(), 'google-key.json');
    if (!fs.existsSync(keyPath)) {
      console.warn("⚠️ [INDEXING] google-key.json not found. Skipping...");
      return;
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const authClient = await auth.getClient();
    const indexing = google.indexing({
      version: 'v3',
      auth: authClient as any,
    });

    console.log(`🚀 [INDEXING] Notifying Google about: ${url}`);
    const res = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type,
      },
    });

    return res.data;
  } catch (error: any) {
    console.error("❌ [INDEXING] Error notifying Google:", error.message);
  }
}
