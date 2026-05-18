import { GSCService } from "./gsc";
import { prisma } from "../prisma";
import { TelegramService } from "../crm/telegram";

/**
 * DRKCNAY RANKING TRACKER
 * Monitors GSC Delta and alerts of any position changes.
 */
export class RankingTracker {
  private static instance: RankingTracker;
  private gsc = GSCService.getInstance();
  private keywords = [
    "istanbul escort", "beşiktaş escort", "bebek escort", 
    "bakırköy escort", "ankara vip escort", "izmir escort",
    "şişli escort", "kadıköy escort", "antalya escort",
    "atasehir escort", "beylikduzu escort"
  ];

  public static getInstance(): RankingTracker {
    if (!RankingTracker.instance) {
      RankingTracker.instance = new RankingTracker();
    }
    return RankingTracker.instance;
  }

  async trackDeltas() {
    console.log("📈 [RANKING_TRACKER] Initializing Delta Check...");
    
    try {
      const currentRankings = await this.gsc.getKeywordRankings(this.keywords);
      
      for (const current of currentRankings) {
        if (current.position === 'N/A') continue;

        const lastRecord = await prisma.rankingDelta.findFirst({
          where: { keyword: current.keyword },
          orderBy: { timestamp: 'desc' }
        });

        const currentPos = parseFloat(current.position.toString());

        if (!lastRecord) {
          // Initial record
          await prisma.rankingDelta.create({
            data: {
              keyword: current.keyword,
              position: currentPos,
              clicks: current.clicks || 0,
              change: 0
            }
          });
          continue;
        }

        const delta = lastRecord.position - currentPos;

        if (delta !== 0) {
          console.log(`🎯 [DELTA_DETECTED] ${current.keyword}: ${lastRecord.position} -> ${currentPos} (${delta > 0 ? '+' : ''}${(Number(delta) || 0).toFixed(1)})`);
          
          // Save new delta
          await prisma.rankingDelta.create({
            data: {
              keyword: current.keyword,
              position: currentPos,
              clicks: current.clicks || 0,
              change: delta
            }
          });

          // Notify Telegram
          await this.notifyDelta(current.keyword, lastRecord.position, currentPos, delta, current.clicks || 0);
        }
      }
    } catch (err: any) {
      console.error("❌ [RANKING_TRACKER] Delta Check Failed:", err.message);
    }
  }

  private async notifyDelta(keyword: string, oldPos: number, newPos: number, delta: number, clicks: number) {
    const icon = delta > 0 ? "🚀 UP" : "📉 DOWN";
    const statusIcon = delta > 0 ? "✅" : "⚠️";
    
    const message = `
${statusIcon} <b>SIRALAMA GÜNCELLENDİ! [${icon}]</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🎯 <b>Keyword:</b> <code>${keyword}</code>
⭐ <b>Yeni Pozisyon:</b> <code>${(Number(newPos) || 0).toFixed(1)}</code>
🖱️ <b>Toplam Tıklama:</b> <code>${clicks}</code>
🔄 <b>Değişim:</b> <code>${delta > 0 ? '+' : ''}${(Number(delta) || 0).toFixed(1)}</code> basamak
📉 <b>Eski Pozisyon:</b> ${(Number(oldPos) || 0).toFixed(1)}
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🚀 <i>DRKCNAY Elite Otonom Dominasyon Yayılıyor.</i>
    `.trim();

    await TelegramService.sendMessage(message);
  }
}
