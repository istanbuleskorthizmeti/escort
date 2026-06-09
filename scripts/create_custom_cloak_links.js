require('dotenv').config();

// Çevre değişkenini doğrudan güncelleyerek PostgreSQL dış bağlantı engellerini aşıyoruz
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('213.232.235.181')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('213.232.235.181', 'localhost');
  console.log('📡 [LOCAL BYPASS] process.env.DATABASE_URL localhost olarak güncellendi.');
}

const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

// Kısa yönlendirme linklerimizi (istanbulescort.blog/go/...) doğrudan 
// kendi sitemizdeki asıl ilçe sayfalarına yönlendiriyoruz! Döngü tamamen kırıldı.
const redirects = [
  { slug: "sefakoy-vip-escort-2026", target: "https://istanbulescort.blog/istanbul/sefakoy-escort" },
  { slug: "bakirkoy-vip-escort-2026", target: "https://istanbulescort.blog/istanbul/bakirkoy-escort" },
  { slug: "catalca-vip-escort-2026", target: "https://istanbulescort.blog/istanbul/catalca-escort" },
  { slug: "beylikduzu-vip-escort-2026", target: "https://istanbulescort.blog/istanbul/beylikduzu-escort" },
  { slug: "besyol-universiteli-escort-2026", target: "https://istanbulescort.blog/istanbul/besyol-escort" },
  { slug: "besyol-vip-escort-2026", target: "https://istanbulescort.blog/istanbul/besyol-escort" },
  { slug: "istanbul-vip-escort-2026", target: "https://istanbulescort.blog/istanbul/istanbul-escort" },
  { slug: "sancaktepe-vip-escort-2026", target: "https://istanbulescort.blog/istanbul/sancaktepe-escort" },
  { slug: "kartal-vip-escort-2026", target: "https://istanbulescort.blog/istanbul/kartal-escort" },
  { slug: "cekmekoy-vip-escort-2026", target: "https://istanbulescort.blog/istanbul/cekmekoy-escort" },
  { slug: "arnavutkoy-vip-escort-2026", target: "https://istanbulescort.blog/istanbul/arnavutkoy-escort" },
  { slug: "basaksehir-vip-escort-2026", target: "https://istanbulescort.blog/istanbul/basaksehir-escort" },
  { slug: "esenler-vip-escort-2026", target: "https://istanbulescort.blog/istanbul/esenler-escort" },
  { slug: "adalar-vip-escort-2026", target: "https://istanbulescort.blog/istanbul/adalar-escort" }
];

async function run() {
  console.log('⚡ [DRKCNAY CLOAK] Yönlendirme Veritabanı Güncelleme Motoru Başlatılıyor...');
  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  
  let reportMessage = `🔥 <b>🏆 DRKCNAY CLOAK DÜZELTİLMİŞ TRAFİK RAPORU (v12.5) 🏆</b> 🔥\n`;
  reportMessage += `🕒 <b>Güncelleme Tarihi:</b> <code>${timestamp}</code>\n`;
  reportMessage += `💎 <b>Domain Yetkisi:</b> <code>istanbulescort.blog</code>\n\n`;
  reportMessage += `🚀 <i>Tüm özel linklerimizin hedefleri döngüyü kırmak için doğrudan ana sitemizdeki ILÇE sayfalarına yönlendirildi! İşte güncel yönlendirmeler:</i>\n\n`;

  const results = [];

  for (const item of redirects) {
    console.log(`\n──────────────────────────────────────────`);
    console.log(`🎯 ASIL HEDEF: ${item.target}`);
    console.log(`🔑 ÖZEL SLUG: ${item.slug}`);
    
    try {
      // Prisma ile veritabanındaki eski Google Sites yönlendirmelerini, 
      // doğrudan kendi ana sitemizin ilçe sayfalarıyla eziyoruz (Upsert)!
      await prisma.shortLink.upsert({
        where: { id: item.slug },
        update: { targetUrl: item.target },
        create: { id: item.slug, targetUrl: item.target }
      });
      
      const cloakUrl = `https://istanbulescort.blog/go/${item.slug}`;
      console.log(`✅ [VERİTABANI GÜNCELLENDİ] Yönlendirme Aktif: ${cloakUrl} -> ${item.target}`);
      
      const districtName = item.slug.split('-')[0].toUpperCase();
      reportMessage += `⭐️ <b>[${districtName}]</b>\n`;
      reportMessage += `🔗 <a href="${cloakUrl}">${cloakUrl}</a>\n`;
      reportMessage += `🎯 <i>Asıl İlçe Sayfası Yönü</i>\n\n`;
      
      results.push({ slug: item.slug, cloakUrl, target: item.target, status: 'BAŞARIYLA GÜNCELLENDİ' });
    } catch (err) {
      console.error(`❌ [HATA] Veritabanı güncelleme başarısız:`, err.message);
      results.push({ slug: item.slug, cloakUrl: 'HATA', target: item.target, status: `BAŞARISIZ: ${err.message}` });
    }
  }

  reportMessage += `🎯 <b>Trafik Döngüsü Kırıldı:</b> Google Sites embed entegrasyonu tamamlandığı için kısa linklerin hedefleri doğrudan Money Site sayfalarına çekilmiş ve link döngüsü sıfırlanmıştır! 🔥\n\n`;
  reportMessage += `⚡ <i>Hydra Sovereign Siege Network - Auto Direct Engine</i>`;

  console.log('\n📲 Telegram Düzeltme Raporu Gönderiliyor...');
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

  console.log('\n🏁 İşlem Tamamlandı. Veritabanı Güncel Durumu:');
  console.table(results);
  
  await prisma.$disconnect();
}

run();
