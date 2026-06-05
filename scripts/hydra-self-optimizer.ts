import { prisma } from "../lib/prisma";
import { omniAI } from "../lib/ai-provider";
import { TelegramService } from "../lib/crm/telegram";

interface OptimizationCandidate {
  slug: string;
  siteId: string;
  domain: string;
  currentTitle: string;
  currentContent: string;
  clicks: number;
  avgPosition: number;
}

export class HydraSelfOptimizer {
  private readonly POSITION_THRESHOLD = 15.0; // Sayfa 1.5'ten kötü olmayanlar
  private readonly CLICK_THRESHOLD = 5;       // Tıklaması düşük ama potansiyeli yüksek olanlar

  /**
   * 📊 Performans metriklerini analiz et ve optimize edilecek sayfaları bul
   */
  public async analyzeAndOptimize(): Promise<void> {
    try {
      console.log("📊 [OPTIMIZER] SEO Performans Verileri Sorgulanıyor...");

      // 1. RankingDelta'dan potansiyeli yüksek ama performansı düşük anahtar kelimeleri çek
      const highPotentialKeywords = await prisma.rankingDelta.findMany({
        where: {
          position: { lte: this.POSITION_THRESHOLD },
          clicks: { lte: this.CLICK_THRESHOLD }
        },
        orderBy: { position: "asc" },
        take: 20
      });

      if (highPotentialKeywords.length === 0) {
        console.log("ℹ️ [OPTIMIZER] Kriterlere uyan optimizasyon hedefi bulunamadı.");
        return;
      }

      const candidates: OptimizationCandidate[] = [];

      for (const kw of highPotentialKeywords) {
        const targetSlug = kw.keyword.toLowerCase().replace(/\s+/g, "-");
        
        const page = await prisma.pageContent.findFirst({
          where: { slug: targetSlug },
          include: { site: true }
        });

        if (page?.content && page.site) {
          candidates.push({
            slug: page.slug,
            siteId: page.siteId || "",
            domain: page.site.domain,
            currentTitle: page.title || "",
            currentContent: page.content,
            clicks: kw.clicks,
            avgPosition: kw.position
          });
        }
      }

      console.log(`🎯 [OPTIMIZER] ${candidates.length} adet optimizasyon adayı tespit edildi.`);

      for (const candidate of candidates) {
        await this.optimizePage(candidate);
      }

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("❌ [OPTIMIZER-ERROR] Analiz başarısız:", msg);
      await TelegramService.sendMessage(`⚠️ <b>HYDRA OPTIMIZER HATA</b>\nNeden: <code>${msg}</code>`).catch(() => {});
    }
  }

  /**
   * 🧠 DeepSeek-Reasoner (R1) kullanarak içeriği yeniden optimize et
   */
  private async optimizePage(candidate: OptimizationCandidate): Promise<void> {
    try {
      console.log(`🧬 [YENİDEN YAZILIYOR] Semantik ağırlık optimize ediliyor: ${candidate.domain}/${candidate.slug}`);

      // WhatsApp tıklama dönüşümlerini sorgula
      const conversionCount = await prisma.whatsAppClick.count({
        where: { referer: { contains: candidate.domain } }
      });

      const optimizationPrompt = `
        Sen son derece gelişmiş bir Semantik Arama Motoru Optimizasyonu (SEO) yapay zekasısın.
        Şu sayfayı optimize ediyoruz: https://${candidate.domain}/${candidate.slug}
        
        GÜNCEL PERFORMANS VERİLERİ:
        - Ortalama Sıralama: ${candidate.avgPosition}
        - Organik Tıklama: ${candidate.clicks}
        - Dönüşüm (WhatsApp Tıklaması): ${conversionCount}

        PROBLEM:
        Bu sayfa sıralama olarak ilk sayfaya çok yakın ancak organik tıklaması veya dönüşüm oranı düşük.

        GÖREV:
        Mevcut HTML içeriği analiz et. Semantik yoğunluğunu (LSI), okunabilirliği ve kullanıcıyı harekete geçiren (CTA) yapıları optimize et.
        Ana yapıyı bozmadan başlıkları daha çekici hale getir, sıkça sorulan sorular (FAQ) şeması ekle ve yerel anahtar kelimeleri daha doğal yay.

        MEVCUT İÇERİK:
        ${candidate.currentContent}
      `;

      const optimizedHTML = await omniAI.generate(optimizationPrompt, {
        provider: "deepseek",
        model: "deepseek-reasoner",
        temperature: 0.6,
        max_tokens: 8000
      });

      await prisma.pageContent.update({
        where: {
          slug_siteId: {
            slug: candidate.slug,
            siteId: candidate.siteId
          }
        },
        data: {
          content: optimizedHTML,
          updatedAt: new Date()
        }
      });

      await TelegramService.sendMessage(`
⚙️ <b>HYDRA OPTIMIZER: OTONOM DÜZELTME BAŞARILI</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🌐 <b>Domain:</b> <code>${candidate.domain}</code>
📍 <b>Rota:</b> <code>/${candidate.slug}</code>
📊 <b>Sıralama:</b> <code>${candidate.avgPosition} (Tık: ${candidate.clicks})</code>
🔥 <b>Dönüşüm:</b> <code>${conversionCount} WhatsApp Tıklaması</code>
🧠 <b>Model:</b> DeepSeek-R1 Autopilot
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🚀 <i>Sayfa semantik dengesi CTR için optimize edildi.</i>
      `.trim()).catch(() => {});

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`❌ [OPTIMIZER-ERROR] Hata: ${candidate.domain}/${candidate.slug}`, msg);
    }
  }
}

if (require.main === module) {
  const optimizer = new HydraSelfOptimizer();
  optimizer.analyzeAndOptimize().catch(console.error);
}
