import { Telegraf, Markup } from 'telegraf';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 🪐 DRKCNAY TELEGRAM BROADCASTER
 * Auto-posts images, SEO links, and CTA messages to channels/groups.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
// This must be a comma-separated list of PUBLIC channel IDs (e.g., -100123456789)
const TARGET_CHANNELS = (process.env.TELEGRAM_TARGET_CHANNELS || '').split(',').map(c => c.trim()).filter(Boolean);
const WHATSAPP_NUMBER = "+905520949245";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Merhaba, detaylı bilgi almak istiyorum.")}`;

// We only initialize the Telegraf instance if a token exists.
const bot = new Telegraf(BOT_TOKEN);

export const TelegramBroadcaster = {
  /**
   * Posts a random VIP image with a promotional caption to all target channels.
   */
  async broadcastPromo() {
    if (!BOT_TOKEN || TARGET_CHANNELS.length === 0) {
      console.log("⚠️ [TG-BROADCAST] Bot token or target channels not configured.");
      return;
    }

    const imageDir = path.join(process.cwd(), 'public/vitrin');
    let images: string[] = [];
    
    try {
      images = fs.readdirSync(imageDir).filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'));
    } catch (err) {
      console.log("⚠️ [TG-BROADCAST] Profile images directory not found.");
      return;
    }

    if (images.length === 0) {
      console.log("⚠️ [TG-BROADCAST] No images found for broadcasting.");
      return;
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imagePath = path.join(imageDir, randomImage);

    const SITE_URL = 'https://vipescorthizmeti.com';
    const captions = [
      `🔥 <b>VIP Escort Hizmetleri - Sınırsız Hizmet</b>\n\nİstanbul'un en elit ve gizli hizmeti. Gerçek profiller, %100 memnuniyet garantisi.\n\n🔗 <a href="${SITE_URL}">Tüm Kızlarımızı Gör (Tıkla Sitemize Git)</a>`,
      `✨ <b>Lüks ve İhtiras Bir Arada</b>\n\nSıradanlığı unutun. En özel anlar için özenle seçilmiş elit kadromuzla tanışın.\n\n🔗 <a href="${SITE_URL}">Kataloğu İncele</a>\n📲 <b>VIP İletişim:</b> <a href="${WHATSAPP_LINK}">WhatsApp'tan Randevu Al</a>`,
      `💎 <b>Premium Escort Deneyimi</b>\n\nGizlilik, kalite ve sınırsız eğlence. Özel görüşmeleriniz için buradayız.\n\n🔗 <b>Web Sitemiz:</b> <a href="${SITE_URL}">vipescorthizmeti.com</a>`,
      `🔥 <b>Yeni Vitrin Görsellerimiz Güncellendi!</b>\n\nEn iyi kalite ve sınırsız deneyim. Yeni kızlarımız vitrinde yerini aldı.\n\n🔗 <a href="${SITE_URL}">Resme Tıkla Sitemize Git!</a>\n📲 <a href="${WHATSAPP_LINK}">Hemen WhatsApp'tan Ulaşın</a>`
    ];

    const caption = captions[Math.floor(Math.random() * captions.length)];

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url('📲 WhatsApp\'tan Yaz', WHATSAPP_LINK)],
      [Markup.button.url('🌐 Kataloğu Gör', 'https://vipescorthizmeti.com')]
    ]);

    console.log(`🚀 [TG-BROADCAST] Fırlatılıyor: ${randomImage}`);

    for (const channel of TARGET_CHANNELS) {
      try {
        // ⚠️ CRITICAL: Ensure we are NOT accidentally broadcasting to the ADMIN chat
        if (channel === process.env.TELEGRAM_CHAT_ID) {
          console.warn(`🛑 [TG-BROADCAST] DİKKAT: Admin grubuna (${channel}) toplu mesaj atılmaya çalışıldı, engellendi.`);
          continue;
        }

        await bot.telegram.sendPhoto(channel, { source: imagePath }, {
          caption: caption,
          parse_mode: 'HTML',
          ...keyboard
        });
        console.log(`✅ [TG-BROADCAST] Gönderildi: ${channel}`);
      } catch (err: any) {
        console.error(`❌ [TG-BROADCAST] Hata (${channel}):`, err.message);
      }
    }
  },

  /**
   * Broadcasts a text message (e.g., a new SEO link) to all target channels.
   */
  async broadcastLink(title: string, url: string, description: string) {
    if (!BOT_TOKEN || TARGET_CHANNELS.length === 0) return;

    const message = `
🚀 <b>${title}</b>

${description}

🔗 <a href="${url}">Hemen İncele</a>
    `.trim();

    for (const channel of TARGET_CHANNELS) {
      try {
        // ⚠️ CRITICAL: Ensure we are NOT accidentally broadcasting to the ADMIN chat
        if (channel === process.env.TELEGRAM_CHAT_ID) {
          console.warn(`🛑 [TG-BROADCAST] DİKKAT: Admin grubuna (${channel}) link fırlatılmaya çalışıldı, engellendi.`);
          continue;
        }

        await bot.telegram.sendMessage(channel, message, {
          parse_mode: 'HTML',
          link_preview_options: { is_disabled: false }
        });
      } catch (err: any) {
        console.error(`❌ [TG-BROADCAST] Link gönderim hatası (${channel}):`, err.message);
      }
    }
  }
};
