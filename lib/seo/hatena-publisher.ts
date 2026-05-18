import axios from 'axios';
import crypto from 'crypto';

interface HatenaPublishParams {
  title: string;
  content: string; // Markdown or HTML
  categories?: string[];
  customSlug?: string;
}

/**
 * DRKCNAY SOVEREIGN HYDRA: HATENA ATOMPUB API PUBLISHER
 * Highly optimized, secure XML-based publisher for Hatena Blog.
 * Bypasses anti-spam with automatic WSSE (Web Services Security) Authentication.
 */
export class HatenaPublisher {
  /**
   * Generates WSSE Authentication headers required by Hatena AtomPub API.
   */
  private static generateWsseHeader(username: string, apiKey: string) {
    const nonce = crypto.randomBytes(16).toString('hex');
    const created = new Date().toISOString();
    
    // WSSE PasswordDigest formula: Base64(SHA1(Nonce + Created + ApiKey))
    const sha1 = crypto.createHash('sha1');
    sha1.update(Buffer.concat([
      Buffer.from(nonce, 'utf-8'),
      Buffer.from(created, 'utf-8'),
      Buffer.from(apiKey, 'utf-8')
    ]));
    const digest = sha1.digest('base64');
    const base64Nonce = Buffer.from(nonce, 'utf-8').toString('base64');

    return `UsernameToken Username="${username}", PasswordDigest="${digest}", Nonce="${base64Nonce}", Created="${created}"`;
  }

  /**
   * Publishes an article to Hatena Blog using AtomPub XML endpoint.
   */
  public static async publish(params: HatenaPublishParams): Promise<{ success: boolean; url?: string; error?: string }> {
    // Read Hatena credentials from env
    const username = process.env.HATENA_USERNAME || "dorukcanay";
    const apiKey = process.env.HATENA_API_KEY; // API Key / AtomPub password
    const blogId = process.env.HATENA_BLOG_ID || "dorukcanay.hatenablog.com"; // Blog Domain

    if (!apiKey) {
      return { success: false, error: "HATENA_API_KEY environment variable is not defined!" };
    }

    // AtomPub collection URI for Hatena Blog
    const endpoint = `https://blog.hatena.ne.jp/${username}/${blogId}/atom/entry`;

    // 🎯 Construct AtomPub XML payload (HTML content supported inside <content>)
    const categoriesXml = (params.categories || [])
      .map(cat => `<category term="${cat}" />`)
      .join('\n');

    const xmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom"
       xmlns:app="http://www.w3.org/2007/app">
  <title>${params.title}</title>
  <author><name>${username}</name></author>
  <content type="text/x-markdown">${params.content}</content>
  <updated>${new Date().toISOString()}</updated>
  ${categoriesXml}
  <app:control>
    <app:draft>no</app:draft>
  </app:control>
</entry>`;

    try {
      console.log(`📡 [HATENA PUBLISHER] Sending WSSE Authenticated AtomPub entry for: ${params.title}`);
      
      const wsse = this.generateWsseHeader(username, apiKey);
      const response = await axios.post(endpoint, xmlPayload, {
        headers: {
          'X-WSSE': wsse,
          'Content-Type': 'application/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });

      if (response.status === 201) {
        // Parse the returned XML to extract the alternate (live) link
        const match = response.data.match(/<link rel="alternate" type="text\/html" href="([^"]+)"\/>/);
        const liveUrl = match ? match[1] : `https://${blogId}/entry/${params.customSlug || ''}`;
        
        console.log(`🔥 [HATENA SUCCESS] Article published live: ${liveUrl}`);
        return { success: true, url: liveUrl };
      } else {
        return { success: false, error: `Unexpected status code: ${response.status}` };
      }
    } catch (err: any) {
      const errDetail = err.response ? JSON.stringify(err.response.data) : err.message;
      console.error(`❌ [HATENA FAILED] AtomPub publish failed:`, errDetail);
      return { success: false, error: err.message };
    }
  }
}
