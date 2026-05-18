import axios from 'axios';

interface MediumPublishParams {
  title: string;
  content: string; // Markdown or HTML
  tags?: string[];
  canonicalUrl?: string;
}

/**
 * DRKCNAY SOVEREIGN HYDRA: MEDIUM REST API PUBLISHER
 * Seamlessly deploys supreme markdown articles to Medium.
 * Automatically fetches the user's Profile ID and signs authorization headers.
 */
export class MediumPublisher {
  /**
   * Publishes an article to Medium under the authenticated user profile.
   */
  public static async publish(params: MediumPublishParams): Promise<{ success: boolean; url?: string; error?: string }> {
    const token = process.env.MEDIUM_ACCESS_TOKEN;
    if (!token) {
      return { success: false, error: "MEDIUM_ACCESS_TOKEN environment variable is not defined!" };
    }

    try {
      // 1. Fetch authenticated user profile to get authorId
      console.log('📡 [MEDIUM PUBLISHER] Fetching Medium Profile ID...');
      const profileRes = await axios.get('https://api.medium.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      if (!profileRes.data || !profileRes.data.data || !profileRes.data.data.id) {
        return { success: false, error: "Failed to parse Medium profile ID from API response!" };
      }

      const authorId = profileRes.data.data.id;
      console.log(`✅ [MEDIUM PROFILE] Author ID Fetched: ${authorId}`);

      // 2. Publish post under the fetched authorId
      const publishEndpoint = `https://api.medium.com/v1/users/${authorId}/posts`;
      console.log(`📡 [MEDIUM PUBLISHER] Publishing article to Medium: ${params.title}`);

      const response = await axios.post(publishEndpoint, {
        title: params.title,
        contentFormat: 'markdown', // Premium Markdown integration
        content: params.content,
        tags: params.tags || [],
        publishStatus: 'public', // Direct live publication!
        canonicalUrl: params.canonicalUrl
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 20000
      });

      if (response.status === 201 && response.data && response.data.data) {
        const liveUrl = response.data.data.url;
        console.log(`🔥 [MEDIUM SUCCESS] Article published live: ${liveUrl}`);
        return { success: true, url: liveUrl };
      } else {
        return { success: false, error: `Unexpected status code: ${response.status}` };
      }
    } catch (err: any) {
      const errDetail = err.response ? JSON.stringify(err.response.data) : err.message;
      console.error(`❌ [MEDIUM FAILED] Publish failed:`, errDetail);
      return { success: false, error: err.message };
    }
  }
}
