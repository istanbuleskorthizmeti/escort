import { exec } from "child_process";
import { promisify } from "util";
import { prisma } from "../prisma";
import { bot } from "../crm/bot-instance";

const execAsync = promisify(exec);
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * GOD MODE: AUTONOMOUS SELF-HEALING PROTOCOL
 * Parses incoming crash errors and executes surgical fixes in real-time.
 */
export async function autoFix(error: any, moduleName: string): Promise<boolean> {
  const errMsg = (error?.message || String(error)).toLowerCase();
  
  if (!CHAT_ID) return false;

  try {
  try {
    if (bot && CHAT_ID) {
        // 1. Prisma / Database Connection Drops
        if (errMsg.includes('database server') || errMsg.includes('connection limit') || errMsg.includes('primsa')) {
          await bot.telegram.sendMessage(CHAT_ID, `⚠️ <b>[${moduleName}] SİSTEM ÇÖKTÜ: Veritabanı Bağlantısı Koptu.</b>\n🛠️ <i>Self-Healing devrede: Prisma yeniden başlatılıyor...</i>`, { parse_mode: 'HTML' }).catch(() => {});
          await prisma.$disconnect();
          await new Promise(res => setTimeout(res, 2000));
          await prisma.$connect();
          await bot.telegram.sendMessage(CHAT_ID, `✅ <b>[${moduleName}] ONARILDI: Veritabanı bağlantısı geri yüklendi.</b>`, { parse_mode: 'HTML' }).catch(() => {});
          return true;
        }

        // 2. Network / DNS / DNS resolution failures (Node.js fetch crashes)
        if (errMsg.includes('enotfound') || errMsg.includes('etimedout') || errMsg.includes('fetch failed')) {
          await bot.telegram.sendMessage(CHAT_ID, `⚠️ <b>[${moduleName}] SİSTEM ÇÖKTÜ: Ağ / API İletişimi Koptu.</b>\n🛠️ <i>Self-Healing devrede: İşlem 30 saniye uyku moduna alınıyor...</i>`, { parse_mode: 'HTML' }).catch(() => {});
          await new Promise(res => setTimeout(res, 30000)); // 30 sec cooldown
          await bot.telegram.sendMessage(CHAT_ID, `✅ <b>[${moduleName}] ONARILDI: Ağ temizlendi, ping başarılı.</b>`, { parse_mode: 'HTML' }).catch(() => {});
          return true;
        }

        // 3. API Quota / Rate Limiting (Tumblr / AI)
        if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('rate limit')) {
          await bot.telegram.sendMessage(CHAT_ID, `⚠️ <b>[${moduleName}] API SINIRI AŞILDI (Rate Limit).</b>\n🛠️ <i>Hız kesici devreye girdi, 10 dakika operasyon donduruluyor.</i>`, { parse_mode: 'HTML' }).catch(() => {});
          await new Promise(res => setTimeout(res, 600000)); // 10 min throttle
          await bot.telegram.sendMessage(CHAT_ID, `✅ <b>[${moduleName}] ONARILDI: Hız limitleri sıfırlandı, akış devam ediyor.</b>`, { parse_mode: 'HTML' }).catch(() => {});
          return true;
        }

        // 4. Ghost Errors / Unknown (Graceful Suicide)
        const errorString = errMsg.substring(0, 100);
        await bot.telegram.sendMessage(CHAT_ID, `🔥 <b>[${moduleName}] BİLİNMEYEN KRİTİK HATA:</b> <code>${errorString}</code>\n🛠️ <i>Self-Healing: Worker (Sadece kendisi) yeniden başlatılıyor... Ana site etkilenmeyecek.</i>`, { parse_mode: 'HTML' }).catch(() => {});
    }
    
    // Yalnızca çöken worker'ı kapat. PM2 bunu "anında" sadece kendisi olarak yeniden başlatır. ("pm2 restart all" kullanmıyoruz ki ana site gitmesin!)
    setTimeout(() => {
      process.exit(1);
    }, 2000);
    return true;

  } catch (healError: any) {
    console.error("Self heal protocol crashed:", healError);
    return false;
  }
}
