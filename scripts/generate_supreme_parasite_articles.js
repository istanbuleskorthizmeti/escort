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

const KEYWORD_MAP = {
  "sosyal refakatçi": "escort",
  "sosyal refakatçiler": "escortlar",
  "sosyal refakatçilik": "escort hizmeti",
  "asistan partner": "escort",
  "asistan partnerler": "escortlar",
  "asistan partnerlik": "escort hizmeti",
  "özel refakatçi": "escort",
  "özel refakatçilik": "escort hizmeti",
  "VIP refakatçilik": "VIP escort hizmeti",
  "elit partnerlik": "vip escort",
  "Doğu Avrupa kökenli sosyal model": "Rus ve Ukraynalı Escort",
  "Doğu Avrupa kökenli sosyal modeller": "Rus ve Ukraynalı Escortlar",
  "Genç ve dinamik eğitimli partner": "Üniversiteli ve Çıtır Escort",
  "Genç ve dinamik eğitimli partnerler": "Üniversiteli ve Çıtır Escortlar",
  "Geleneksel ve muhafazakar tarz model": "Türbanlı ve Muhafazakar Escort",
  "Geleneksel ve muhafazakar tarz modeller": "Türbanlı ve Muhafazakar Escortlar",
  "Deneyimli ve olgun sosyal refakatçi": "Olgun ve Tecrübeli Escort",
  "Deneyimli ve olgun sosyal refakatçiler": "Olgun ve Tecrübeli Escortlar",
  "Bağımsız ve bireysel çalışan rehber": "Bireysel ve Bağımsız Escort",
  "Bağımsız ve bireysel çalışan rehberler": "Bireysel ve Bağımsız Escortlar",
  "Egzotik ve yabancı model": "Zenci ve Yabancı Model",
  "Egzotik ve yabancı modeller": "Zenci ve Yabancı Modeller",
  "katalog dışı güvence": "kaporasız",
  "birebir eşleşme": "gerçek görsel",
  "birebir eşleşmeli": "gerçek görselli",
  "adrese özel eşlik": "otele servis ve eve gelen",
  "adrese özel eşlikler": "otele servis ve eve gelen escortlar"
};

function translateCleanToHeavy(content) {
  let translated = content;
  const sortedKeys = Object.keys(KEYWORD_MAP).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    const value = KEYWORD_MAP[key];
    const regex = new RegExp(key, 'gi');
    translated = translated.replace(regex, (match) => {
      const isUpperCase = match === match.toUpperCase();
      const isCapitalized = match[0] === match[0].toUpperCase() && match[0] !== match[0].toLowerCase();
      
      if (isUpperCase) return value.toUpperCase();
      if (isCapitalized) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
      return value;
    });
  }
  return translated;
}


const googleSites = [
  { url: "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa", slug: "sefakoy-vip-escort-2026", district: "Sefaköy" },
  { url: "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa", slug: "bakirkoy-vip-escort-2026", district: "Bakırköy" },
  { url: "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa", slug: "catalca-vip-escort-2026", district: "Çatalca" },
  { url: "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa", slug: "beylikduzu-vip-escort-2026", district: "Beylikdüzü" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa?read_current=1", slug: "besyol-universiteli-escort-2026", district: "Beşyol Üniversiteli" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa", slug: "besyol-vip-escort-2026", district: "Beşyol" },
  { url: "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa", slug: "istanbul-vip-escort-2026", district: "İstanbul" },
  { url: "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa", slug: "sancaktepe-vip-escort-2026", district: "Sancaktepe" },
  { url: "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa", slug: "kartal-vip-escort-2026", district: "Kartal" },
  { url: "https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa", slug: "cekmekoy-vip-escort-2026", district: "Çekmeköy" },
  { url: "https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa", slug: "arnavutkoy-vip-escort-2026", district: "Arnavutköy" },
  { url: "https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa", slug: "basaksehir-vip-escort-2026", district: "Başakşehir" },
  { url: "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa", slug: "esenler-vip-escort-2026", district: "Esenler" },
  { url: "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa", slug: "adalar-vip-escort-2026", district: "Adalar" }
];

