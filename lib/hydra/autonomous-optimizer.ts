import { prisma } from '../prisma';
import { googleAuth } from '../google-auth';
import { generateGodModeOmniContent } from '../ai-seo';
import { TelegramService } from '../crm/telegram';

/**
 * 🧠 HYDRA AUTONOMOUS OPTIMIZER (VIP Elite v4.0)
 * The self-healing brain that acts on Intelligence Engine data.
 */

export class HydraAutonomousOptimizer {
  
  static async processHealthReport(siteId: string, data: any) {
    console.log(`🧠 [OPTIMIZER] Analyzing Site ID: ${siteId}...`);
    const site = await prisma.site.findUnique({ where: { id: siteId } });
    if (!site) return;

    // 🚩 KURAL 1: İndex Kaybı Tespiti
    if (data.impressions === 0) {
      console.log(`🚨 [CRITICAL] Index failure detected on ${site.domain}. Triggering Emergency Recovery...`);
      await this.triggerEmergencyIndexing(site);
    }

    // 🚩 KURAL 2: Düşük Performanslı İçerik (Stale Content)
    if (data.clicks < 5 && data.impressions > 500) {
      console.log(`🟡 [OPTIMIZER] Low CTR on ${site.domain}. Regenerating Meta/Content for better conversion...`);
      await this.optimizeContentForCTR(site);
    }

    // 🚩 KURAL 3: Trend Yakalama (SGE Optimization)
    if (data.trendingKeywords && data.trendingKeywords.length > 0) {
       console.log(`🚀 [OPTIMIZER] New trend detected for ${site.domain}. Seeding fresh pages...`);
       await this.seedTrendingPages(site, data.trendingKeywords);
    }
  }

  private static async triggerEmergencyIndexing(site: any) {
    try {
      // Tüm ana sayfaları Google'a tekrar pushla
      const pages = await prisma.pageContent.findMany({ where: { siteId: site.id } });
      for (const page of pages) {
        await googleAuth.forceIndexUrl(`https://${site.domain}/${page.slug}`);
      }
      await TelegramService.sendMessage(`🛠️ <b>AUTONOMOUS FIX:</b> ${site.domain} için index sorunu tespit edildi ve Nuclear Indexing tetiklendi.`);
    } catch (e: any) {
      await TelegramService.sendMessage(`🚨 <b>MANUAL ACTION REQUIRED:</b> ${site.domain} için otomatik indexleme yapılamadı.
      
      <b>Sebep:</b> ${e.message}
      <b>Yapman Gereken Hamle:</b> Google Search Console'a girip ${site.domain} için Manuel URL Denetimi yap ve 'Dizine Eklenmesini İste' butonuna bas. Sen bunu yapınca ben tekrar saldırıya geçeceğim!`);
    }
  }

  private static async optimizeContentForCTR(site: any) {
    try {
      const topPage = await prisma.pageContent.findFirst({
          where: { siteId: site.id },
          orderBy: { updatedAt: 'asc' }
      });
      
      if (topPage) {
          const newContent = await generateGodModeOmniContent({ city: 'İstanbul', host: site.domain });
          await prisma.pageContent.update({
              where: { id: topPage.id },
              data: {
                  title: newContent.wordpress.title,
                  content: newContent.wordpress.content,
                  updatedAt: new Date()
              }
          });
          await TelegramService.sendMessage(`💎 <b>AUTONOMOUS OPTIMIZATION:</b> ${site.domain} için CTR düşüklüğü giderildi.`);
      }
    } catch (e: any) {
      await TelegramService.sendMessage(`⚠️ <b>MANUAL CONTENT CHECK:</b> ${site.domain} içeriği otomatik güncellenemedi. 
      <b>Hamle:</b> Admin panelden ${site.domain} başlığını daha vurucu bir anahtar kelimeyle manuel güncelle kardo!`);
    }
  }

  private static async seedTrendingPages(site: any, keywords: string[]) {
      // Trend olan kelimeler için anında yeni sayfalar oluştur
      for (const kw of keywords.slice(0, 3)) {
          const slug = kw.toLowerCase().replace(/\s+/g, '-');
          const content = await generateGodModeOmniContent({ city: 'İstanbul', host: site.domain, nicheType: kw });
          await prisma.pageContent.create({
              data: {
                  siteId: site.id,
                  slug: slug,
                  title: content.wordpress.title,
                  content: content.wordpress.content
              }
          });
      }
  }
}
