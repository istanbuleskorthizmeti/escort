import https from 'https';
import { SmartLinker } from './smart-linker';

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
  private apiBase: string = 'api.telegra.ph';

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
   * This helper converts basic HTML tags (h2, h3, p, a, strong) to that structure.
   */
  private formatContent(html: string): any[] {
    const nodes: any[] = [];
    
    // Clean up input
    const cleanHtml = html
      .replace(/<br\s*\/?>/gi, '</p><p>')
      .replace(/<div[^>]*>/gi, '<p>')
      .replace(/<\/div>/gi, '</p>');

    // Split by block elements
    const parts = cleanHtml.split(/(<h2[^>]*>.*?<\/h2>|<h3[^>]*>.*?<\/h3>|<p[^>]*>.*?<\/p>)/gi);
    
    for (const part of parts) {
      if (!part.trim()) continue;

      if (part.toLowerCase().startsWith('<h2')) {
        const text = part.replace(/<[^>]*>?/gm, '').trim();
        if (text) nodes.push({ tag: 'h3', children: [text] }); // Telegraph h2 looks like h3 in API
      } else if (part.toLowerCase().startsWith('<h3')) {
        const text = part.replace(/<[^>]*>?/gm, '').trim();
        if (text) nodes.push({ tag: 'h4', children: [text] }); // Telegraph h3 looks like h4 in API
      } else {
        // Handle paragraphs with inline tags (a, strong)
        const text = part.replace(/<p[^>]*>|<\/p>/gi, '').trim();
        if (text) {
          nodes.push({ tag: 'p', children: this.parseInlineTags(text) });
        }
      }
    }

    // --- 🎯 SMART BACKLINK INJECTION (GOD MODE) ---
    const smartLink = this.getSmartLink(html);
    nodes.push({
      tag: 'p',
      children: [
        {
          tag: 'strong',
          children: [
            {
              tag: 'a',
              attrs: { href: smartLink.url },
              children: [smartLink.anchor]
            }
          ]
        }
      ]
    });

    return nodes;
  }

  /**
   * Generates a context-aware backlink based on content keywords.
   */
  private getSmartLink(html: string): { url: string; anchor: string } {
    // Extract potential district from content or title (heuristic)
    const districtMatch = html.match(/([A-ZÇĞİÖŞÜ][a-zçğıöşü]+)\s+Escort/i);
    const district = districtMatch ? districtMatch[1] : "İstanbul";

    return SmartLinker.getLink(district);
  }

  private parseInlineTags(text: string): any[] {
    const children: any[] = [];
    // Very basic regex-based inline parser for <a> and <strong>
    const parts = text.split(/(<a\s+href="[^"]*">.*?<\/a>|<strong[^>]*>.*?<\/strong>)/gi);

    for (const part of parts) {
      if (!part) continue;

      if (part.toLowerCase().startsWith('<a')) {
        const hrefMatch = part.match(/href="([^"]*)"/i);
        const linkText = part.replace(/<[^>]*>?/gm, '');
        children.push({
          tag: 'a',
          attrs: { href: hrefMatch ? hrefMatch[1] : '#' },
          children: [linkText]
        });
      } else if (part.toLowerCase().startsWith('<strong')) {
        const boldText = part.replace(/<[^>]*>?/gm, '');
        children.push({ tag: 'strong', children: [boldText] });
      } else {
        children.push(part.replace(/<[^>]*>?/gm, ''));
      }
    }

    return children.length > 0 ? children : [text];
  }
}

export const telegraphService = new TelegraphService();

export class TelegraphAdapter {
  static async createPost(title: string, content: string) {
    console.log(`🚀 [TELEGRAPH] Striking: ${title}...`);
    return await telegraphService.createPost({
      title,
      author_name: "DRKCNAY ELITE",
      content
    });
  }
}
