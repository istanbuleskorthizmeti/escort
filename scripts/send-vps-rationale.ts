
import { TelegramService } from "../lib/crm/telegram";
import dotenv from 'dotenv';

dotenv.config();

async function sendRationale() {
    const message = `
🏛️ <b>HYDRA NETWORK: STRATEJİK VPS OPERASYONU</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🎯 <b>HEDEF:</b> 7/24 Kesintisiz SEO Dominasyonu
💎 <b>OPERASYON:</b> Windows VPS Migrasyonu
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

<b>NEDEN BU YATIRIMI YAPIYORUZ?</b>

1️⃣ <b>SÜREKLİ FETİH:</b> Yerel bilgisayarın kaynaklarını tüketmeden, 365 gün 24 saat otonom Google Sites ve Parasite Hub inşası.
2️⃣ <b>GÜVENLİ OTURUM (TRUST):</b> Google Workspace hesabının 'Güvenli Cihaz' olarak sunucuya mühürlenmesi ve 2FA engelinin kalıcı olarak aşılması.
3️⃣ <b>GİZLİLİK (PROXY-INJECTION):</b> Sunucu IP'sinin maskelenerek, her işlemin organik bir kullanıcı gibi Türkiye geneline yayılması.
4️⃣ <b>ÖLÇEKLENEBİLİRLİK:</b> Aynı anda 50+ tarayıcı penceresi açarak, tek bir gün içinde 500+ backlink ve site inşası kapasitesine ulaşmak.

🚀 <i>"Yerel bilgisayarda işlem, uzak sunucuda savaş."</i>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <b>DRKCNAY 2026 ELITE STANDARTS</b>
    `.trim();

    try {
        await TelegramService.sendMessage(message);
        console.log("✅ [SUCCESS] Stratejik Rapor Telegram'a mühürlendi.");
    } catch (err: any) {
        console.error("❌ Rapor gönderilemedi:", err.message);
    }
}

sendRationale();
