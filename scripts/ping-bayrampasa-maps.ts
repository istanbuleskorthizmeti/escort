
import { googleIndexing } from "../lib/google-indexing";
import { TelegramService } from "../lib/crm/telegram";
import dotenv from "dotenv";

dotenv.config();

async function runPing() {
    const mapsUrl = "https://maps.app.goo.gl/hNq8z4htQVpwL8KG9";
    const iframeUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5941.904782347167!2d28.900171167755694!3d41.03983291142028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabb20713024fb%3A0x4b7ad63607485ae1!2sBayrampa%C5%9Fa%20Escort!5e0!3m2!1str!2str!4v1778938305862!5m2!1str!2str";
    const landingUrl = "https://vipescorthizmeti.com/subeler/bayrampasa-escort";

    console.log("🚀 [HYDRA-PING] Starting Nuclear Broadcast for Bayrampaşa Escort...");

    try {
        // 1. Broadcast Landing Page
        await googleIndexing.broadcast(landingUrl);
        
        // 2. Ping Maps URL specifically (Using the indexing API for the maps redirect link)
        await googleIndexing.notifyUpdate(mapsUrl);
        
        console.log(`✅ [SUCCESS] ${landingUrl} and ${mapsUrl} broadcasted.`);

        // 🛰️ Telegram Notification
        await TelegramService.sendMessage(`
🎯 <b>İŞLETME MÜHÜRLENDİ: BAYRAMPAŞA!</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
📍 <b>İşletme:</b> Bayrampaşa Escort
🔗 <b>Landing:</b> ${landingUrl}
🗺️ <b>Maps:</b> ${mapsUrl}
🚀 <b>Aksiyon:</b> Google Indexing API & IndexNow Broadcast Tamamlandı.
💎 <b>Durum:</b> Harita sinyalleri güçlendirildi, otorite enjekte edildi.
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>Bayrampaşa artık bizim kardaşım.</i>
        `.trim());

    } catch (err: any) {
        console.error("❌ [PING-ERROR]", err.message);
    }
}

runPing();
