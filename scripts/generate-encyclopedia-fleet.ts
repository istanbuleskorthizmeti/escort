import { prisma } from '../lib/prisma';
import { omniAI } from '../lib/ai-provider';
import { getPersonaForHost, PERSONAS } from '../lib/persona-engine';
import { getDomainConfig } from '../config/domains';
import { toTitleCaseTR } from '../lib/utils';
import { generateLocalArticle } from './encyclopedia-templates';

const encyclopediaData: Record<string, { title: string, expertId: string, description: string }> = {
  "fantezi-arkeolojisi": {
    title: "Fantezi Arkeolojisi: Arzunun Derinlikleri",
    expertId: "eda-nur",
    description: "İnsan zihninin karanlık ve arzulu labirentlerini haritalandıran, BDSM ve rol-play psikolojisine giriş."
  },
  "biyo-performans": {
    title: "Biyo-Performans: Tanrısal Kondisyon",
    expertId: "dorukcan-ay",
    description: "Hormonal egemenlik, testosteron optimizasyonu ve hücresel enerji bio-hacking standartları."
  },
  "iliski-simyasi": {
    title: "İlişki Simyası: Yakınlık ve Bağ",
    expertId: "eda-nur",
    description: "Dirty Talk linguistiği ve GFE (Girlfriend Experience) psikolojisi üzerine bilimsel bir inceleme."
  },
  "seks-teknolojileri": {
    title: "Modern Seks Teknolojileri",
    expertId: "dorukcan-ay",
    description: "2026 vizyonu ile cinsel sağlığı destekleyen modern teknolojiler ve vazo-dilatasyon cihazları."
  },
  "cinsel-saglik-ve-guvenlik": {
    title: "Cinsel Sağlık ve Güvenlik: Sıfır-İz",
    expertId: "dorukcan-ay",
    description: "Elit-Grade güvenlik standartları ve elit korunma kültürü."
  },
  "gizlilik-matrisi": {
    title: "Gizlilik Matrisi: VIP Anonimlik Stratejileri",
    expertId: "dorukcan-ay",
    description: "Kriptografik iletişimden fiziksel sıfır-iz standartlarıne kadar elitlerin gizlilik anayasası."
  },
  "erotik-linguistik": {
    title: "Erotik Dilbilim: Kelimelerin Gücü",
    expertId: "eda-nur",
    description: "Dirty Talk sanatının nöro-biyolojik etkileri ve zihinsel uyarılma mekanizmaları."
  },
  "metropol-lojistigi": {
    title: "Metropol Lojistiği: Tam Gizlilik Transferler",
    expertId: "dorukcan-ay",
    description: "Büyük şehirlerde VIP güvenliğini sağlayan operasyonel transfer ve lokasyon yönetimi."
  },
  "etik-hedonizm": {
    title: "Etik Hedonizm: 2026'da Haz Sanatı",
    expertId: "eda-nur",
    description: "Karşılıklı rıza ve yüksek saygı temelinde, yetişkin haz dünyasının modern felsefi incelemesi."
  },
  "biyo-hacking": {
    title: "Biyo-Hacking: VIP Performans Zirvesi",
    expertId: "dorukcan-ay",
    description: "Mitokondriyal enerji yönetimi ve stres kontrolü ile kesintisiz güç standartları."
  },
  "ulser-nasil-gecer": {
    title: "Ülser Nasıl Geçer: Modern Mide Sağlığı Tedavisi",
    expertId: "dorukcan-ay",
    description: "Sindirim sistemi sağlığı, ülser nedenleri, belirtileri ve en güncel tedavi yaklaşımları."
  },
  "kortizon-kullanimi": {
    title: "Kortizon Kullananların Yorumları ve Dikkat Edilmesi Gerekenler",
    expertId: "dorukcan-ay",
    description: "Kortizon tedavisinin vücut üzerindeki etkileri, yan etkileri ve iyileşme süreci analizleri."
  },
  "cinsellikte-oglak-burcu": {
    title: "Cinsellikte Oğlak Burcu: İlişki ve Haz Uyumu",
    expertId: "eda-nur",
    description: "Astrolojik haritada Oğlak burcunun cinsel karakteri, partner uyumu ve gizli haz noktaları."
  },
  "cinsellikte-beden-dili": {
    title: "Cinsellikte Beden Dili: Arzularınızı Sözsüz İfade Etmenin Yolları",
    expertId: "eda-nur",
    description: "Partnerinizle sözsüz iletişim kurarak yakınlığı ve heyecanı artırmanın psikolojik metotları."
  },
  "istanbul-seks-hikayeleri": {
    title: "İstanbul Erotik Hikayeler: Şehir Yaşamının Gizli Anları",
    expertId: "eda-nur",
    description: "Metropol yaşamının gizli, heyecanlı ve tutkulu anlarından derlenen ilişki hikayeleri."
  },
  "cinsel-isteksizlik-nedenleri": {
    title: "Cinsel İsteksizlik Nedenleri ve Çözüm Yolları",
    expertId: "eda-nur",
    description: "İlişkilerde cinsel soğukluk, nedenleri, psikolojik faktörler ve heyecanı geri kazanma yolları."
  },
  "erken-bosalma-cozumleri": {
    title: "Erken Boşalma Önleme Yöntemleri ve Egzersizleri",
    expertId: "dorukcan-ay",
    description: "Erkeklerde kontrol ve kondisyon artırıcı egzersizler, nefes teknikleri ve biyolojik kontrol metotları."
  },
  "seksin-faydalari": {
    title: "Düzenli Cinsel İlişkinin Sağlığa ve Psikolojiye Faydaları",
    expertId: "eda-nur",
    description: "Biyolojik ve hormonal açılardan cinsel hayatın kalp sağlığına, strese ve bağışıklık sistemine faydaları."
  },
  "afrodizyak-besinler": {
    title: "Afrodizyak Etkili Besinler: Gücü ve Tutkuyu Artıran Gıdalar",
    expertId: "dorukcan-ay",
    description: "Kan akışını hızlandıran, libidoyu artıran ve performansı optimize eden doğal gıdalar ve beslenme rehberi."
  },
  "iliski-sonrasi-temizlik": {
    title: "Cinsel İlişki Sonrası Temizlik ve Sağlık Kuralları",
    expertId: "dorukcan-ay",
    description: "İlişki sonrasında enfeksiyon riskini önlemek için yapılması gereken kişisel hijyen ve sağlık pratikleri."
  },
  "cinsel-guc-artirici": {
    title: "Doğal Performans Artırıcı Yöntemler ve Bitkisel Çözümler",
    expertId: "dorukcan-ay",
    description: "Herhangi bir kimyasal maddeye ihtiyaç duymadan, doğal performans artırıcı formüller ve yaşam tarzı değişiklikleri."
  },
  "vip-yasanti-ve-kultur": {
    title: "VIP Yaşam Kültürü: Elit Bir Sosyal Hayatın Şifreleri",
    expertId: "dorukcan-ay",
    description: "Metropollerde lüks yaşam standartları, kaliteli sosyalleşme pratikleri ve elit bir hayat tarzının anahtarları."
  }
};

