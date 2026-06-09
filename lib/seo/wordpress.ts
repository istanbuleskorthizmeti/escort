import { prisma } from '../prisma';

/**
 * 🪐 DRKCNAY ELITE: WORDPRESS CONNECTOR (VIP Elite v3.9)
 * Authority distribution engine for WordPress.com REST API.
 */

export interface WordPressAuth {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  blogUrl: string;
}

export interface WordPressPost {
  title: string;
  content: string;
  tags?: string[];
  categories?: string[];
}

class WordPressService {
  private readonly baseUrl = 'https://public-api.wordpress.com/rest/v1.1';

  /**
   * Generates the authorization URL for the user to visit.
   */
  getAuthUrl(clientId: string, redirectUri: string = 'https://istanbulescort.blog/api/auth/callback/wordpress'): string {
    return `https://public-api.wordpress.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
  }

  /**
   * Exchanges authorization code for an access token.
   */
  async exchangeCodeForToken(clientId: string, clientSecret: string, code: string, redirectUri: string = 'https://istanbulescort.blog/api/auth/callback/wordpress') {
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);

    const response = await fetch('https://public-api.wordpress.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
    
    if (!response.ok) {
        throw new Error(`WordPress Auth Error: ${await response.text()}`);
    }
    
    return await response.json(); // { access_token: string, blog_id: string, blog_url: string }
  }

  /**
   * Pushes high-authority content to a specific WordPress blog.
   */
  async createPost(blogId: string, accessToken: string, post: WordPressPost) {
    console.log(`📡 [WORDPRESS] Pushing to Blog ${blogId}: "${post.title}"`);
    
    try {
      const response = await fetch(`${this.baseUrl}/sites/${blogId}/posts/new`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            title: post.title,
            content: post.content,
            tags: post.tags?.join(','),
            categories: post.categories?.join(','),
            status: 'publish'
          })
      });

      if (!response.ok) {
          throw new Error(await response.text());
      }
      
      const data = await response.json();
      console.log(`✅ [WORDPRESS] Post Success: ${data.URL}`);
      return data;
    } catch (error: any) {
      console.error(`❌ [WORDPRESS] Error:`, error.message);
      throw error;
    }
  }

  /**
   * Updates an existing post on WordPress.com.
   */
  async updatePost(blogId: string, postId: string, accessToken: string, post: Partial<WordPressPost>) {
    console.log(`📡 [WORDPRESS] Updating Post ${postId} on Blog ${blogId}: "${post.title || 'Untitled'}"`);
    
    try {
      const response = await fetch(`${this.baseUrl}/sites/${blogId}/posts/${postId}`, {
          method: 'POST', // WordPress REST API uses POST for updates to existing resources
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            title: post.title,
            content: post.content,
            tags: post.tags?.join(','),
            categories: post.categories?.join(','),
            status: 'publish'
          })
      });

      if (!response.ok) {
          throw new Error(await response.text());
      }
      
      const data = await response.json();
      console.log(`✅ [WORDPRESS] Update Success: ${data.URL}`);
      return data;
    } catch (error: any) {
      console.error(`❌ [WORDPRESS] Update Error:`, error.message);
      throw error;
    }
  }
}

export const wordPressService = new WordPressService();
