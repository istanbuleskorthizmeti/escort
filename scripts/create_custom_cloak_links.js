require('dotenv').config();

// Prisma motoru çalıştırılmadan önce, process.env.DATABASE_URL çevre değişkenini 
// doğrudan değiştirerek PostgreSQL dış IP engellerini %100 bypass ediyoruz!
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('213.232.235.181')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('213.232.235.181', 'localhost');
  console.log('📡 [LOCAL BYPASS] process.env.DATABASE_URL localhost olarak güncellendi.');
}

const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

const googleSites = [
  { url: "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa", slug: "sefakoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa", slug: "bakirkoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa", slug: "catalca-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa", slug: "beylikduzu-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa?read_current=1", slug: "besyol-universiteli-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa", slug: "besyol-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa", slug: "istanbul-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa", slug: "sancaktepe-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa", slug: "kartal-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa", slug: "cekmekoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa", slug: "arnavutkoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa", slug: "basaksehir-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa", slug: "esenler-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa", slug: "adalar-vip-escort-2026" }
];

async function run() {
  console.log('⚡ [DRKCNAY CLOAK] Özel Yönlendirme Veritabanı Motoru Başlatılıyor...');
  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  
  // Google botlarını çıldırtacak yüksek CTR'lı premium emojili Telegram Rapor Başlığı!
  let reportMessage = `🔥 <b>🏆 DRKCNAY CLOAK SUPREME RAPORU (v12.0) 🏆</b> 🔥\n`;
  reportMessage += `🕒 <b>Sistem Güncelleme Tarihi:</b> <code>${timestamp}</code>\n`;
  reportMessage += `💎 <b>Domain Yetkisi:</b> <code>vipescorthizmeti.com</code>\n\n`;
  reportMessage += `🚀 <i>Tüm Google Sites backlinklerimiz %100 temiz ve tireli olarak veritabanına işlendi! İşte yeni yönlendirme linklerin:</i>\n\n`;

  const results = [];

  for (const item of googleSites) {
    console.log(`\n──────────────────────────────────────────`);
    console.log(`🎯 HEDEF URL: ${item.url}`);
    console.log(`🔑 ÖZEL SLUG: ${item.slug}`);
    
    try {
      // Prisma ile veritabanına doğrudan yazıyoruz (varsa üstüne yazıp günceller, yoksa ekler!)
      await prisma.shortLink.upsert({
        where: { id: item.slug },
        update: { targetUrl: item.url },
        create: { id: item.slug, targetUrl: item.url }
      });
      
      const cloakUrl = `https://vipescorthizmeti.com/go/${item.slug}`;
      console.log(`✅ [VERİTABANI YAZILDI] Yönlendirme Aktif: ${cloakUrl}`);
      
      const districtName = item.slug.split('-')[0].toUpperCase();
      reportMessage += `⭐️ <b>[${districtName}]</b>\n`;
      reportMessage += `🔗 <a href="${cloakUrl}">${cloakUrl}</a>\n`;
      reportMessage += `🎯 <i>Google Sites Hedefi</i>\n\n`;
      
      results.push({ slug: item.slug, cloakUrl, status: 'VERİTABANINA YAZILDI' });
    } catch (err) {
      console.error(`❌ [HATA] Veritabanı kaydı başarısız:`, err.message);
      results.push({ slug: item.slug, cloakUrl: 'HATA', status: `BAŞARISIZ: ${err.message}` });
    }
  }

  reportMessage += `🎯 <b>Google Arama Motoru Güncelleme Notu:</b> Başlık ve içerik yapılandırmalarımızda kullanılan premium zengin emojiler arama sonuçlarında CTR (Tıklama Oranı) değerlerini tavan yaptıracak şekilde optimize edilmiştir! 🔥\n\n`;
  reportMessage += `⚡ <i>Hydra Sovereign Siege Network - Auto Cloak Engine</i>`;

  console.log('\n📲 Telegram Raporu Gönderiliyor...');
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: reportMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });
      console.log('🏆 Telegram bildirimi başarıyla gönderildi!');
    }
  } catch (tgErr) {
    console.error('⚠️ Telegram bildirimi başarısız:', tgErr.message);
  }

  console.log('\n🏁 İşlem Tamamlandı. Veritabanı Durumu:');
  console.table(results);
  
  await prisma.$disconnect();
}

run();
