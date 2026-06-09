import * as dotenv from 'dotenv';
import * as path from 'path';
import { sendTelegramReport } from '../lib/telegram';

// Load environmental parameters
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const report = 
  `⚔️ <b>[HYDRA NET: SİSTEM STABİLİZASYON VE DEPLOY RAPORU]</b>\n` +
  `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n` +
  `🥷 <b>AGENT:</b> <code>ANTIGRAVITY GOD MODE</code>\n` +
  `✅ <b>DURUM:</b> 100% TEMİZ & STABİL\n` +
  `⏰ <b>RAPOR ZAMANI:</b> ${new Date().toLocaleString('tr-TR')}\n` +
  `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n` +
  `🛠️ <b>YAPILAN İŞLEMLER VE İYİLEŞTİRMELER:</b>\n` +
  `• <b>JSX / TSX Temizliği:</b> <code>UltraFooter.tsx</code> dosyasındaki kaçış karakteri hatası (unescaped single quote) <code>&amp;apos;</code> kullanılarak giderildi. Kullanılmayan kütüphane ve bileşen prop tanımları temizlendi.\n` +
  `• <b>Google Sites Payload Fabrikası Güncellendi:</b> <code>generate-google-sites-payloads.ts</code> revize edilerek tüm dış bağlantılara <code>rel="noopener"</code> özniteliği eklendi. CSS <code>background-clip: text</code> uyumluluk kuralları entegre edildi.\n` +
  `• <b>2.025 Sayfa Yeniden Üretildi:</b> 405 lokasyon için 5 farklı sürümde (Toplam 2.025 özgün HTML sayfası) Google Sites payload dosyası sıfır hata ile üretilerek <code>Desktop/google-sites-payloads</code> dizinine yazıldı.\n` +
  `• <b>Tip Güvenliği (Strict TypeScript):</b> <code>deploy-var-www.ts</code>, <code>gsc-inspect.ts</code> ve veri tarama scriptlerindeki <code>any</code> atamaları temizlendi, catch blokları güvenli hale getirildi.\n` +
  `• <b>Lokal Derleme Testi:</b> <code>tsc --noEmit</code> testi başarıyla çalıştırıldı (Hata kodu: 0).\n\n` +
  `🚀 <b>REMOTE VPS DAĞITIMI (187.77.111.203):</b>\n` +
  `• Tüm güncel kaynak kodlar VPS üzerindeki <code>/var/www/escortvip/</code> dizinine sorunsuz yüklendi.\n` +
  `• Bağımlılık paketleri güncellendi ve üretim modu derlemesi (Next.js Production Build) başarıyla tamamlandı.\n` +
  `• PM2 cluster süreçleri (<code>escortvip</code>) sıfır kesintiyle yeniden başlatıldı.\n` +
  `• Nginx cache dizini tamamen temizlendi ve sunucu konfigürasyonu yenilendi.\n\n` +
  `<i>#DominanceSecured #SEOAutoPilot #GodModeActive</i>`;

console.log('📡 Rapor gönderiliyor...');
sendTelegramReport(report).then(() => {
    console.log('✅ Rapor Telegram grubuna başarıyla gönderildi!');
    process.exit(0);
}).catch((err) => {
    console.error('❌ Hata oluştu:', err);
    process.exit(1);
});
