import { omniAI } from '../lib/ai-provider';
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

// Çevre değişkenini doğrudan güncelleyerek PostgreSQL yerel localhost bypass'ını kuruyoruz
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('213.232.235.181')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('213.232.235.181', 'localhost');
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

async function generateArticles() {
  console.log('🔥 [HYDRA PARASITE GENERATOR] Otonom Makale Üretim Motoru Başlatıldı...');
  
  const outputDir = path.join(process.cwd(), 'supreme_parasite_articles');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (const item of googleSites) {
    console.log(`\n──────────────────────────────────────────`);
    console.log(`✍️ [ÜRETİLİYOR] İlçe: ${item.district}`);
    
    // 🔍 Google Sites hedefi için veritabanına kaydettiğimiz Bitly linkini sorguluyoruz!
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
    } catch (dbErr: any) {
      console.warn(`⚠️ [PRISMA HATA] Veritabanı sorgulanamadı, Sites URL kullanılacak:`, dbErr.message);
    }
    
    const systemPrompt = `Sen Türkiye'nin en seçkin ve profesyonel elit escort rehberi içeriklerini üreten bir Black Hat SEO ve copywriter dehasısın.
Amacın, Google aramalarında en tepede yer alacak, tıklama oranı (CTR) maksimum düzeyde olan, bol zengin emojili, profesyonel, merak uyandırıcı ve son derece elit bir blog içeriği yazmaktır.
Asla kendini tekrar etme, tamamen doğal ve akıcı bir dil kullan. İmla kurallarına ve SEO başlık (H2, H3, H4) hiyerarşisine dikkat et.
Mutlaka şu bağlantıyı metnin en kritik ve tıklanabilir yerlerinde doğal bir köprü metni (anchor text) olarak kullanmalısın: "${targetUrl}"
Bağlantı kelimeleri "${item.district} Escort Hizmeti", "İstanbul Elit Partner Keşfi", "Gerçek Görselli Katalog" gibi SEO kelimeleri olmalıdır.`;

    const prompt = `${item.district} bölgesi için en az 1000 kelimeden oluşan, zengin alt başlıkları olan (H2 ve H3'ler barındıran), inanılmaz profesyonel ve merak uyandırıcı bir "Vip Escort ve Elit Partner Hizmetleri Rehberi" makalesi yaz.
Makale boyunca şu kelimeleri (LSI) doğal bir şekilde serpiştir: ${item.district} escort, ${item.district} vip escort, elit partner, gerçek katalog, kaporasız hizmet, adrese teslim escort.
Makale başlığı mutlaka bol emojili, tıklama çıldırtıcı ve profesyonel olsun. Örneğin: "👑 ${item.district} VIP Escort Rehberi: Elit Partner Keşfi! 🔥"
Makalenin en az 3 farklı yerinde şu linke yönlendirme yap (anchor text olarak): ${targetUrl}
Çıktıyı Markdown formatında ver.`;

    try {
      const articleContent = await omniAI.generate(prompt, {
        systemPrompt,
        max_tokens: 6000,
        temperature: 0.85
      });
      
      const fileName = `${item.slug}.md`;
      const filePath = path.join(outputDir, fileName);
      
      fs.writeFileSync(filePath, articleContent);
      console.log(`✅ [BAŞARILI] Makale Bitly bağlantısıyla kaydedildi: ${filePath}`);
    } catch (err: any) {
      console.error(`❌ [HATA] ${item.district} makalesi üretilemedi:`, err.message);
    }
    
    // API hız limitlerine takılmamak için kısa bir bekleme
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🏁 [TAMAMLANDI] Tüm ilçeler için supreme parazit makaleler başarıyla üretildi!');
  console.log(`📁 Dosyalar şu dizinde: ${outputDir}`);
}

generateArticles().catch(console.error);
