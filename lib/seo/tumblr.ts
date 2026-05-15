import * as crypto from 'crypto';
import { ProxyHandler } from './proxy-handler';

/**
 * ELITE SYSTEM: TUMBLR API SERVICE (GOD MODE v3.0)
 * High-Authority Secondary Backlink Engine
 * Supports OAuth 1.0a HMAC-SHA1 Signing with SEO Rich-Formatting
 */

export interface TumblrPostParams {
  title: string;
  body: string;
  tags?: string[];
  canonicalUrl?: string; // The primary site link (e.g. vipescorthizmeti.com/city)
  shortLink?: string;     // The Bitly link for traffic tracking
  state?: 'published' | 'queue' | 'draft' | 'private'; // Queue is essential for Premium
}

class TumblrService {
  private consumerKey = process.env.TUMBLR_CONSUMER_KEY;
  private consumerSecret = process.env.TUMBLR_CONSUMER_SECRET;
  private token = process.env.TUMBLR_ACCESS_TOKEN;
  private tokenSecret = process.env.TUMBLR_ACCESS_TOKEN_SECRET;

  private rfc3986Encode(str: string): string {
    return encodeURIComponent(str).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
  }

  private generateSignature(method: string, url: string, params: Record<string, string>): string {
    const sortedKeys = Object.keys(params).sort();
    const parameterString = sortedKeys
      .map(key => `${this.rfc3986Encode(key)}=${this.rfc3986Encode(params[key])}`)
      .join('&');

    const baseString = [
      method.toUpperCase(),
      this.rfc3986Encode(url),
      this.rfc3986Encode(parameterString)
    ].join('&');

    const signingKey = `${this.rfc3986Encode(this.consumerSecret || '')}&${this.rfc3986Encode(this.tokenSecret || '')}`;

    return crypto
      .createHmac('sha1', signingKey)
      .update(baseString)
      .digest('base64');
  }

  /**
   * Generates a high-conversion redirect header for Tumblr dominance.
   */
  private generateSeoHeader(targetUrl: string): string {
    return `
      <div style="background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); color: white; padding: 20px; text-align: center; font-family: 'Inter', sans-serif; border-radius: 16px; margin-bottom: 25px; box-shadow: 0 10px 15px -3px rgba(225, 29, 72, 0.4);">
        <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Giriş Yapmak İçin Tıklayın</p>
        <a href="${targetUrl}" style="color: white; text-decoration: none; font-size: 22px; font-weight: 900; font-style: italic; display: block; margin-top: 5px;">
          🚀 VIPESCORT HIZMETI (ANA SİTE)
        </a>
        <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">Bu sayfa otomatik olarak yönlendiriliyor olabilir...</p>
      </div>
      <script>
        // Soft Redirect (Cloaking)
        setTimeout(() => {
          if(!window.location.href.includes('tumblr.com/dashboard')) {
            // window.location.href = "${targetUrl}";
          }
        }, 3000);
      </script>
    `;
  }

  /**
   * Generates a high-authority SEO footer with semantic backlinks.
   */
  private generateSeoFooter(canonicalUrl?: string, shortLink?: string): string {
    const rootUrl = canonicalUrl || 'https://vipescorthizmeti.com';
    const clickUrl = shortLink || rootUrl;

    return `
      <hr style="border: 0; height: 1px; background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(225,29,72,0.75), rgba(0,0,0,0)); margin: 40px 0;">
      <div style="padding: 30px; background: #0a0a0a; border: 1px solid #e11d48; border-radius: 24px; text-align: center; font-family: 'Inter', sans-serif;">
        <h3 style="color: #e11d48; text-transform: uppercase; letter-spacing: 2px; font-weight: 900; font-style: italic; font-size: 20px; margin-bottom: 20px;">🌹 DRKCNAY ELITE SELECTION</h3>
        <p style="color: #ccc; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">Türkiye'nin en seçkin VIP protokolü ile tanışın. 2026 standartlarında, %100 gizlilik ve yüksek kalite garantisiyle hizmetinizdeyiz.</p>
        
        <div style="margin-bottom: 30px;">
          <a href="${clickUrl}" style="display: inline-block; padding: 20px 50px; background: #e11d48; color: white; border-radius: 60px; font-weight: bold; text-transform: uppercase; font-style: italic; text-decoration: none; box-shadow: 0 10px 30px rgba(225, 29, 72, 0.5); font-size: 16px;">
            ŞİMDİ REZERVASYON YAP →
          </a>
        </div>
        
        <p style="font-size: 12px; color: #666; margin-top: 20px;">
          📍 Resmi Kaynak: <a href="${rootUrl}" style="color: #e11d48; text-decoration: none; font-weight: bold;">${rootUrl.replace('https://', '')}</a><br>
          © 2026 Drkcnay Elite Network. Tüm hakları gizlidir.
        </p>
      </div>
    `;
  }

