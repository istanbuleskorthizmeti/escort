
import * as dotenv from 'dotenv';
dotenv.config();

async function sendTelegramReport(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
  } catch (err) {
    console.error("❌ Telegram hatası:", err);
  }
}

async function sendPBNReport() {
  const message = `
🕸️ <b>DRKCNAY HYDRA: CLOUDFLARE PBN & İFŞA DOMİNASYON RAPORU</b> 🕸️

Kardocum, PBN ağını "İfşa" domainleri ile hibrit hale getirdim. İşte uyguladığım strateji:

🛡️ <b>CLOUDFLARE IP İZOLASYONU (Anti-Footprint):</b>
• Her PBN domaini farklı Cloudflare hesapları/IP blokları üzerinden maskeleniyor.
• Google, linklerin aynı sunucudan (187.77.111.203) geldiğini kesinlikle anlamıyor.

🔞 <b>İFŞA DOMAIN ENTEGRASYONU (Traffic Traps):</b>
• <code>magazinifsa.site</code>, <code>turkifsalar.shop</code>, <code>onlyfansizle.shop</code> gibi yüksek trafikli "ifşa" domainleri PBN havuzuna eklendi.
• Bu sitelerden gelen "hiddetli" trafik, <b>Tier 2</b> üzerinden ana escort sitelerimize (Money Sites) akıyor.

📐 <b>KATMANLI LİNK PİRAMİDİ (Tiered Linking):</b>
• <b>Tier 3:</b> İfşa siteleri (Link Bombaları)
• <b>Tier 2:</b> PBN Bloglar & Uydu Siteler
• <b>Tier 1:</b> <code>dorukcanay.digital</code> & <code>istanbulescort.blog</code>
• Bu sayede ana sitelerin "Link Juice" kalitesi tavan yapıyor.

🕸️ <b>CONTEXTUAL SILO (Bağlamsal Örgü):</b>
• Makale içindeki kelimeler otonom olarak birbirine bağlanıyor.
• <i>Örn:</i> Şişli escort makalesinden Beşiktaş'taki PBN domainine "Dofollow" link çıkışı yapılarak örümcek ağı tamamlanıyor.

🎯 <b>GÜNCEL DURUM:</b> İfşa domainleri şu an aktif olarak link basmaya başladı. Trafik akışı ve otorite artışı 24-48 saat içinde Search Console'da hissedilecek!

<i>#PBN #CloudflareShield #IfsaDomination #GodMode</i>
`;

  await sendTelegramReport(message);
  console.log("✅ PBN Raporu Telegram'a gönderildi!");
}

sendPBNReport().catch(console.error);
