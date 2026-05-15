export async function sendTelegramReport(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("❌ Telegram yetkileri eksik!");
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    if (!response.ok) {
      console.error("❌ Telegram raporu gönderilemedi:", await response.text());
    }
  } catch (err) {
    console.error("❌ Telegram API hatası:", err);
  }
}

export function formatReportMessage(type: string, data: any) {
  const timestamp = new Date().toLocaleString('tr-TR');
  const serverNode = process.env.NODE_NAME || process.env.HOSTNAME || 'DRKCNAY-Main';
  
  if (type === 'REDIRECT') {
    return `🚀 <b>[HYDRA REDIRECT]</b>\n\n` +
           `🌍 <b>Node:</b> ${serverNode}\n` +
           `📍 <b>Domain:</b> ${data.host}\n` +
           `👤 <b>Rota:</b> ${data.pathname}\n` +
           `📱 <b>Hedef:</b> WhatsApp\n` +
           `⏰ <b>Zaman:</b> ${timestamp}\n\n` +
           `<i>#Leads #DRKCNAYElite</i>`;
  }

  if (type === 'DEPLOY') {
    return `⚔️ <b>[HYDRA DEPLOY]</b>\n\n` +
           `🖥️ <b>Sunucu:</b> ${data.server || serverNode}\n` +
           `✅ <b>Durum:</b> Tam Takır Aktif!\n` +
           `⏰ <b>Zaman:</b> ${timestamp}\n\n` +
           `<i>#Cluster #WarriorMode</i>`;
  }

  if (type === 'BATCH_REPORT') {
    return `🏆 <b>[HYDRA BATCH REPORT]</b>\n\n` +
           `🌍 <b>Node:</b> ${serverNode}\n` +
           `📦 <b>İşlenen Kayıt:</b> ${data.processed}\n` +
           `✅ <b>Başarılı (WP/GH):</b> ${data.success}\n` +
           `❌ <b>Başarısız:</b> ${data.failed}\n` +
           `⏱️ <b>Süre:</b> ${data.duration}s\n\n` +
           `<i>#Phase4 #GlobalSyndicate #GodMode</i>`;
  }

  if (type === 'VISITOR') {
    return `👤 <b>[HYDRA YENİ ZİYARETÇİ]</b>\n\n` +
           `🌐 <b>Domain:</b> ${data.host}\n` +
           `📍 <b>Sayfa:</b> ${data.pathname}\n` +
           `🔗 <b>Kaynak:</b> ${data.referrer || 'Doğrudan Giriş'}\n` +
           `⏰ <b>Zaman:</b> ${timestamp}\n\n` +
           `<i>#Traffic #WarriorMode</i>`;
  }

  return `📢 <b>[HYDRA NOTIFICATION]</b>\n\n${data?.message || JSON.stringify(data) || 'Bilinmeyen Bildirim'}`;
}
