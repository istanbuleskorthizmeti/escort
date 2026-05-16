
import { googleIndexing } from "../lib/google-indexing";
import { TelegramService } from "../lib/crm/telegram";
import dotenv from "dotenv";

dotenv.config();

async function runPing() {
    const landingUrl = "https://vipescorthizmeti.com/subeler/bagcilar-escort-elite";
    const mapsUrl = "https://maps.app.goo.gl/MTACMhiPJ3khup2d9";

    console.log("🚀 [HYDRA-PING] Starting Nuclear Broadcast for new location...");

    try {
        // 1. Broadcast Landing Page
        await googleIndexing.broadcast(landingUrl);
        
        // 2. Ping Maps URL (Indirectly via Google Ping)
        // Note: Broadcast usually pings Google/Bing/Yandex for the URL.
        // For the Maps URL, we mainly want Google to see it indexed in Search Console if we had it,
        // but here we just ensure the landing page that links to it is crawled.
        
        console.log(`✅ [SUCCESS] ${landingUrl} broadcasted.`);

        // 🛰️ Telegram Notification
        await TelegramService.sendMessage(`
🎯 <b>YENİ İŞLETME MÜHÜRLENDİ!</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
📍 <b>Konum:</b> Bağcılar Escort Elite
🔗 <b>Landing:</b> ${landingUrl}
🗺️ <b>Maps:</b> ${mapsUrl}
🚀 <b>Aksiyon:</b> Google Indexing & IndexNow (Bing/Yandex) Broadcast Tamamlandı.
💎 <b>Durum:</b> Otorite enjekte edildi.
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>Bağcılar operasyonu başladı kral.</i>
        `.trim());

    } catch (err: any) {
        console.error("❌ [PING-ERROR]", err.message);
    }
}

runPing();
