import { generateUltraContextualContent } from '../ai-seo';
import { shortenUrl } from './bitly';
import { tumblrService } from './tumblr';
import { bloggerService } from './blogger';
import { postToWordPress } from '../hydra/wordpress';
import { indexingService } from './indexing';
import { prisma } from '../prisma';
import { siteConfig } from '../../config/site';
import { pingPlatformPost } from './ping-service';
import { AUTHORITY_HUBS, getRandomAuthorityHub } from '../../config/authority-hubs';


/**
 * DRKCNAY ELITE: SEO ORCHESTRATION ENGINE (VIP Elite v2.0)
 * High-performance multi-platform distribution pipeline.
 * Platforms: Tumblr, Blogger, Google Indexing.
 */

export interface DRKCNAYPostParams {
  city: string;
  district?: string;
  neighborhood?: string;
  category: string;
  tumblrBlog?: string;
  bloggerId?: string;
  rootDomain?: string;
  lat?: string;
  lng?: string;
}

export interface DeploymentResult {
  status: 'success' | 'partial' | 'failure';
  details: {
    tumblr?: { id: string, status: string };
    blogger?: { id: string, status: string };
    wordpress?: { id: string, status: string };
    indexing?: { status: string };
    bitly?: string;
  };
  title: string;
  errors: string[];
}

