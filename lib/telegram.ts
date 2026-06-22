import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

export async function sendTelegramReport(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("[TELEGRAM] Missing Bot Token or Chat ID in environment.");
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
    console.log("✅ [TELEGRAM] Message sent successfully.");
  } catch (e: any) {
    console.error("❌ [TELEGRAM] Failed to send message:", e.response?.data || e.message);
  }
}

export async function sendTelegramPhoto(photoPath: string, caption?: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("[TELEGRAM] Missing Bot Token or Chat ID in environment.");
    return;
  }

  try {
    if (!fs.existsSync(photoPath)) {
      console.error(`[TELEGRAM] Photo path not found: ${photoPath}`);
      return;
    }

    const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;
    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('photo', fs.createReadStream(photoPath));
    if (caption) {
      form.append('caption', caption);
      form.append('parse_mode', 'HTML');
    }

    await axios.post(url, form, {
      headers: form.getHeaders()
    });
    console.log("✅ [TELEGRAM] Photo sent successfully.");
  } catch (e: any) {
    console.error("❌ [TELEGRAM] Failed to send photo:", e.response?.data || e.message);
  }
}

export function formatReportMessage(type: string, data: any) {
  const timestamp = new Date().toLocaleString('tr-TR');
  const serverNode = process.env.NODE_NAME || process.env.HOSTNAME || 'DRKCNAY-Ana-Sunucu';
  
  if (type === 'REDIRECT') {
    return `🚀 <b>[HYDRA YÖNLENDİRME]</b>\n\n` +
           `🌍 <b>Düğüm:</b> ${serverNode}\n` +
           `📍 <b>Domain:</b> ${data.host}\n` +
           `👤 <b>Rota:</b> ${data.pathname}\n` +
           `📱 <b>Hedef:</b> WhatsApp\n` +
           `⏰ <b>Zaman:</b> ${timestamp}\n\n` +
           `<i>#Leads #DRKCNAYElite</i>`;
  }

  if (type === 'DEPLOY') {
    return `⚔️ <b>[HYDRA DAĞITIM]</b>\n\n` +
           `🖥️ <b>Sunucu:</b> ${data.server || serverNode}\n` +
           `✅ <b>Durum:</b> Tam Takır Aktif!\n` +
           `⏰ <b>Zaman:</b> ${timestamp}\n\n` +
           `<i>#Cluster #WarriorMode</i>`;
  }

  if (type === 'BATCH_REPORT') {
    return `🏆 <b>[HYDRA TOPLU RAPOR]</b>\n\n` +
           `🌍 <b>Düğüm:</b> ${serverNode}\n` +
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

  return `📢 <b>[HYDRA BİLDİRİM]</b>\n\n${data?.message || JSON.stringify(data) || 'Bilinmeyen Bildirim'}`;
}
