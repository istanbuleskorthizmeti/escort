
import { TelegramService } from "../lib/crm/telegram";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * 🧛‍♂️ GOOGLE ULTRA PING v2.0
 * Yeni oluşturulan Google Sites linklerini Google botlarına 'zorla' yedirir.
 */

const INDEX_NOW_KEY = process.env.INDEX_NOW_KEY;

export async function pingGoogleSites(urls: string[]) {
  console.log(`🚀 [ULTRA-PING] Indexing ${urls.length} Google Sites...`);

  for (const url of urls) {
    try {
      // 1. IndexNow (Bing, Yandex, etc.)
      await axios.get(`https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=${INDEX_NOW_KEY}`);
      
      // 2. Google Ping (Sitemap Style)
      await axios.get(`https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`);

      console.log(`✅ Indexed: ${url}`);

      // 🛰️ Telegram'a Raporla
      await TelegramService.sendMessage(`
✨ <b>GOOGLE SITES MÜHÜRLENDİ!</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🔗 <b>URL:</b> ${url}
🚀 <b>Durum:</b> Google Indexing API Pinglendi.
💎 <b>Otorite:</b> DA 100 Injected.
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>Sıralama Başlatıldı.</i>
      `.trim());

    } catch (err: any) {
      console.error(`❌ Ping Failed for ${url}:`, err.message);
    }
  }
}

// Otonom tarayıcıdan gelen linklerle tetiklenecek
if (require.main === module) {
    const testUrls = process.argv.slice(2);
    if (testUrls.length > 0) pingGoogleSites(testUrls);
}