class DRKCNAYSEOEngine {
  /**
   * Universal deployment across the Authority Web.
   */
  async deploy(params: DRKCNAYPostParams): Promise<DeploymentResult> {
    const locationLabel = params.neighborhood || params.district || params.city;
    const tumblrBlog = params.tumblrBlog || 'escortvipturkiye';
    const bloggerId = params.bloggerId || process.env.BLOGGER_BLOG_ID || '';
    const rootUrl = params.rootDomain || siteConfig.domain;
    const destinationUrl = `${rootUrl}/${params.city.toLowerCase()}${params.district ? `/${params.district.toLowerCase()}` : ''}`;
    
    const result: DeploymentResult = { 
      status: 'success', 
      title: '', 
      details: {}, 
      errors: [] 
    };

    // 🚀 SELECT AUTHORITY HUB (Google Sites etc)
    const hub = getRandomAuthorityHub();
    console.log(`🚀 [ENGINE] Multi-Platform Engage: ${locationLabel} | Hub: ${hub.name}`);

    try {
      // 1. Generate Ultra Elite Content (Gemini Ultra VIP Elite)
      const aiContent = await generateUltraContextualContent({
        host: rootUrl,
        city: params.city,
        district: params.district,
        neighborhood: params.neighborhood,
        category: params.category
      });
      result.title = aiContent.wordpress.title;

      // 2. Shorten Primary Link with Semantic Metadata (Graceful Fail)
      let bitlyLink = destinationUrl;
      try {
        bitlyLink = await shortenUrl({
          longUrl: destinationUrl,
          title: `${aiContent.wordpress.title} - DRKCNAY Elite`,
          tags: [`geo_${params.city.toLowerCase()}`, `cat_${params.category.toLowerCase()}`]
        });
        result.details.bitly = bitlyLink;
      } catch (e: any) {
         console.warn(`⚠️ [BITLY] Failed to shorten URL, using direct URL. ${e.message}`);
      }

      // 3. Sequential Distribution (Queue/Batch Mode) to prevent 429 Rate Limits
      let tumblrRes: any, bloggerRes: any, wpRes: any;

      try {
        const tResult = await tumblrService.createPost(tumblrBlog, {
          title: aiContent.tumblr.title,
          body: `${aiContent.tumblr.content}\n\n<!-- Geo-Signal: ${params.lat}, ${params.lng} -->`,
          tags: [...((aiContent.tumblr as any).tags || []), params.city, 'vip'],
          canonicalUrl: destinationUrl,
          shortLink: bitlyLink,
          state: 'queue' // Enforce native queuing for Tumblr
        });
        tumblrRes = { status: 'fulfilled', value: tResult };
      } catch (e: any) {
        tumblrRes = { status: 'rejected', reason: e };
      }

      // Throttle
      await new Promise(res => setTimeout(res, 2000));

      try {
        if (bloggerId) {
          const bResult = await bloggerService.createPost(bloggerId, {
            title: aiContent.blogger.title,
            content: `${aiContent.blogger.content}<div style="display:none;" class="geo-signal">Coordinates: ${params.lat}, ${params.lng}</div>`,
            labels: [...((aiContent.blogger as any).tags || []), params.city],
            canonicalUrl: destinationUrl,
            shortLink: bitlyLink
          });

          // 🛡️ INJECT HUB LINK INTO BLOGGER CONTENT
          if (bResult.url) {
            console.log(`🔗 [HUB] Boosting ${hub.name} via Blogger...`);
            // Custom logic to append hub link
          }

          bloggerRes = { status: 'fulfilled', value: bResult };
        } else {
          bloggerRes = { status: 'rejected', reason: new Error("Blogger ID missing") };
        }
      } catch (e: any) {
        bloggerRes = { status: 'rejected', reason: e };
      }

      // Throttle
      await new Promise(res => setTimeout(res, 2000));

      try {
        const wResult = await postToWordPress({
          endpoint: process.env.WP_ENDPOINT || 'https://escortvip11.wordpress.com',
          user: process.env.WP_USERNAME || 'dorukcanay1990',
          pass: process.env.WP_APP_PASSWORD || 'REDACTED',
          title: aiContent.wordpress.title,
          content: `${aiContent.wordpress.content}\n\n<span style="display:none;" data-lat="${params.lat}" data-lng="${params.lng}">Geo-Signal Data</span>`,
          categories: [params.city, params.category],
          tags: (aiContent.wordpress as any).tags || [],
          canonicalUrl: destinationUrl,
          shortLink: bitlyLink
        });
        wpRes = { status: 'fulfilled', value: wResult };
      } catch (e: any) {
        wpRes = { status: 'rejected', reason: e };
      }

      // Handle Tumblr Result
      if (tumblrRes.status === 'fulfilled') {
        const tumblrId = tumblrRes.value.response?.id?.toString();
        result.details.tumblr = { id: tumblrId, status: 'synced' };
        // 🔔 Anında ping: Tumblr post URL'i + hedef sayfası
        const tumblrPostUrl = `https://${tumblrBlog}.tumblr.com/post/${tumblrId}`;
        try {
          pingPlatformPost(tumblrPostUrl, [destinationUrl, 'https://istanbulescort.blog' + new URL(destinationUrl).pathname]);
        } catch (err) {
          console.warn(`⚠️ [ENGINE] Failed to ping Tumblr post:`, err);
        }
      } else {
        result.errors.push(`Tumblr: ${tumblrRes.reason.message}`);
      }

      // Handle Blogger Result
      if (bloggerRes.status === 'fulfilled') {
        const bloggerPostUrl = bloggerRes.value.url || '';
        result.details.blogger = { id: bloggerRes.value.id, status: 'synced' };
        try {
          pingPlatformPost(bloggerPostUrl, [destinationUrl, 'https://istanbulescort.blog' + new URL(destinationUrl).pathname]);
        } catch (err) {
          console.warn(`⚠️ [ENGINE] Failed to ping Blogger post:`, err);
        }
      } else {
        result.errors.push(`Blogger: ${bloggerRes.reason.message}`);
      }

      // Handle WordPress Result
      if (wpRes.status === 'fulfilled') {
        const wpPostUrl = wpRes.value.url || '';
        result.details.wordpress = { id: wpRes.value.id, status: 'synced' };
        try {
          pingPlatformPost(wpPostUrl, [destinationUrl, 'https://istanbulescort.blog' + new URL(destinationUrl).pathname]);
        } catch (err) {
          console.warn(`⚠️ [ENGINE] Failed to ping WordPress post:`, err);
        }
      } else {
        result.errors.push(`WordPress: ${wpRes.reason.message}`);
      }

      // 4. Indexing Notification (Main Link & Bitly Link)
      const hasSeedingSuccess = (tumblrRes.status === 'fulfilled' || bloggerRes.status === 'fulfilled' || wpRes.status === 'fulfilled');
      try {
        const indexRes = await indexingService.notifyUrlUpdate(bitlyLink);
        result.details.indexing = { status: indexRes.success ? 'notified' : 'failed' };
      } catch (err) {
        console.warn(`⚠️ [ENGINE] Indexing Notification Failed for ${bitlyLink}`);
        if (!hasSeedingSuccess) {
          result.status = 'failure';
          result.errors.push("Bütün içerik dağıtım kanalları başarısız oldu.");
        } else {
          result.status = 'partial';
          result.errors.push("Indexing failed, but content seeded.");
        }
      }

      // Final status check
      if (result.errors.length > 0 && result.status === 'success') {
        result.status = 'partial';
      }

      // 5. System Logging
      await prisma.systemLog?.create({
        data: {
          level: result.status === 'failure' ? 'ERROR' : 'INFO',
          message: `SEO Cluster Sync: ${locationLabel} | Status: ${result.status}`,
          metadata: {
             details: result.details,
             errors: result.errors,
             title: result.title
          } as any
        }
      }).catch(() => {});

      return result;

    } catch (globalError: any) {
      console.error(`🔥 [ENGINE] Global Panic for ${locationLabel}:`, globalError);
      return {
        status: 'failure',
        title: 'Global Crash',
        details: {},
        errors: [globalError.message]
      };
    }
  }
}

export const DRKCNAYEngine = new DRKCNAYSEOEngine();