async function main() {
  console.log("🔥 [ENCYCLOPEDIA SEEDER] Starting fleet-wide unique encyclopedia seeder...");
  
  const activeSites = await prisma.site.findMany({
    where: { status: 'ACTIVE' }
  });

  console.log(`📡 Found ${activeSites.length} active sites in network.`);

  for (const site of activeSites) {
    const host = site.domain;
    const siteId = site.id;
    console.log(`\n--- [Processing Site: ${host} (ID: ${siteId})] ---`);

    const config = getDomainConfig(host);
    const targetLoc = config.targetDistrict || config.targetCity || "istanbul";
    const anchorText = `${toTitleCaseTR(targetLoc)} Escort`;

    const personaKey = getPersonaForHost(host);
    const persona = PERSONAS[personaKey];
    console.log(`🎭 Using Persona: ${personaKey} for ${host}`);

    for (const [slug, entry] of Object.entries(encyclopediaData)) {
      const dbSlug = `ansiklopedi-${slug}`;

      // Check if unique entry already exists for this site
      const existing = await prisma.pageContent.findFirst({
        where: {
          slug: dbSlug,
          siteId: siteId
        }
      });

      if (existing && existing.content && existing.content.length > 500 && !existing.content.includes("seçkin escort hizmetleri ağı")) {
        console.log(`✅ [${slug}] Already populated and cached for ${host}. skipping.`);
        continue;
      }

      console.log(`⏳ [${slug}] Generating unique local article for ${host}...`);
      try {
        const localHtml = generateLocalArticle(slug, host, anchorText, targetLoc);
        await prisma.pageContent.upsert({
          where: {
            slug_siteId: {
              slug: dbSlug,
              siteId: siteId
            }
          },
          update: {
            title: entry.title,
            content: localHtml
          },
          create: {
            slug: dbSlug,
            siteId: siteId,
            title: entry.title,
            content: localHtml
          }
        });
        console.log(`✨ [${slug}] Successfully populated for ${host}.`);
      } catch (localErr: any) {
        console.error(`❌ Local generation failed for [${slug}] on ${host}:`, localErr.message);
      }
    }
  }

  console.log("\n🏁 [SUCCESS] All encyclopedia articles have been processed!");
}

main().catch(err => {
  console.error("Fatal error during encyclopedia seeding:", err);
  process.exit(1);
});
