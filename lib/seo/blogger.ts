import { google } from 'googleapis';
import { googleAuth } from '../google-auth';
import { ProxyHandler } from './proxy-handler';
import https from 'https';
import fs from 'fs';
import path from 'path';

/**
 * DRKCNAY ELITE BLOGGER AUTOMATION (BACKLINK ENGINE v2.0)
 * VIP Elite: High-Authority backlink distribution with automated SEO formatting.
 */

export interface BloggerPost {
  title: string;
  content: string;
  labels?: string[];
  canonicalUrl?: string; // Main site link
  shortLink?: string;     // Bitly link
  city?: string;          // Target City
}

class BloggerService {
  private blogger = google.blogger('v3');
  private telegramToken: string | null = null;
  private telegramChatId: string | null = null;

  constructor() {
    this.loadTelegramConfig();
  }

  private loadTelegramConfig() {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value.length > 0) {
          const k = key.trim();
          const v = value.join('=').trim().replace(/^"(.*)"$/, '$1');
          if (k === 'TELEGRAM_BOT_TOKEN') this.telegramToken = v;
          if (k === 'TELEGRAM_CHAT_ID') this.telegramChatId = v;
        }
      });
    }
  }

  private async notifyTelegram(message: string): Promise<void> {
    if (!this.telegramToken || !this.telegramChatId) return;

    return new Promise((resolve) => {
      const data = JSON.stringify({
        chat_id: this.telegramChatId,
        text: message,
        parse_mode: 'HTML'
      });

      const req = https.request({
        hostname: 'api.telegram.org',
        path: `/bot${this.telegramToken}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      }, (res) => {
        res.on('data', () => {});
        res.on('end', () => resolve());
      });

      req.on('error', () => resolve());
      req.write(data);
      req.end();
    });
  }

  /**
   * Generates a high-authority SEO footer with semantic backlinks for Blogger.
   */
  private generateSeoFooter(canonicalUrl?: string, shortLink?: string, city?: string): string {
    const rootUrl = 'https://istanbulescdrkcn.com';
    const clickUrl = 'https://bit.ly/istanbulvipescort2026'; // Merkezi Sabit Link
    const locality = city || 'İstanbul';

    // ⚡ GOOGLE ULTRA: Inject the Ultimate Semantic Graph directly into Blogger posts!
    const ultraSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${clickUrl}/#organization`,
          "name": `${locality} VIP Escort Elite`,
          "url": clickUrl,
          "description": "Bölgenizdeki en üst düzey, kaporasız ve %100 gizlilik garantili profesyonel sosyal refakat ayrıcalıkları."
        },
        {
          "@type": "WebSite",
          "@id": `${clickUrl}/#website`,
          "url": clickUrl,
          "name": `${locality} VIP Escort Elite`,
          "publisher": { "@id": `${clickUrl}/#organization` }
        },
        {
          "@type": "ProfessionalService",
          "@id": `${clickUrl}/#business`,
          "name": `${locality} VIP Escort`,
          "url": clickUrl,
          "telephone": "+905520949245",
          "priceRange": "$$$",
          "areaServed": [{ "@type": "City", "name": locality }],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "845"
          }
        },
        {
          "@type": "JobPosting",
          "@id": `${clickUrl}/#jobposting`,
          "title": `${locality} Müşteri İlişkileri Temsilcisi`,
          "description": `${locality} bölgesi bazlı müşteri iletişim ve operasyon koordinasyonu pozisyonu.`,
          "datePosted": new Date().toISOString(),
          "validThrough": new Date(Date.now() + 30*24*60*60*1000).toISOString(),
          "employmentType": "CONTRACTOR",
          "hiringOrganization": { "@id": `${clickUrl}/#organization` },
          "jobLocation": { "@type": "Place", "address": { "@type": "PostalAddress", "addressLocality": locality, "addressCountry": "TR" } }
        },
        {
          "@type": "BroadcastEvent",
          "@id": `${clickUrl}/#broadcast`,
          "name": `${locality} VIP Escort — Canlı Tanıtım`,
          "description": "Bölgesel hizmet tanıtım canlı yayın akışı.",
          "isLiveBroadcast": true,
          "startDate": new Date().toISOString(),
          "endDate": new Date(Date.now() + 30*24*60*60*1000).toISOString(),
          "broadcastOfEvent": { "@id": `${clickUrl}/#business` }
        }
      ]
    };

    return `
      <!-- DRKCNAY SEO Schema (Ultra Graph) -->
      <script type="application/ld+json">
      ${JSON.stringify(ultraSchema)}
      </script>
      <div style="margin-top: 40px; padding: 35px; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid #18181b; border-radius: 24px; font-family: 'Inter', system-ui, -apple-system, sans-serif; text-align: center; color: #fff; box-shadow: 0 10px 40px rgba(225, 29, 72, 0.1);">
        <div style="display: inline-block; padding: 5px 15px; background: rgba(225, 29, 72, 0.1); border: 1px solid rgba(225, 29, 72, 0.2); border-radius: 50px; color: #e11d48; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px;">✓ AGRESİF SEO PROTOKOLÜ 2026</div>
        <h3 style="color: #e11d48; margin: 0 0 15px 0; font-size: 24px; font-style: italic; font-weight: 900; letter-spacing: -0.5px;">DORUKCAN AY ELITE NETWORK</h3>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 30px; padding: 0 20px;">
          <b>${locality} Escort</b>, Beylikdüzü Escort, Sefaköy Escort, Esenyurt Escort, Ataköy Escort ve <b>Sarıyer Escort</b> bölgelerinde en üst düzey, kaporasız ve %100 gizlilik garantili profesyonel sosyal refakat ayrıcalıkları.
        </p>
        <div style="display: flex; flex-direction: column; gap: 15px; align-items: center;">
          <a href="${clickUrl}" style="display: inline-block; background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); color: #fff; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; font-style: italic; font-size: 16px; box-shadow: 0 8px 25px rgba(225, 29, 72, 0.3); transition: transform 0.2s; width: fit-content; border: 1px solid #fda4af;">HEMEN REZERVASYON YAP</a>
          <a href="${rootUrl}" style="color: #71717a; text-decoration: underline; font-size: 13px; margin-top: 10px;">${rootUrl.replace('https://','')}</a>
        </div>
        <p style="font-size: 11px; color: #52525b; margin-top: 30px; letter-spacing: 1px; text-transform: uppercase;">© 2026 DORUKCAN AY ELITE - HYDRA SEO ENGINE</p>
      </div>
    `;
  }

  async createPost(blogId: string, post: BloggerPost, retries = 3): Promise<any> {
    const auth = await googleAuth.getAuthorizedClient();
    const agent = ProxyHandler.getAgent();
    
    // 🔥 ENCODING FIX: Ensure UTF-8 and fix common Turkish character issues
    const safeTitle = post.title.normalize('NFC');
    const safeContent = `${post.content}${this.generateSeoFooter(post.canonicalUrl, post.shortLink, post.city)}`.normalize('NFC');

    try {
      const payload: any = {
        auth,
        agent: agent || undefined,
        blogId,
        requestBody: {
          title: safeTitle,
          content: safeContent,
          labels: post.labels,
        },
      };
      const res = await this.blogger.posts.insert(payload);

      console.log(`✅ [BLOGGER] Post Created: ${res.data.url}`);
      
      await this.notifyTelegram(`🚀 <b>HYDRA BLOGGER YAYINLANDI</b>\n\n📝 Başlık: ${post.title}\n📍 Şehir: ${post.city || 'Genel'}\n🌐 URL: ${res.data.url}`);
      
      return res.data;
    } catch (error: any) {
      if (retries > 0 && (error.code === 429 || error.code === 500)) {
        console.warn(`⚠️ [BLOGGER] API Throttled/Error. Retrying... (${retries} left)`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return this.createPost(blogId, post, retries - 1);
      }
      console.error(`❌ [BLOGGER] Failed to distribute to ${blogId}:`, error.message);
      throw error;
    }
  }

  async updatePost(blogId: string, postId: string, post: BloggerPost, retries = 3): Promise<any> {
    const auth = await googleAuth.getAuthorizedClient();
    const agent = ProxyHandler.getAgent();
    
    // Enrich content with SEO footer
    const richContent = `${post.content}${this.generateSeoFooter(post.canonicalUrl, post.shortLink, post.city)}`;

    try {
      const payload: any = {
        auth,
        agent: agent || undefined,
        blogId,
        postId,
        requestBody: {
          title: post.title,
          content: richContent,
          labels: post.labels,
        },
      };
      const res = await this.blogger.posts.update(payload);

      console.log(`✅ [BLOGGER] Post Updated: ${res.data.url}`);
      return res.data;
    } catch (error: any) {
      if (retries > 0 && (error.code === 429 || error.code === 500)) {
        console.warn(`⚠️ [BLOGGER] API Throttled/Error. Retrying... (${retries} left)`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return this.updatePost(blogId, postId, post, retries - 1);
      }
      console.error(`❌ [BLOGGER] Failed to update post ${postId} on ${blogId}:`, error.message);
      throw error;
    }
  }

  async getPost(blogId: string, postId: string): Promise<any> {
    const auth = await googleAuth.getAuthorizedClient();
    const agent = ProxyHandler.getAgent();
    try {
      const payload: any = { auth, blogId, postId, agent: agent || undefined };
      const res = await this.blogger.posts.get(payload);
      return res.data;
    } catch (error: any) {
      console.error(`[BLOGGER] Failed to get post ${postId}: ${error.message}`);
      throw error;
    }
  }

  async getPostByPath(blogId: string, path: string): Promise<any> {
    const auth = await googleAuth.getAuthorizedClient();
    const agent = ProxyHandler.getAgent();
    try {
      const payload: any = { auth, blogId, path, agent: agent || undefined };
      const res = await this.blogger.posts.getByPath(payload);
      return res.data;
    } catch (error: any) {
      console.error(`[BLOGGER] Failed to get post by path ${path}: ${error.message}`);
      throw error;
    }
  }

  async listUserBlogs() {
    const auth = await googleAuth.getAuthorizedClient();
    const agent = ProxyHandler.getAgent();
    try {
      const payload: any = { auth, userId: 'self', agent: agent || undefined };
      const res = await this.blogger.blogs.listByUser(payload);
      return res.data.items || [];
    } catch (error: any) {
      console.error(`[BLOGGER] Failed to list blogs: ${error.message}`);
      throw error;
    }
  }

  async updateBlogSettings(blogId: string, settings: { title?: string; description?: string }) {
    const auth = await googleAuth.getAuthorizedClient();
    const agent = ProxyHandler.getAgent();
    try {
      const res = await (this.blogger.blogs as any).patch({
        auth,
        blogId,
        agent: agent || undefined,
        requestBody: settings
      });
      console.log(`✅ [BLOGGER] Settings Updated for ${blogId}: ${settings.title || 'Description Updated'}`);
      return res.data;
    } catch (error: any) {
      console.error(`❌ [BLOGGER] Failed to update settings for ${blogId}: ${error.message}`);
      throw error;
    }
  }
}

export const bloggerService = new BloggerService();
