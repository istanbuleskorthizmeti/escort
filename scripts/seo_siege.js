const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { omniAI } = require('../lib/ai-provider');
const { DOMAIN_MATRIX } = require('../config/domains');

const districts = [
  'Beşiktaş', 'Şişli', 'Beylikdüzü', 'Sefaköy', 'Bakırköy', 'Kadıköy', 
  'Ataşehir', 'Esenyurt', 'Fatih', 'Bağcılar', 'Bahçelievler'
];

async function generateDistrictSEO(district, domain) {
  const prompt = `
    Sen dünyanın en iyi SEO uzmanısın. "${domain}" alan adı ve İstanbul'un "${district}" semti için elit bir bayan ESCORT sitesi içeriği oluşturmanı istiyorum.
    
    KURALLAR:
    1. Kelime Sayısı: 1500 - 2500 kelime arası (Derinlemesine ve kapsamlı).
    2. Anahtar Kelime: "istanbul escort", "${district} escort", "vip escort", "elit escort", "manken escort", "rus escort", "üniversiteli escort" ve tüm ilgili elit nişleri doğal bir şekilde yedir.
    3. LSI & Semantik: Konuyla ilgili tüm yan terimleri (randevu, gizlilik, kaporasız vb.) kullan.
    4. SSS (FAQ): En az 5 adet semte özel escort sıkça sorulan soru ve detaylı cevap ekle.
    5. GEO SEO: ${district} içindeki mahalleler, ünlü mekanlar ve ulaşım bilgilerini içeriğe entegre et.
    6. Stil: Lüks, profesyonel, güven verici ve elit bir dil kullan.
    7. Format: HTML (h1, h2, h3, p, ul, li etiketleri kullan).
    8. KESİN YASAKLAR: İçerikte asla "AI", "Gemini", "SEO", "kelime sayısı", "anahtar kelime" veya "yapay zeka" gibi teknik terimler geçmemeli. İçerik %100 bir insan tarafından yazılmış gibi doğal olmalı.
    
    İçerik planı:
    - Giriş (İstanbul'un en elit escort rehberi vurgusu)
    - ${district} Bölgesinde VIP Partner Deneyimi
    - Hizmet Standartları ve Gizlilik (Kaporasız sistem vurgusu)
    - Neden ${domain} Tercih Edilmeli?
    - Semte Özel Detaylar (Ulaşım, Mekanlar)
    - SSS Bölümü
    - Sonuç (Hemen iletişime geçin veya Vitrinimizi inceleyin)
  `;

  console.log(`🧠 [GEMINI ULTRA] Generating unique content for ${district} on ${domain}...`);
  return await omniAI.generate(prompt, { max_tokens: 8000 });
}

async function runSeoSiege() {
  try {
    console.log('🛡️ [SEO SIEGE] Starting Multi-Domain Content Generation...');

    // Filter for active money sites and satellites
    const targets = DOMAIN_MATRIX.filter(d => d.role === 'MONEY_SITE' || d.role === 'SATELLITE');

    for (const site of targets) {
      console.log(`🌐 [DOMAIN] Processing: ${site.host}`);
      
      // Ensure site exists
      const dbSite = await prisma.site.upsert({
        where: { domain: site.host },
        update: {},
        create: { id: site.host, domain: site.host }
      });

      for (const district of districts) {
        const content = await generateDistrictSEO(district, site.host);
        
        const slug = `${district.toLowerCase().replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ğ/g, 'g')}-escort`;

        await prisma.pageContent.upsert({
          where: { slug_siteId: { slug, siteId: dbSite.id } },
          update: { content, title: `${district} Escort - Elite & VIP` },
          create: {
            slug,
            siteId: dbSite.id,
            title: `${district} Escort - Elite & VIP`,
            content,
            metaDescription: `İstanbul ${district} bölgesinin en seçkin VIP escort ve elit partner rehberi. %100 gerçek profiller, kaporasız randevu ve gizlilik garantisi.`
          }
        });
        
        console.log(`  ✅ [DONE] ${district} saved for ${site.host}`);
      }
    }

    console.log('🏆 [GOD MODE] Multi-Domain SEO Siege Completed!');
  } catch (err) {
    console.error('❌ SEO Siege Failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

runSeoSiege();
