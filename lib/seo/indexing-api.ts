import { indexingRotator } from './indexing-rotator';

/**
 * 🧛‍♂️ DRKCNAY HYDRA: GOOGLE INDEXING API INTEGRATION (v2.0)
 * Automatically notifies Google to crawl new content instantly using service account rotation.
 */
export async function notifyGoogleIndexing(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
  try {
    console.log(`🚀 [INDEXING] Notifying Google about: ${url}`);
    const result = await indexingRotator.publish(url, type);
    
    if (result.success) {
      console.log(`✅ [INDEXING] Success via ${result.email} (${result.projectId})`);
      return { success: true, email: result.email, projectId: result.projectId };
    } else {
      console.error(`❌ [INDEXING] All service accounts failed for ${url}:`, result.error);
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    console.error("❌ [INDEXING] Error notifying Google:", error.message);
    return { success: false, error: error.message };
  }
}