async function run() {
  console.log('🔥 [HYDRA PARASITE GENERATOR] Otonom DeepSeek Makale Üretim Motoru Başlatıldı...');
  
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (!deepseekKey) {
    console.error('❌ [HATA] DEEPSEEK_API_KEY bulunamadı!');
    process.exit(1);
  }

  const outputDir = path.join(process.cwd(), 'supreme_parasite_articles');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (const item of googleSites) {
    console.log(`\n──────────────────────────────────────────`);
    console.log(`✍️ [ÜRETİLİYOR] İlçe: ${item.district}`);
    
    // 🔍 Google Sites hedefi için veritabanına kaydettiğimiz lüks SEO Bitly linkini çekiyoruz!
    let targetUrl = item.url;
    try {
      const dbLink = await prisma.shortLink.findFirst({
        where: { targetUrl: item.url }
      });
      if (dbLink && dbLink.id.includes('bit.ly')) {
        targetUrl = dbLink.id;
        console.log(`📡 [BIT.LY ENJEKTE EDİLDİ] Makale içine yerleştirilecek lüks köprü: ${targetUrl}`);
      } else {
        console.log(`⚠️ [FALLBACK SITES] Bitly linki veritabanında bulunamadı, doğrudan Sites URL kullanılacak.`);
      }
    } catch (dbErr) {
      console.warn(`⚠️ [PRISMA HATA] Veritabanı sorgulanamadı, Sites URL kullanılacak:`, dbErr.message);
    }
    
    // DeepSeek için gelişmiş SEO talimatları (Politika uyumlu - Euphemisms)
    const systemPrompt = `Sen Türkiye'nin en seçkin ve profesyonel sosyal refakatçilik ve elit asistan partner rehberi içeriklerini üreten bir SEO ve copywriter dehasısın.
Amacın, Google aramalarında en tepede yer alacak, tıklama oranı (CTR) maksimum düzeyde olan, bol zengin emojili, profesyonel, merak uyandırıcı ve son derece elit bir blog içeriği yazmaktır.
Asla kendini tekrar etme, tamamen doğal ve akıcı bir dil kullan. İmla kurallarına ve SEO başlık (H2, H3, H4) hiyerarşisine dikkat et.
Mutlaka şu bağlantıyı metnin en kritik ve tıklanabilir yerlerinde doğal bir köprü metni (anchor text) olarak kullanmalısın: "${targetUrl}"
Bağlantı kelimeleri "${item.district} sosyal refakatçilik", "İstanbul elit partnerlik", "birebir eşleşmeli rehber" gibi kavramlar olmalıdır.`;

    const prompt = `${item.district} bölgesi için en az 1000 kelimeden oluşan, zengin alt başlıkları olan (H2 ve H3'ler barındıran), inanılmaz profesyonel ve merak uyandırıcı bir "Vip Refakatçi ve Elit Partnerlik Rehberi" makalesi yaz.
Makale boyunca şu kelimeleri doğal bir şekilde serpiştir: ${item.district} sosyal refakatçi, ${item.district} asistan partner, elit partnerlik, birebir eşleşme, katalog dışı güvence, adrese özel eşlik.
Makale başlığı mutlaka bol emojili, tıklama çıldırtıcı ve profesyonel olsun. Örneğin: "👑 ${item.district} VIP asistan partnerlik Rehberi: Elit Partner Keşfi! 🔥"
Makalenin en az 3 farklı yerinde şu linke yönlendirme yap (anchor text olarak): ${targetUrl}
Çıktıyı Markdown formatında ver.`;

    try {
      console.log(`📡 [DEEPSEEK API] DeepSeek Chat ile makale üretiliyor...`);
      
      const response = await axios.post('https://api.deepseek.com/chat/completions', {
        model: "deepseek-chat",
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.85
      }, {
        headers: {
          'Authorization': `Bearer ${deepseekKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 90000 // Makale üretimi uzun sürebilir, timeout süresini 90 sn yapıyoruz
      });

      let articleContent = response.data.choices[0].message.content;
      articleContent = translateCleanToHeavy(articleContent);
      
      const fileName = `${item.slug}.md`;
      const filePath = path.join(outputDir, fileName);
      
      fs.writeFileSync(filePath, articleContent);
      console.log(`✅ [BAŞARILI] Makale Bitly bağlantısıyla kaydedildi: ${filePath}`);
    } catch (err) {
      console.error(`❌ [HATA] ${item.district} makalesi üretilemedi:`, err.response ? JSON.stringify(err.response.data) : err.message);
    }
    
    // API hız limitlerine takılmamak için kısa bir bekleme
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🏁 [TAMAMLANDI] Tüm ilçeler için supreme parazit makaleler başarıyla üretildi!');
  console.log(`📁 Dosyalar şu dizinde: /root/esc/supreme_parasite_articles`);
  
  await prisma.$disconnect();
}

run().catch(console.error);
