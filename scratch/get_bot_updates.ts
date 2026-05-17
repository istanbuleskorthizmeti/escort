
import * as dotenv from 'dotenv';
dotenv.config();

async function getUpdates() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
        console.error("❌ Token bulunamadı!");
        return;
    }

    const url = `https://api.telegram.org/bot${token}/getUpdates`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("🛰️ BOT UPDATES:");
        console.log(JSON.stringify(data, null, 2));
        
        if (data.result && data.result.length > 0) {
            const lastMessage = data.result[data.result.length - 1];
            if (lastMessage.message && lastMessage.message.chat) {
                console.log("\n🎯 SON MESAJ GELEN GRUP:");
                console.log(`ID: ${lastMessage.message.chat.id}`);
                console.log(`TITLE: ${lastMessage.message.chat.title || 'Özel Mesaj'}`);
            }
        } else {
            console.log("\n⚠️ Bot henüz hiç mesaj almamış. Lütfen gruba bir mesaj yaz kanka.");
        }
    } catch (e: any) {
        console.error("❌ Hata:", e.message);
    }
}

getUpdates();