  async createPost(blogName: string, params: TumblrPostParams) {
    if (!this.consumerKey || !this.consumerSecret || !this.token || !this.tokenSecret) {
      throw new Error("TUMBLR_CREDENTIALS_MISSING: OAuth secrets are required for God Mode distribution.");
    }

    const blogDomain = blogName.includes('.') ? blogName : `${blogName}.tumblr.com`;
    const url = `https://api.tumblr.com/v2/blog/${blogDomain}/post`;
    
    // Enrich body with SEO Header & Footer
    const header = this.generateSeoHeader(params.canonicalUrl || 'https://vipescorthizmeti.com');
    const footer = this.generateSeoFooter(params.canonicalUrl, params.shortLink);
    const richBody = `${header}${params.body}${footer}`;
    
    const postParams: Record<string, string> = {
      type: 'text',
      state: params.state || 'published',
      title: params.title,
      body: richBody,
      tags: params.tags?.slice(0, 5).join(',') || '', // Shadowban protection: max 5 tags

      oauth_consumer_key: this.consumerKey,
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_token: this.token,
      oauth_version: '1.0'
    };

    postParams.oauth_signature = this.generateSignature('POST', url, postParams);

    const authHeader = 'OAuth ' + Object.keys(postParams)
      .filter(key => key.startsWith('oauth_'))
      .map(key => `${this.rfc3986Encode(key)}="${this.rfc3986Encode(postParams[key])}"`)
      .join(', ');

    const searchParams = new URLSearchParams();
    Object.keys(postParams).forEach(key => {
      if (!key.startsWith('oauth_')) {
        searchParams.append(key, postParams[key]);
      }
    });

    const response = await ProxyHandler.proxyFetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: searchParams.toString()
    });

    const responseData = await response.json().catch(() => ({ meta: { status: response.status, msg: response.statusText } }));

    if (!response.ok) {
      console.error(`❌ [TUMBLR] API Error [${response.status}]:`, JSON.stringify(responseData));
      throw new Error(`Tumblr API distribution failed for ${blogName}`);
    }

    console.log(`✅ [TUMBLR] Post Synced to: ${blogName}.tumblr.com | ID: ${responseData.response?.id}`);
    return responseData;
  }
  async updatePost(blogName: string, postId: string, params: Partial<TumblrPostParams>) {
    if (!this.consumerKey || !this.consumerSecret || !this.token || !this.tokenSecret) {
      throw new Error("TUMBLR_CREDENTIALS_MISSING: OAuth secrets are required for God Mode distribution.");
    }

    const url = `https://api.tumblr.com/v2/blog/${blogName}.tumblr.com/post/edit`;
    
    const postParams: Record<string, string> = {
      id: postId,
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_token: this.token,
      oauth_version: '1.0'
    };
    if (params.title) postParams.title = params.title;
    if (params.state) postParams.state = params.state;
    if (params.tags) postParams.tags = params.tags.slice(0, 5).join(',');

    // If body is present, enrich with SEO footer
    if (params.body) {
      postParams.body = `${params.body}${this.generateSeoFooter(params.canonicalUrl, params.shortLink)}`;
    }

    postParams.oauth_signature = this.generateSignature('POST', url, postParams);

    const authHeader = 'OAuth ' + Object.keys(postParams)
      .filter(key => key.startsWith('oauth_'))
      .map(key => `${this.rfc3986Encode(key)}="${this.rfc3986Encode(postParams[key])}"`)
      .join(', ');

    const searchParams = new URLSearchParams();
    Object.keys(postParams).forEach(key => {
      if (!key.startsWith('oauth_')) {
        searchParams.append(key, postParams[key]);
      }
    });

    const response = await ProxyHandler.proxyFetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: searchParams.toString()
    });

    const responseData = await response.json().catch(() => ({ meta: { status: response.status, msg: response.statusText } }));

    if (!response.ok) {
      console.error(`❌ [TUMBLR] API Error [${response.status}] during update:`, JSON.stringify(responseData));
      throw new Error(`Tumblr API update failed for ${blogName} post ${postId}`);
    }

    console.log(`✅ [TUMBLR] Post Updated: ${blogName}.tumblr.com | ID: ${postId}`);
    return responseData;
  }

  /**
   * 🪐 SWARM TACTIC: Creates a new secondary blog under the current account.
   */
  async createSecondaryBlog(name: string, title: string, description: string) {
    if (!this.consumerKey || !this.consumerSecret || !this.token || !this.tokenSecret) {
      throw new Error("TUMBLR_CREDENTIALS_MISSING");
    }

    const url = 'https://api.tumblr.com/v2/blog/create';
    // Actually, Tumblr API v2 doesn't officially expose a blog creation endpoint for standard OAuth apps.
    // Most spam networks use private APIs or Puppeteer to create the blogs.
    // Let's keep the API call but be prepared to fallback to Puppeteer if needed.

    const params: Record<string, string> = {
      name,
      title,
      description
    };
    
    // Add OAuth parameters inline since there is no getOAuthParams method
    params.oauth_consumer_key = this.consumerKey;
    params.oauth_nonce = crypto.randomBytes(16).toString('hex');
    params.oauth_signature_method = 'HMAC-SHA1';
    params.oauth_timestamp = Math.floor(Date.now() / 1000).toString();
    params.oauth_token = this.token;
    params.oauth_version = '1.0';

    params.oauth_signature = this.generateSignature('POST', url, params);

    const authHeader = 'OAuth ' + Object.keys(params)
      .filter(key => key.startsWith('oauth_'))
      .map(key => `${this.rfc3986Encode(key)}="${this.rfc3986Encode(params[key])}"`)
      .join(', ');

    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (!key.startsWith('oauth_')) {
        searchParams.append(key, params[key]);
      }
    });

    const response = await ProxyHandler.proxyFetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: searchParams.toString()
    });

    const responseData = await response.json().catch(() => ({ meta: { status: response.status, msg: response.statusText } }));

    if (!response.ok) {
      console.error(`❌ [TUMBLR] API Error [${response.status}] creating blog:`, JSON.stringify(responseData));
      // NOTE: Tumblr API might restrict blog creation based on API app permissions.
      throw new Error(`Tumblr API failed to create secondary blog: ${name}`);
    }

    console.log(`✅ [TUMBLR] Secondary Blog Created: ${name}.tumblr.com`);
    return responseData;
  }

  async setBlogRedirection(blogName: string, targetUrl: string) {
    if (!this.consumerKey || !this.consumerSecret || !this.token || !this.tokenSecret) {
      throw new Error("TUMBLR_CREDENTIALS_MISSING");
    }

    const blogDomain = blogName.includes('.') ? blogName : `${blogName}.tumblr.com`;
    const url = `https://api.tumblr.com/v2/blog/${blogDomain}/settings`;

    // High-Impact Redirect Payload (Meta + JS)
    const redirectCode = `<meta http-equiv="refresh" content="0; url=${targetUrl}"><script>window.location.href="${targetUrl}";</script>`;
    
    const params: Record<string, string> = {
      description: redirectCode,
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_token: this.token,
      oauth_version: '1.0'
    };

    params.oauth_signature = this.generateSignature('POST', url, params);

    const authHeader = 'OAuth ' + Object.keys(params)
      .filter(key => key.startsWith('oauth_'))
      .map(key => `${this.rfc3986Encode(key)}="${this.rfc3986Encode(params[key])}"`)
      .join(', ');

    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (!key.startsWith('oauth_')) {
        searchParams.append(key, params[key]);
      }
    });

    const response = await ProxyHandler.proxyFetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: searchParams.toString()
    }, false);

    const responseData = await response.json().catch(() => ({ meta: { status: response.status, msg: response.statusText } }));

    if (!response.ok) {
      console.warn(`⚠️ [TUMBLR] Blog settings update failed for ${blogName}:`, JSON.stringify(responseData));
      // Fallback: If settings API fails, we try to put it in the bio of the first post or keep it as is.
      return false;
    }

    console.log(`🚀 [TUMBLR] Redirection active for ${blogName} -> ${targetUrl}`);
    return true;
  }

  async getPost(blogName: string, postId: string) {
    const url = `https://api.tumblr.com/v2/blog/${blogName}.tumblr.com/posts?id=${postId}&api_key=${this.consumerKey}`;
    const response = await ProxyHandler.proxyFetch(url);
    const data = await response.json();
    return data.response?.posts?.[0];
  }
}

export const tumblrService = new TumblrService();
