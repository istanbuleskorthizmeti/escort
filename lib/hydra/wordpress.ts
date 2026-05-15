/**
 * ⚡ DRKCNAY HYDRA: WORDPRESS MODULE
 * Distributes content via REST API (Basic Auth).
 */

import { ProxyHandler } from "../seo/proxy-handler";

export async function postToWordPress(data: {
  endpoint: string;
  user: string;
  pass: string; // App Password recommended
  title: string;
  content: string;
  categories: string[];
  tags: string[];
  canonicalUrl?: string;
  shortLink?: string;
}) {
  console.log(`[HYDRA] Publishing to WordPress: ${data.endpoint} via REST API`);

  // SEO Footer Injection
  const rootUrl = data.canonicalUrl || 'https://vipescorthizmeti.com';
  const clickUrl = data.shortLink || rootUrl;
  
  const seoFooter = `
    <hr style="border: 0; height: 1px; background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(225,29,72,0.75), rgba(0,0,0,0)); margin: 40px 0;">
    <div style="padding: 30px; background: #0a0a0a; border: 1px solid #e11d48; border-radius: 24px; text-align: center; font-family: 'Inter', sans-serif;">
      <h3 style="color: #e11d48; text-transform: uppercase; letter-spacing: 2px; font-weight: 900; font-style: italic; font-size: 20px; margin-bottom: 20px;">🌹 DRKCNAY ELITE SELECTION</h3>
      <p style="color: #ccc; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">Türkiye'nin en seçkin VIP standartları ile tanışın. 2026 standartlarında, %100 gizlilik ve yüksek kalite garantisiyle hizmetinizdeyiz.</p>
      
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

  const finalContent = `${data.content}${seoFooter}`;

  const siteDomain = new URL(data.endpoint).hostname;
  const restUrl = `https://public-api.wordpress.com/rest/v1.1/sites/${siteDomain}/posts/new`;
  
  // WordPress.com specific payload format
  const payload = {
    title: data.title,
    content: finalContent,
    status: 'publish',
    categories: data.categories.join(','),
    tags: data.tags.join(',')
  };

  try {
    const response = await ProxyHandler.proxyFetch(restUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // WordPress.com usually uses Bearer tokens, but we will try Bearer with the pass
        // or just rely on the pass being a valid OAuth token if provided
        'Authorization': `Bearer ${data.pass}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) DRKCNAYBot/2.0'
      },
      body: JSON.stringify(payload)
    }, false); // rotate = false to avoid failing proxy bottleneck
    
    let responseData;
    const text = await response.text();
    try {
      responseData = JSON.parse(text);
    } catch (e) {
      responseData = text;
    }
    
    if (response.ok && responseData && responseData.id) {
      console.log(`✅ [HYDRA] WordPress Post Created | ID: ${responseData.id}`);
      return { 
        success: true, 
        platform: 'wordpress', 
        id: responseData.id.toString(),
        url: responseData.link || `${data.endpoint.replace(/\/$/, '')}/?p=${responseData.id}`
      };
    } else {
      const errorDump = typeof responseData === 'object' ? JSON.stringify(responseData) : responseData.substring(0, 500);
      console.error(`❌ [HYDRA] WordPress REST API Failed. Status: ${response.status}. Response: ${errorDump}`);
      throw new Error('REST API response invalid or failed.');
    }
  } catch (error: any) {
    console.error(`🔥 [HYDRA] WordPress Connection Error:`, error.message);
    throw error;
  }
}

export async function updateWordPressPost(data: {
  endpoint: string;
  user: string;
  pass: string;
  postId: string;
  title: string;
  content: string;
  categories: string[];
  tags: string[];
  shortLink?: string;
}) {
  console.log(`[HYDRA] Updating WordPress Post ID: ${data.postId} on ${data.endpoint} via REST API`);

  const clickUrl = data.shortLink || 'https://vipescorthizmeti.com';
  
  const seoFooter = `
    <hr style="border: 0; height: 1px; background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(225,29,72,0.75), rgba(0,0,0,0)); margin: 40px 0;">
    <div style="padding: 30px; background: #0a0a0a; border: 1px solid #e11d48; border-radius: 24px; text-align: center;">
      <h3 style="color: #e11d48;">🌹 DRKCNAY ELITE 2026 GÜNCEL LİSTE</h3>
      <p style="color: #ccc;">İçerik AI tarafından ${new Date().toLocaleDateString('tr-TR')} tarihinde güncellendi. SEO Freshness Sinyali Aktif.</p>
      <a href="${clickUrl}" style="display: inline-block; padding: 15px 40px; background: #e11d48; color: white; border-radius: 40px; text-decoration: none;">GÜNCEL PROFİLLERİ GÖR</a>
    </div>
  `;

  const finalContent = `${data.content}${seoFooter}`;

  const siteDomain = new URL(data.endpoint).hostname;
  const restUrl = `https://public-api.wordpress.com/rest/v1.1/sites/${siteDomain}/posts/${data.postId}`;

  const payload = {
    title: data.title,
    content: finalContent,
    status: 'publish',
    categories: data.categories.join(','),
    tags: data.tags.join(',')
  };

  try {
    const response = await ProxyHandler.proxyFetch(restUrl, {
      method: 'POST', // POST to /posts/<id> updates it in WP REST API
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.pass}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) DRKCNAYBot/2.0'
      },
      body: JSON.stringify(payload)
    }, false);
    
    const responseData = await response.json();
    
    if (response.ok && responseData.id) {
      console.log(`✅ [HYDRA] WordPress Post Updated | ID: ${data.postId}`);
      return { 
        success: true, 
        platform: 'wordpress', 
        id: data.postId, 
        url: responseData.link || `${data.endpoint.replace(/\/$/, '')}/?p=${data.postId}` 
      };
    } else {
      console.error(`❌ [HYDRA] WordPress REST API Edit Failed:`, JSON.stringify(responseData));
      throw new Error('REST API edit response invalid.');
    }
  } catch (error: any) {
    console.error(`🔥 [HYDRA] WordPress Edit Error:`, error.message);
    throw error;
  }
}
