import https from 'https';

/**
 * 📢 DRKCNAY TELEGRAPH STRIKER (ANONYMOUS PARASITE SEO)
 * telegra.ph is a high-DA (90+) anonymous publishing platform.
 */

export interface TelegraphPost {
  title: string;
  author_name: string;
  content: string; // HTML-like but simplified for Telegraph API
}

class TelegraphService {
  private accessToken: string | null = null;

  /**
   * Initializes a Telegraph account to get an access_token.
   */
  async ensureAccount(): Promise<string | null> {
    if (this.accessToken) return this.accessToken;

    return new Promise((resolve) => {
      const payload = JSON.stringify({
        short_name: 'DRKCNAY',
        author_name: 'DRKCNAY ELITE'
      });

      const req = https.request({
        hostname: this.apiBase,
        path: '/createAccount',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (data.ok) {
              this.accessToken = data.result.access_token;
              resolve(this.accessToken);
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      });
      req.write(payload);
      req.end();
    });
  }

  /**
   * Creates a post on Telegraph anonymously.
   */
  async createPost(post: TelegraphPost): Promise<string | null> {
    const token = await this.ensureAccount();
    if (!token) return null;

    const content = this.formatContent(post.content);
    
    const payload = JSON.stringify({
      access_token: token,
      title: post.title,
      author_name: post.author_name,
      content: content,
      return_content: true
    });

    return new Promise((resolve) => {
      const req = https.request({
        hostname: this.apiBase,
        path: '/createPage',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (data.ok) {
              console.log(`✅ [TELEGRAPH] Created: ${data.result.url}`);
              resolve(data.result.url);
            } else {
              console.error(`❌ [TELEGRAPH] Failed:`, data.error);
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      });

      req.on('error', (e) => {
        console.error(`❌ [TELEGRAPH] Network Error:`, e.message);
        resolve(null);
      });
      
      req.write(payload);
      req.end();
    });
  }

  /**
   * Telegraph requires a specific JSON-based content structure.
   * This helper converts simple HTML to that structure.
   */
  private formatContent(html: string): any[] {
    // Very basic converter: turns paragraphs and links into Telegraph nodes
    const nodes: any[] = [];
    
    // Split by paragraphs
    const paragraphs = html.split(/<\/p>|<br\/?>/i);
    
    for (const p of paragraphs) {
      const text = p.replace(/<[^>]*>?/gm, '').trim();
      if (text) {
        nodes.push({ tag: 'p', children: [text] });
      }
    }

    // Add a mandatory backlink node at the end
    nodes.push({
      tag: 'p',
      children: [
        {
          tag: 'strong',
          children: [
            {
              tag: 'a',
              attrs: { href: 'https://vipescorthizmeti.com' },
              children: ['DORUKCAN AY ELITE ESCORT']
            }
          ]
        }
      ]
    });

    return nodes;
  }
}

export const telegraphService = new TelegraphService();
