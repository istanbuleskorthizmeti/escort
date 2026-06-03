import { BloggerAdapter } from './blogger';
import { GistAdapter } from './gist';
import { GoogleSitesAdapter } from './google-sites';
import { telegraphService } from '../seo/telegraph';
import { TelegramService } from '../crm/telegram';
import { generateEliteOmniContent, OmniPlatformContent } from '../ai-seo';

/**
 * 🧛‍♂️ HYDRA PARASITE ORCHESTRATOR (GOD MODE)
 * Coordinates high-authority backlink injections across multiple platforms.
 */
export class HydraOrchestrator {
  /**
   * Execute a full-scale parasite siege for a specific target.
   */
  static async executeSiege(params: {
    city: string;
    district: string;
    host: string;
    blogId?: string;
    templateContent?: OmniPlatformContent;
  }) {
    console.log(`⚔️ [HYDRA-SIEGE] Initiating assault on ${params.district}...`);
    
    // 1. Generate or Process Content
    let content: OmniPlatformContent;
    if (params.templateContent) {
      console.log(`♻️ [HYDRA-SIEGE] Using template content (Token Saving Mode)`);
      content = this.processTemplate(params.templateContent, params.district);
    } else {
      content = await generateEliteOmniContent({
        city: params.city,
        district: params.district,
        host: params.host
      });
    }

    const results: Array<{ platform: string; url: string | null }> = [];

    // 2. Execute Parallel Deployments (where possible)
    // Telegraph and Gist are usually fast and don't have strict gaps like Blogger
    const quickStrikes = await Promise.all([
      this.strikeTelegraph(params, content),
      this.strikeGist(params, content)
    ]);
    results.push(...quickStrikes);

    // 3. Sequential / Controlled Strikes
    // Blogger has a 5min gap enforced in its adapter
    if (params.blogId) {
      const bloggerUrl = await BloggerAdapter.createPost(
        params.blogId,
        content.blogger.title,
        content.blogger.content
      );
      results.push({ platform: 'Blogger', url: bloggerUrl || null });
    }

    // Google Sites is heavy (Puppeteer), usually run separately or with caution
    // We'll include it here but it's the most likely to fail/timeout
    /*
    const sitesUrl = await GoogleSitesAdapter.createSite(
      params.district, 
      "VIP Escort", 
      `${params.district}-vip-escort`
    );
    results.push({ platform: 'Google Sites', url: sitesUrl });
    */

    // 4. Unified Victory Report
    await this.sendVictoryReport(params, results);

    return results;
  }

  private static async strikeTelegraph(params: any, content: OmniPlatformContent) {
    try {
      const url = await telegraphService.createPost({
        title: content.blogger.title, // Use blogger title as fallback
        author_name: "DRKCNAY ELITE",
        content: content.blogger.content
      });
      return { platform: 'Telegraph', url };
    } catch (err) {
      return { platform: 'Telegraph', url: null };
    }
  }

  private static async strikeGist(params: any, content: OmniPlatformContent) {
    try {
      const filename = `${params.district}-escort-report.md`;
      const url = await GistAdapter.createGist(filename, content.blogger.content);
      return { platform: 'Gist', url };
    } catch (err) {
      return { platform: 'Gist', url: null };
    }
  }

  private static processTemplate(template: OmniPlatformContent, district: string): OmniPlatformContent {
    const districtName = district.replace(/Escort/i, '').trim();
    const jsonStr = JSON.stringify(template);
    // Replace {{LOCATION}} with the actual district name
    const processedStr = jsonStr.replace(/{{LOCATION}}/g, districtName);
    return JSON.parse(processedStr);
  }

  private static async sendVictoryReport(params: any, results: Array<{ platform: string; url: string | null }>) {
    const successCount = results.filter(r => r.url).length;
    const linksBlock = results
      .map(r => `• <b>${r.platform}:</b> ${r.url ? `<a href="${r.url}">LİNK</a>` : '❌ FAILED'}`)
      .join('\n');

    const report = `
⚔️ <b>[HYDRA-SIEGE: ZAFER RAPORU]</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🎯 <b>HEDEF:</b> ${params.district.toUpperCase()}
🌐 <b>ANA DOMAIN:</b> ${params.host}
📊 <b>BAŞARI:</b> ${successCount} / ${results.length} Platform

🚀 <b>YAYINLANAN BACKLİNK ORDUSU:</b>
${linksBlock}

🧛‍♂️ <i>${params.district} bölgesi Hydra otoritesi altına alındı.</i>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
<i>#HydraSiege #GodMode #SEO_Warfare</i>
    `.trim();

    await TelegramService.sendMessage(report);
  }
}
