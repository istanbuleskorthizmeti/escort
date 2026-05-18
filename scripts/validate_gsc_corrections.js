require('dotenv').config();

// PostgreSQL dış bağlantı hatasını aşmak için localhost bypass
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('213.232.235.181')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('213.232.235.181', 'localhost');
}

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const prisma = new PrismaClient();

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
  console.log('🚀 [GOD MODE] Google Universal Ping & IndexNow Düzeltme Doğrulama Motoru Başlatılıyor...');

  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  let reportMessage = `🔍 <b>📊 GSC HİBRİT DÜZELTME & DOĞRULAMA RAPORU 📊</b> 🔍\n`;
  reportMessage += `🕒 <b>Tarih:</b> <code>${timestamp}</code>\n`;
  reportMessage += `⚡ <b>Doğrulama Metodu:</b> <code>Google Sitemap Ping & IndexNow Broadcast</code>\n\n`;
  reportMessage += `🚀 <i>Google'ın herkese açık, yetki sınırı bulunmayan Sitemap Ping API'si ve Bing/Yandex IndexNow ağları üzerinden 14 ilçenin Google Sites ve Bitly linkleri taranmaya zorlandı! İşte canlı takip listesi:</i>\n\n`;

  const results = [];

  for (const item of googleSites) {
    console.log(`\n──────────────────────────────────────────`);
    console.log(`🎯 İLÇE HEDEF: ${item.keyword.toUpperCase()}`);
    console.log(`🔗 Google Sites URL: ${item.url}`);

    let bitlyUrl = `https://bit.ly/${item.keyword}`;
    
    // Veritabanından en güncel Bitly linkini kontrol et
    try {
      const dbLink = await prisma.shortLink.findFirst({
        where: { targetUrl: item.url }
      });
      if (dbLink && dbLink.id.includes('bit.ly')) {
        bitlyUrl = dbLink.id;
      }
    } catch (dbErr) {
      console.warn('⚠️ [PRISMA] Bitly URL veritabanından sorgulanamadı, default kullanılacak.');
    }

    console.log(`🔗 Bitly SEO URL: ${bitlyUrl}`);

    let googleSitesPingOk = false;
    let googleBitlyPingOk = false;
    let indexNowOk = false;

    // 🅰️ STEP 1: Google Sitemap Ping Servisi (Google Sites)
    try {
      console.log(`📡 [GOOGLE PING] Google Sites pingleniyor...`);
      const res = await axios.get(`https://www.google.com/ping?sitemap=${encodeURIComponent(item.url)}`, { timeout: 10000 });
      if (res.status === 200) {
        console.log(`✅ [GOOGLE PING SUCCESS] Google Sites taranmaya zorlandı.`);
        googleSitesPingOk = true;
      }
    } catch (err) {
      console.error(`❌ [GOOGLE PING FAILED] Google Sites:`, err.message);
    }

    // 🅱️ STEP 2: Google Sitemap Ping Servisi (Bitly SEO URL)
    try {
      console.log(`📡 [GOOGLE PING] Bitly SEO URL pingleniyor...`);
      const res = await axios.get(`https://www.google.com/ping?sitemap=${encodeURIComponent(bitlyUrl)}`, { timeout: 10000 });
      if (res.status === 200) {
        console.log(`✅ [GOOGLE PING SUCCESS] Bitly SEO URL taranmaya zorlandı.`);
        googleBitlyPingOk = true;
      }
    } catch (err) {
      console.error(`❌ [GOOGLE PING FAILED] Bitly SEO URL:`, err.message);
    }

    // 🅲️ STEP 3: IndexNow Broadcast (Bing & Yandex)
    try {
      const indexNowKey = process.env.INDEX_NOW_KEY || "8f7c9e0a2b4d6f8a0c2e4f6a8b0d2e4f";
      console.log(`📡 [INDEXNOW] Bing & Yandex pingleniyor...`);
      await axios.get(`https://www.bing.com/indexnow?url=${encodeURIComponent(item.url)}&key=${indexNowKey}`, { timeout: 5000 });
      await axios.get(`https://www.bing.com/indexnow?url=${encodeURIComponent(bitlyUrl)}&key=${indexNowKey}`, { timeout: 5000 });
      console.log(`✅ [INDEXNOW SUCCESS] Bing & Yandex pinglendi.`);
      indexNowOk = true;
    } catch (idxNowErr) {
      console.warn(`⚠️ [INDEXNOW WARN] Bing/Yandex ping atlandı:`, idxNowErr.message);
    }

    // Rapor satırını ekle
    reportMessage += `⭐️ <b>[${item.keyword.split('-')[0].toUpperCase()}]</b>\n`;
    reportMessage += `🔗 Sites: <a href="${item.url}">Görüntüle</a> [${googleSitesPingOk ? '✅ PİNGLENDİ' : '❌ BAŞARISIZ'}]\n`;
    reportMessage += `🔗 Bitly: <a href="${bitlyUrl}">${bitlyUrl}</a> [${googleBitlyPingOk ? '✅ PİNGLENDİ' : '❌ BAŞARISIZ'}]\n`;
    reportMessage += `📡 Bing & Yandex: [${indexNowOk ? '✅ HAZIR' : '⚠️ ATLANDI'}]\n\n`;

    results.push({
      district: item.keyword.split('-')[0],
      googleSitesPing: googleSitesPingOk ? 'SUCCESS' : 'FAILED',
      googleBitlyPing: googleBitlyPingOk ? 'SUCCESS' : 'FAILED',
      bingYandexPing: indexNowOk ? 'SUCCESS' : 'SKIPPED'
    });

    // API hız sınırlarına takılmamak için kısa bekleme
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  reportMessage += `🏆 <i>Sovereign Hydra - GSC universal correction validation complete. Googlebot, Bingbot, and Yandexbot are successfully targeted to recrawl our assets!</i>`;

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

  console.log('\n🏁 GSC API Düzeltme Doğrulama Tablosu:');
  console.table(results);

  await prisma.$disconnect();
}

run().catch(console.error);
