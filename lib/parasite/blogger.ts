
import { google } from 'googleapis';
import { TelegramService } from '../crm/telegram';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 🧛‍♂️ HYDRA BLOGGER ADAPTER (SMART MODE)
 * Automates high-authority blog creation with anti-spam protections.
 */

const auth = new google.auth.GoogleAuth({
  keyFile: 'google-key.json',
  scopes: ['https://www.googleapis.com/auth/blogger'],
});

const blogger = google.blogger({ version: 'v3', auth });

// Static tracker to prevent rapid-fire posting across the runtime
let lastPostTimestamp = 0;
const MIN_POST_GAP = 5 * 60 * 1000; // 5 minutes minimum gap

export class BloggerAdapter {
  /**
   * Post to Blogger with anti-spam safety
   */
  static async createPost(blogId: string, title: string, content: string) {
    const now = Date.now();
    const timeSinceLastPost = now - lastPostTimestamp;

    if (timeSinceLastPost < MIN_POST_GAP) {
      const waitTime = MIN_POST_GAP - timeSinceLastPost;
      console.log(`⏳ [BLOGGER] Anti-Spam Safety: Waiting ${Math.round(waitTime / 1000)}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    console.log(`🚀 [BLOGGER] Posting (Smart Mode): ${title}...`);
    
    try {
      const res = await blogger.posts.insert({
        blogId: blogId,
        requestBody: {
          title: title,
          content: content,
        },
      });

      lastPostTimestamp = Date.now();
      const liveUrl = res.data.url;
      
      await TelegramService.sendMessage(`
📝 <b>BLOGGER: AKILLI YAYIN TAMAMLANDI</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🎯 <b>Başlık:</b> ${title}
🔗 <b>Link:</b> ${liveUrl}
🛡️ <b>Spam Koruması:</b> Aktif (5dk Delay)
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>Blogger otoritesi Hydra ağına güvenle eklendi.</i>
      `.trim());

      return liveUrl;
    } catch (err: any) {
      console.error("❌ [BLOGGER] Error:", err.message);
      if (err.message.includes("quota") || err.message.includes("rateLimit")) {
          await TelegramService.sendMessage("⚠️ <b>BLOGGER KRİTİK:</b> Kota doldu veya spam filtresine takıldı. İşlem durduruldu.");
      }
      return null;
    }
  }

  /**
   * Generates natural anchor text variations
   */
  static getRandomAnchor(zone: string): string {
    const anchors = [
      `${zone} VIP Katalog`,
      `${zone} Elit Profiller`,
      `${zone} Resmi Web Sitesi`,
      `${zone} Güncel Escort Rehberi`,
      `Resmi Katalog: ${zone}`,
      `Elite Selection ${zone}`,
      `Verified Partners ${zone}`
    ];
    return anchors[Math.floor(Math.random() * anchors.length)];
  }
}
