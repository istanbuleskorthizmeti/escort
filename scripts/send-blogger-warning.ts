
import { sendTelegramReport } from '../lib/telegram';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 🔱 HYDRA AUTHORITY LOADER
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const report = `⚠️ <b>[HYDRA BLOGGER: YETKİ GEREKLİ]</b>\n\n` +
               `❌ <b>Hata:</b> Blogger API erişim izni reddetti.\n` +
               `🔑 <b>Gerekli İşlem:</b> Blogger panelinden aşağıdaki e-postayı <b>Yazar (Author)</b> olarak eklemelisin:\n\n` +
               `<code>sovereign-spyy@karacocuk.iam.gserviceaccount.com</code>\n\n` +
               `🛡️ <i>Bu işlemden sonra parazit ağı sarsılmaz bir şekilde devreye girecektir.</i>\n\n` +
               `<i>#HydraWarning #BloggerSEO #ActionRequired</i>`;

console.log('📡 Uyarı raporu gönderiliyor...');
sendTelegramReport(report).then(() => {
    console.log('✅ Uyarı raporu gönderildi!');
    process.exit(0);
}).catch((err) => {
    console.error('❌ Hata:', err);
    process.exit(1);
});
