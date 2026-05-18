require('dotenv').config();

// PostgreSQL dış bağlantı hatasını aşmak için localhost yönlendirmesini process.env düzeyinde yapıyoruz
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('213.232.235.181')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('213.232.235.181', 'localhost');
  console.log('📡 [LOCAL BYPASS] process.env.DATABASE_URL localhost olarak güncellendi.');
}

const { PrismaClient } = require('@prisma/client');
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
  console.log('🚀 [GOD MODE] Bitly Premium SEO Kısaltma & Telegram Raporlama Başlatılıyor...');
  
  const token = process.env.BITLY_ACCESS_TOKEN ? process.env.BITLY_ACCESS_TOKEN.split(',')[0].trim() : "";
  if (!token) {
    console.error('❌ [HATA] Bitly Access Token bulunamadı!');
    process.exit(1);
  }

  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  let reportMessage = `🔥 <b>🏆 HYDRA SITES SUPREME SEO BITLY RAPORU (v14.0) 🏆</b> 🔥\n`;
  reportMessage += `🕒 <b>Tarih:</b> <code>${timestamp}</code>\n`;
  reportMessage += `🔑 <b>VIP Token Durumu:</b> <code>AKTİF / LİMİTSİZ</code>\n\n`;
  reportMessage += `🚀 <i>Tüm linklerimiz standart bit.ly üzerinden %100 SEO Uyumlu ve anahtar kelime odaklı (custom keyword) olarak yeniden yapılandırıldı! İşte o efsanevi linkler:</i>\n\n`;

  const results = [];

  // Öncelikle veritabanındaki eski rastgele oluşturulmuş veya SEO uyumsuz bit.ly linklerini 
  // ShortLink tablosundan temizleyelim ki yeni SEO uyumlu linklerimizle çakışmasınlar!
  try {
    const allLinks = await prisma.shortLink.findMany();
    const toDelete = allLinks.filter(l => l.id.includes('bit.ly') && !l.id.includes('-vip-escort-2026') && !l.id.includes('-universiteli-escort-2026'));
    if (toDelete.length > 0) {
      console.log(`🧹 [VERİTABANI TEMİZLİĞİ] ${toDelete.length} adet eski rastgele bit.ly linki siliniyor...`);
      for (const oldLink of toDelete) {
        await prisma.shortLink.delete({ where: { id: oldLink.id } });
      }
      console.log('✅ Eski linklerin temizliği tamamlandı.');
    }
  } catch (cleanErr) {
    console.warn('⚠️ [CLEANUP WARN] Temizlik sırasında hata:', cleanErr.message);
  }

  for (const item of googleSites) {
    console.log(`\n──────────────────────────────────────────`);
    console.log(`🎯 HEDEF URL: ${item.url}`);
    console.log(`🔑 ÖZEL SEO KEYWORD: ${item.keyword}`);

    const expectedBitlyLink = `https://bit.ly/${item.keyword}`;

    // 🔍 [DB CHECK] Eğer bu özel SEO linki veritabanında zaten varsa, API çağırmadan direkt kullan!
    try {
      const existing = await prisma.shortLink.findUnique({
        where: { id: expectedBitlyLink }
      });
      
      if (existing) {
        console.log(`🎯 [DB CACHE HIT] Mevcut SEO Bitly linki veritabanından yüklendi: ${existing.id}`);
        reportMessage += `⭐️ <b>[${item.keyword.split('-')[0].toUpperCase()}]</b>\n`;
        reportMessage += `🔗 <a href="${existing.id}">${existing.id}</a>\n`;
        reportMessage += `   └─ <i>[DB CACHE SECURE]</i>\n\n`;
        results.push({ url: item.url, shortUrl: existing.id, status: 'VERİTABANINDAN ALINDI' });
        continue;
      }
    } catch (dbErr) {
      console.warn(`⚠️ [PRISMA] Önbellek kontrolü başarısız oldu:`, dbErr.message);
    }

    // Eğer veritabanında yoksa, Bitly v4 POST /v4/bitlinks endpoint'iyle sıfırdan oluşturuyoruz!
    try {
      console.log(`📡 [BITLY API] SEO Uyumlu Kısaltılıyor: bit.ly/${item.keyword}...`);
      
      const response = await axios.post('https://api-ssl.bitly.com/v4/bitlinks', {
        long_url: item.url,
        domain: "bit.ly",
        title: `Hydra SEO - ${item.keyword}`,
        keyword: item.keyword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        const shortUrl = data.link;

        console.log(`🔥 [SEO SUCCESS] Bitly custom slug başarıyla uygulandı: ${shortUrl}`);

        // Veritabanına kaydet
        await prisma.shortLink.upsert({
          where: { id: shortUrl },
          update: { targetUrl: item.url },
          create: { id: shortUrl, targetUrl: item.url }
        });
        console.log(`💾 [SAVED TO DB] Yönlendirme veritabanına yazıldı: ${shortUrl} -> ${item.url}`);

        reportMessage += `⭐️ <b>[${item.keyword.split('-')[0].toUpperCase()}]</b>\n`;
        reportMessage += `🔗 <a href="${shortUrl}">${shortUrl}</a>\n`;
        reportMessage += `   └─ <i>[YENİ ÜRETİLDİ]</i>\n\n`;
        results.push({ url: item.url, shortUrl, status: 'YENİ SEO LİNKİ OLUŞTURULDU' });
      }
    } catch (apiErr) {
      const errMsg = apiErr.response ? JSON.stringify(apiErr.response.data) : apiErr.message;
      console.error(`❌ [BITLY API HATA] Kısaltılamadı:`, errMsg);
      
      // Eğer zaten var hatası (ALREADY_EXISTS veya keyword taken) verdiyse, o zaman zaten mevcuttur.
      if (apiErr.response && (JSON.stringify(apiErr.response.data).includes('ALREADY_EXISTS') || JSON.stringify(apiErr.response.data).includes('taken'))) {
        console.log(`ℹ️ [SLUG EXISTENT] Bu SEO slug zaten oluşturulmuş. Veritabanına elle kaydediliyor.`);
        const shortUrl = `https://bit.ly/${item.keyword}`;
        await prisma.shortLink.upsert({
          where: { id: shortUrl },
          update: { targetUrl: item.url },
          create: { id: shortUrl, targetUrl: item.url }
        });
        reportMessage += `⭐️ <b>[${item.keyword.split('-')[0].toUpperCase()}]</b>\n`;
        reportMessage += `🔗 <a href="${shortUrl}">${shortUrl}</a>\n`;
        reportMessage += `   └─ <i>[MANUEL EŞLENDİ]</i>\n\n`;
        results.push({ url: item.url, shortUrl, status: 'VAR OLAN SLUG EŞLENDİ' });
      } else {
        reportMessage += `❌ <code>${item.url}</code> (Kısaltma Hatası: ${apiErr.message})\n\n`;
        results.push({ url: item.url, shortUrl: 'HATA', status: `BAŞARISIZ: ${apiErr.message}` });
      }
    }

    // Hız limitleri için küçük bekleme
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  reportMessage += `⚡ <i>Hydra Network - Premium SEO Bitly Engine</i>`;

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

  console.log('\n🏁 İşlem Tamamlandı. Bitly SEO Raporlama Tablosu:');
  console.table(results);

  await prisma.$disconnect();
}

run();
