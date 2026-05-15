
import { google } from 'googleapis';
import { TelegramService } from '../crm/telegram';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 🧛‍♂️ HYDRA BLOGGER ADAPTER
 * Automates high-authority blog creation and posting on Blogspot.
 */

const auth = new google.auth.GoogleAuth({
  keyFile: 'google-key.json',
  scopes: ['https://www.googleapis.com/auth/blogger'],
});

const blogger = google.blogger({ version: 'v3', auth });

export class BloggerAdapter {
  static async createPost(blogId: string, title: string, content: string) {
    console.log(`🚀 [BLOGGER] Posting: ${title}...`);
    
    try {
      const res = await blogger.posts.insert({
        blogId: blogId,
        requestBody: {
          title: title,
          content: content,
        },
      });

      const liveUrl = res.data.url;
      await TelegramService.sendMessage(`
📝 <b>BLOGGER: YENİ MAKALE YAYINDA</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🎯 <b>Başlık:</b> ${title}
🔗 <b>Link:</b> ${liveUrl}
🚀 <b>Durum:</b> Google Indexing API'ye iletildi.
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>Blogger otoritesi Hydra ağına eklendi.</i>
      `.trim());

      return liveUrl;
    } catch (err: any) {
      console.error("❌ [BLOGGER] Error:", err.message);
      return null;
    }
  }
}
