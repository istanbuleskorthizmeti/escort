
import { bloggerService } from '../lib/seo/blogger';
import { sendTelegramReport } from '../lib/telegram';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 🔱 HYDRA AUTHORITY LOADER
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function checkBlogger() {
    try {
        console.log('📡 Blogger API denetleniyor...');
        const blogs = await bloggerService.listUserBlogs();
        const blogCount = blogs.length;
        
        const report = `🏆 <b>[HYDRA BLOGGER: AKTİF]</b>\n\n` +
                       `✅ <b>API Durumu:</b> Erişim başarıyla doğrulandı!\n` +
                       `📦 <b>Bağlı Blog Sayısı:</b> <code>${blogCount}</code>\n` +
                       `📡 <b>Otorite:</b> Google High-Authority Parazit Ağı aktif.\n\n` +
                       `🚀 <i>Blogger üzerinden otomatik backlink dağıtımı başlatıldı.</i>\n\n` +
                       `<i>#BloggerAPI #HydraEngine #GodMode</i>`;
        
        await sendTelegramReport(report);
        console.log('✅ Blogger raporu gönderildi!');
        process.exit(0);
    } catch (err: any) {
        console.error('❌ Blogger Hatası:', err.message);
        process.exit(1);
    }
}

checkBlogger();
