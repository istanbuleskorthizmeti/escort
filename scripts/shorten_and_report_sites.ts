import * as dotenv from 'dotenv';
dotenv.config();

// OVERRIDE PROXY FOR THIS SCRIPT
process.env.FORCE_PROXY = 'false';
process.env.PREMIUM_PROXY_URL = '';

import { shortenUrl } from '../lib/seo/bitly';
import { TelegramReporter } from '../lib/seo/telegram-reporter';

const googleSites = [
  "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort",
  "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort",
  "https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/istanbul-escort",
  "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026",
  "https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026"
];

async function run() {
  console.log('🚀 [GOD MODE] Bitly Kısaltma & Telegram Raporlama Başlıyor...');
  
  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  let reportMessage = `🔥 <b>HYDRA SITES BACKLINK KISALTMA RAPORU</b> 🔥\n`;
  reportMessage += `🕒 Tarih: <code>${timestamp}</code>\n\n`;
  
  for (const siteUrl of googleSites) {
    console.log(`\n🔗 Kısaltılıyor: ${siteUrl}`);
    try {
      const shortUrl = await shortenUrl({ 
        longUrl: siteUrl, 
        title: 'Hydra Backlink Target' 
      });
      reportMessage += `🎯 <a href="${shortUrl}">${shortUrl}</a>\n`;
      const cleanTarget = siteUrl.split('/').pop() || siteUrl;
      reportMessage += `   └─ <i>${cleanTarget}</i>\n\n`;
      console.log(`   ⚡ Sonuç: ${shortUrl}`);
    } catch (error) {
      console.error(`   ❌ Hata:`, error);
      reportMessage += `❌ <i>${siteUrl} (Kısaltılamadı)</i>\n`;
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  reportMessage += `⚡ <i>Hydra Network - Auto Reporting Engine</i>`;

  console.log('\n📲 Telegram Raporu Gönderiliyor...');
  const sent = await TelegramReporter.sendMessage(reportMessage);
  
  if (sent) {
    console.log('🏆 [DONE] İşlem tamamlandı ve Telegram\'a iletildi.');
  } else {
    console.log('⚠️ [WARN] Kısaltma bitti ama Telegram gönderimi başarısız oldu (Token eksik olabilir).');
  }
  process.exit(0);
}

run().catch(err => {
    console.error("🔥 Beklenmeyen Hata:", err);
    process.exit(1);
});
