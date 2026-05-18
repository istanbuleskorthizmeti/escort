import * as dotenv from 'dotenv';
dotenv.config();

// REMOTE DIRECT ACCESS MODE (NO PROXY FILTERING NEEDED ON VPS)
process.env.FORCE_PROXY = 'false';
process.env.PREMIUM_PROXY_URL = '';

import { shortenUrl } from '../lib/seo/bitly';
import { TelegramReporter } from '../lib/seo/telegram-reporter';

const googleSites = [
  { url: "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa", keyword: "sefakoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa", keyword: "bakirkoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa", keyword: "catalca-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa", keyword: "beylikduzu-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa?read_current=1", keyword: "besyol-universiteli-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa", keyword: "besyol-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa", keyword: "istanbul-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa", keyword: "sancaktepe-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa", keyword: "kartal-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa", keyword: "cekmekoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa", keyword: "arnavutkoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa", keyword: "basaksehir-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa", keyword: "esenler-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa", keyword: "adalar-vip-escort-2026" }
];

async function run() {
  console.log('🚀 [GOD MODE] Bitly Kısaltma & Telegram Raporlama Başlıyor...');
  
  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  let reportMessage = `🔥 <b>HYDRA SITES BACKLINK KISALTMA RAPORU</b> 🔥\n`;
  reportMessage += `🕒 Tarih: <code>${timestamp}</code>\n\n`;
  
  for (const item of googleSites) {
    console.log(`\n🔗 Kısaltılıyor: ${item.url} (Anahtar Kelime: ${item.keyword})`);
    try {
      const shortUrl = await shortenUrl({ 
        longUrl: item.url, 
        title: `Hydra Backlink - ${item.keyword}`,
        keyword: item.keyword
      });
      reportMessage += `🎯 <a href="${shortUrl}">${shortUrl}</a>\n`;
      const cleanTarget = item.url.split('/')[4] || item.url;
      reportMessage += `   └─ <i>${cleanTarget}</i>\n\n`;
      console.log(`   ⚡ Sonuç: ${shortUrl}`);
    } catch (error) {
      console.error(`   ❌ Hata:`, error);
      reportMessage += `❌ <i>${item.url} (Kısaltılamadı)</i>\n`;
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
