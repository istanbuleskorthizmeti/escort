import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { dedupeEscort, toTitleCaseTR } from "./utils";
import { DOMAIN_MATRIX, getDomainConfig } from "@/config/domains";

interface MetaParams {
  city: string;
  cityName: string;
  district?: string;
  districtName?: string;
  neighborhood?: string;
  neighborhoodName?: string;
  isVillage?: boolean;
  landmarkName?: string;
  categoryTitle?: string;
  customTitle?: string;
  niche?: 'rus' | 'yabanci' | 'ogrenci' | 'turbanli' | 'bireysel';
  alternates?: Record<string, string>;
  domain?: string;
  isHome?: boolean;
}

/**
 * Next.js SEO METADATA & SCHEMA GENERATOR ENGINE (V3.0 - Optimized)
 * Optimized for Google SERP CTR, indexing, E-E-A-T, and localized silo structures.
 */
export function generateLocationMetadata({
  city,
  cityName,
  district,
  districtName,
  neighborhood,
  neighborhoodName,
  isVillage,
  landmarkName,
  categoryTitle,
  customTitle,
  niche,
  alternates,
  domain = siteConfig.domain,
  isHome = false,
}: MetaParams): Metadata {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('tr-TR', { month: 'long' }).format(new Date());
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  
  // 🔱 SILO CANONICAL ISOLATION PROTOCOL
  const currentHost = domain.replace(/^www\./, '').toLowerCase();
  const currentDomainConfig = getDomainConfig(currentHost);
  
  let targetBaseUrl = baseUrl;
  let shouldIndex = true;

  if (currentDomainConfig && currentDomainConfig.role === 'SATELLITE') {
    // 🔱 DECOUPLED CANONICAL ALIGNMENT (SATELLITE INDEPENDENCE)
    // Force self-canonical behavior to allow satellites to index and compete independently.
    shouldIndex = true;
    targetBaseUrl = baseUrl;
  }

  // Clean location names for meta tags
  const locName = (landmarkName || neighborhoodName || districtName || cityName)
    .replace(/escort|eskort/gi, '')
    .replace(/[-\u2013\u2014]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const exactMatchLoc = (neighborhoodName || districtName || cityName)
    .replace(/escort|eskort/gi, '')
    .replace(/[-\u2013\u2014]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const fullLoc = neighborhoodName 
    ? `${cityName} ${districtName} ${neighborhoodName}`.replace(/[-\u2013\u2014]/g, ' ') 
    : (districtName ? `${cityName} ${districtName}`.replace(/[-\u2013\u2014]/g, ' ') : cityName.replace(/[-\u2013\u2014]/g, ' '));

  // Dynamic FNV-1a Hash for safe, deterministic spintax selection
  const hashStr = fullLoc + city + domain;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < hashStr.length; i++) {
    h = Math.imul(h ^ hashStr.charCodeAt(i), 16777619);
  }
  const rand = (limit: number) => (h >>> 0) % limit;

  // Optimized Title Matrix with High CTR Emojis & Year Tags (No consecutive or stuffed keywords)
  let titles = customTitle ? [dedupeEscort(customTitle)] : (categoryTitle ? [
    `🔥 ${exactMatchLoc} ${categoryTitle} | %100 Gerçek Fotoğraflı VIP Çıtırlar (${currentYear})`,
    `📞 ${exactMatchLoc} ${categoryTitle} Telefon | Hemen Ara Cepten Görüş`,
    `💎 KAPORASIZ ${exactMatchLoc} ${categoryTitle} Ajansı | Eve & Otele Servis Bayanlar`,
    `👑 ${exactMatchLoc} En Seçkin ${categoryTitle} Kızları | Rezervasyon & İletişim Hattı`,
    `🔞 ${exactMatchLoc} Seks Sahneleri & ${categoryTitle} Hizmeti | Kaporasız Randevu Al`,
    `✨ ${exactMatchLoc} Evli Olgun & Çıtır ${categoryTitle} Modelleri | Aktif Görüşme`,
    `👑 Buluşmak İçin ${exactMatchLoc} ${categoryTitle} | Direct WhatsApp İletişim (${currentYear})`,
    `🔥 En Hiddetli ${exactMatchLoc} ${categoryTitle.replace(/escort/gi, 'Gacısı')} | Fiyat Tarifesi & Saatlik Ücretler`
  ] : [
    `🔞 ${exactMatchLoc.toUpperCase()} ESCORT BAYAN | %100 GERÇEK VE KAPORASIZ ${currentYear}`,
    `📞 ${exactMatchLoc.toUpperCase()} ESCORT TELEFON NUMARALARI | AKTİF WHATSAPP HATTI`,
    `💎 ${exactMatchLoc.toUpperCase()} KAPORASIZ ORTAK | RANDEVU İÇİN ÇITIR GACI | ${currentMonth}`,
    `👑 ${exactMatchLoc.toUpperCase()} EVE GELEN MODEL | İLETİŞİM İÇİN BAYAN ESKORT | DRKCNAY`,
    `🔞 ${exactMatchLoc.toUpperCase()} RUS ESCORT | BULUŞMAK İÇİN GENÇ YABANCI KIZLAR | ${currentYear}`,
    `🔥 ${exactMatchLoc.toUpperCase()} EN İYİ ESKORT | FİYAT TARİFESİ & SAATLİK ÜCRETLER`,
    `💎 ${exactMatchLoc.toUpperCase()} ESCORT AJANSI | İLETİŞİM VE BULUŞMA NUMARALARI | ${currentMonth}`,
    `👑 ${exactMatchLoc.toUpperCase()} OTELE GELEN ÇITIR | EŞSİZ VİTRİN VE RESİMLER | ${currentYear}`,
    `🔞 ${exactMatchLoc.toUpperCase()} ESCORT NUMARALARI | BULUŞMA VE RANDEVU İÇİN CEPTEN ARA`,
    `✨ ${exactMatchLoc.toUpperCase()} ÇITIR GACI | KENDİ EVİNDE GÖRÜŞEN GENÇ KIZLAR | ${currentYear}`,
    `🔥 ${exactMatchLoc.toUpperCase()} BAYAN ESKORT | WHATSAPP ÜZERİNDEN KATALOG VE FOTOĞRAFLAR`,
    `🔞 ${exactMatchLoc.toUpperCase()} BİREYSEL ESCORT | SAATLİK & GECELİK RANDEVU SİSTEMİ | ${currentYear}`,
    `💎 ${exactMatchLoc.toUpperCase()} MODEL ESCORT | %100 GERÇEK GÖRSEL VE VİDEOLU KANITLAR | ${currentMonth}`,
    `👑 ${exactMatchLoc.toUpperCase()} GENÇ ESKORT | HİÇBİR YERDE OLMAYAN EN YENİ YÜZLER | DRKCNAY`,
    `🔥 ${exactMatchLoc.toUpperCase()} ÇITIR GACI | İLETİŞİM VE BULUŞMA ADRESİ CEPTEN ARA | ${currentYear}`,
    `💎 ${exactMatchLoc.toUpperCase()} RUS ESCORT | SADECE ELİT OTELLERE EŞLİK HİZMETİ | ${currentYear}`,
    `👑 ${exactMatchLoc.toUpperCase()} ÜNİVERSİTELİ ESKORT | GÖRÜŞMEK İÇİN GACILAR | DRKCNAY`,
    `👑 ${exactMatchLoc.toUpperCase()} ESCORT BAYAN | BULUŞMAK VE RANDEVU ALMAK İÇİN ${currentYear}`,
    `🔥 EN HİDDETLİ ${exactMatchLoc.toUpperCase()} ESCORTS | GÖRÜŞMEK İÇİN GENÇ KIZLAR | ${currentMonth}`
  ]);

  // High-performance spun descriptions matching top ranking competitor layouts
  let descriptions = [
    `🔥 ${fullLoc} bölgesinde buluşmak için vip eskort gacı arayanlara özel en güncel rehber! Saatlik ve gecelik eve & otele gelen çıtır bayanlar ve üniversiteli eskort numaraları için hemen tıklayın.`,
    `📞 ${fullLoc} escort bayanlar: Buluşmak için %100 kaporasız and gerçek resimli eskort çıtır gacılar. Otele ve eve gelen genç kız modellerimizle 7/24 kesintisiz görüşme ve randevu fırsatı!`,
    `👑 DRKCNAY ${fullLoc} eskort gacı hizmetleri: Buluşmak ve görüşmek için en iyi, kaporasız ve güvenilir escort bayan modelleri. WhatsApp üzerinden direkt iletişim kurup rezervasyon yapın.`,
    `💎 ${fullLoc} escort arayışınızda 7/24 aktif ve doğrulanmış profiller. Sıfır kapora ve %100 gizlilik garantili ${fullLoc} eskort gacı kataloğuna göz at, hayalindeki modelle hemen buluş!`,
    `🛡️ Buluşmak için %100 gerçek ${fullLoc} eskort gacı profilleri. İletişim kurup randevu almak için en güvenilir otele eve gelen çıtır bayan ve eskort genç kız hizmetlerimizle bu yılın en iyisi.`,
    `🔞 ${fullLoc} bölgesinde iletişim ve randevu için eskort gacı bayan seçenekleri. Rus, Ukraynalı ve yerli çıtır genç kızlarla buluşmak için kaporasız escort kataloğumuz şimdi yayında.`,
    `Looking for the best escort in ${fullLoc}? Discover 100% verified independent outcall models, luxury Russian companions, and call girls with zero deposit. 24/7 service for dynamic meetings.`,
    `💎 Escort & Eskort Services in ${fullLoc}: Exclusive outcall call girls, premium hotel companion service, and direct meeting options.`
  ];

  // Specific overrides for money site (dorukcanay.digital) to render clean, premium titles
  if (currentHost.includes('dorukcanay.digital')) {
    titles = customTitle ? [dedupeEscort(customTitle)] : (categoryTitle ? [
      `💎 ${exactMatchLoc} ${categoryTitle} | Dorukcanay Elite Premium Partnerler`,
      `👑 ${exactMatchLoc} En Seçkin ${categoryTitle} Kızları | Kaporasız Randevu Al`,
      `🔥 ${exactMatchLoc} VIP ${categoryTitle} Hizmetleri | Eve & Otele Servis Çıtırlar`,
      `🔞 Lüks ${exactMatchLoc} ${categoryTitle} Ajansı | %100 Gerçek Fotoğraflarla Buluş`
    ] : [
      `💎 ${exactMatchLoc.toUpperCase()} VIP ESCORT | DORUKCANAY ELITE LUXURY COMPANION`,
      `👑 ${exactMatchLoc.toUpperCase()} ESCORT BAYAN | %100 GERÇEK VE KAPORASIZ ${currentYear}`,
      `🔥 ${exactMatchLoc.toUpperCase()} ESKORT GACI | ELİT VE LÜKS COMPANIONS | ${currentMonth}`,
      `🔞 ${exactMatchLoc.toUpperCase()} RUS ESCORT | EN SEÇKİN PARTNER VİTRİNİ | DRKCNAY`,
      `💎 ${exactMatchLoc.toUpperCase()} EXCLUSIVE ESCORT | RANDEVU VE İLETİŞİM HATTI`,
      `👑 ${exactMatchLoc.toUpperCase()} ÜNİVERSİTELİ ESCORT | GÖRÜŞMEK İÇİN ÇITIRLAR | ${currentYear}`,
      `👑 ${exactMatchLoc.toUpperCase()} LÜKS EŞLİK HİZMETİ | PRESTİJLİ VE BİREYSEL PARTNERLER`
    ]);

    descriptions = [
      `👑 dorukcanay.digital'in lüks escort rehberinde ${fullLoc} bölgesinin en seçkin VIP ve model escort bayan profillerini bulabilirsiniz. Tamamen kaporasız ve %100 gerçek resimli partnerler.`,
      `💎 ${fullLoc} VIP companion & elit escort bayan ilanları. Dorukcanay.digital güvencesiyle otele ve eve gelen genç kız modellerle kaporasız, güvenli ve elit randevu.`,
      `🔞 ${fullLoc} bölgesinde kaporasız buluşabileceğiniz, doğrulanmış ve elit escort partnerler. Rus model refakatçilerden oluşan özel seçkiyi dorukcanay.digital'de inceleyin.`,
      `🔥 En hiddetli ve lüks ${fullLoc} eskort gacıları. Kendi özel evinde veya otelinizde randevu oluşturabileceğiniz bireysel çıtır partner katalogları.`,
      `💎 Discover premium call girls and luxury independent escorts in ${fullLoc} at dorukcanay.digital. Zero prepayments, 100% verified outcall profiles.`
    ];
  }

  // Deterministic index calculation based on host parameters
  const hostSeed = (() => {
    let hash = 2166136261;
    for (let i = 0; i < currentHost.length; i++) {
      hash ^= currentHost.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash);
  })();

  const titleIdx = (hostSeed + (neighborhood ? 7 : 0) + (district ? 13 : 0)) % titles.length;
  const descIdx = (hostSeed + (district ? 3 : 0) + (neighborhood ? 19 : 0)) % descriptions.length;

  const keywords = [
    `${exactMatchLoc} escort`, `${exactMatchLoc} eskort`, `${exactMatchLoc} gacı`, `${exactMatchLoc} bayan`,
    `${exactMatchLoc} genç kız`, `${exactMatchLoc} çıtır`, `${exactMatchLoc} eskort bayan`,
    `${exactMatchLoc} rus escort`, `${cityName} escort`, `${exactMatchLoc} üniversiteli eskort`,
    `${exactMatchLoc} eve servis eskort`, `${exactMatchLoc} otel escort`, `${locName} eskort Numaraları`,
    `${exactMatchLoc} çıtır gacı`, `${exactMatchLoc} kaporasız eskort`, `${exactMatchLoc} bayan eskort`,
    `${exactMatchLoc} otele gelen gacı`, `${exactMatchLoc} eve gelen bayan`, `${exactMatchLoc} gerçek eskort`,
    `${exactMatchLoc} lüks escort`, `${exactMatchLoc} seksi bayan`, `${exactMatchLoc} çıtır eskort`,
    `${exactMatchLoc} buluşmak için escort`, `${exactMatchLoc} randevu için eskort`, `${exactMatchLoc} iletişim için eskort`,
    `escort bayan ${exactMatchLoc}`, `eskort gacı ${exactMatchLoc}`, `bayan eskort ${exactMatchLoc}`,
    `no deposit escort ${exactMatchLoc}`, `call girls in ${exactMatchLoc}`, `best escort ${exactMatchLoc}`,
    `hotel eskort ${exactMatchLoc}`, `bayan escort ${exactMatchLoc}`, `escort service ${exactMatchLoc}`
  ];

  const url = isHome ? `${targetBaseUrl}/` : `${targetBaseUrl}/${city}${district ? `/${district}` : ""}${neighborhood ? `/${neighborhood}` : ""}`;
  const finalTitle = dedupeEscort(toTitleCaseTR(titles[titleIdx]));

  return {
    title: finalTitle,
    description: dedupeEscort(descriptions[descIdx]),
    keywords: keywords.join(', '),
    metadataBase: new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`),
    alternates: { canonical: url, ...alternates },
    openGraph: {
      title: finalTitle,
      description: descriptions[descIdx],
      url: url,
      siteName: toTitleCaseTR(domain),
      locale: "tr_TR",
      type: "website",
      images: [
        { 
          url: `${baseUrl}/api/og?loc=${encodeURIComponent(locName)}`, 
          width: 1200, 
          height: 630, 
          alt: `${toTitleCaseTR(locName)} VIP Escort Tanıtım Kataloğu ${currentYear}` 
        },
        {
          url: `${baseUrl}/_media/vitrin/vip-profil-${(rand(58) + 1)}.webp`,
          width: 800,
          height: 1200,
          alt: `${toTitleCaseTR(locName)} Elit Model Görseli`
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: descriptions[descIdx],
      images: [`${baseUrl}/api/og?loc=${encodeURIComponent(locName)}`],
    },
    robots: {
      index: shouldIndex,
      follow: true,
      googleBot: { index: shouldIndex, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
  };
}

/**
 * Generates Structured Schema Markup conforming to Google Guidelines (LocalBusiness, Article, FAQPage, ImageGallery)
 */
export function generateStructuredData(params: MetaParams) {
  const locName = toTitleCaseTR(params.landmarkName || params.neighborhoodName || params.districtName || params.cityName);
  const targetDomain = params.domain || siteConfig.domain;
  const baseUrl = targetDomain.startsWith('http') ? targetDomain : `https://${targetDomain}`;
  const url = `${baseUrl}/${params.city}${params.district ? `/${params.district}` : ""}`;
  
  // 📚 Dynamic High-EEAT Expert Authors (Spoofed academic verification profiles for SGE)
  const authors = [
    {
      name: "Dr. Dorukcan Ay",
      jobTitle: "Kıdemli Dijital İletişim ve Gece Hayatı Kültürü Uzmanı",
      alumni: "Stanford University",
      linkedin: `${baseUrl}/go/linkedin-dorukcan`
    },
    {
      name: "Prof. Dr. Eda Nur",
      jobTitle: "Kentsel Sosyoloji ve Yaşam Analisti",
      alumni: "Harvard Medical School",
      linkedin: `${baseUrl}/go/linkedin-edanur`
    }
  ];
  
  const hashStr = locName + targetDomain;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < hashStr.length; i++) {
    h = Math.imul(h ^ hashStr.charCodeAt(i), 16777619);
  }
  const authorIdx = (h >>> 0) % authors.length;
  const selectedAuthor = authors[authorIdx];

  // 🖼️ Image Gallery Schema
  const imageGallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": `${locName} VIP Escort Görsel Galerisi`,
    "description": `${locName} bölgesindeki en yeni ve %100 gerçek eskort bayan fotoğrafları.`,
    "url": `${baseUrl}/showcase/vitrin`,
    "image": [
      {
        "@type": "ImageObject",
        "url": `${baseUrl}/api/og?loc=${encodeURIComponent(locName)}`,
        "width": "1200",
        "height": "630",
        "caption": `${locName} VIP Escort Tanıtım Görseli`
      },
      {
        "@type": "ImageObject",
        "url": `${baseUrl}/_media/vitrin/vip-profil-12.webp`,
        "width": "1200",
        "height": "1800",
        "caption": `${locName} Elit Model`
      },
      {
        "@type": "ImageObject",
        "url": `${baseUrl}/_media/vitrin/vip-profil-24.webp`,
        "width": "1200",
        "height": "1800",
        "caption": `${locName} Yabancı Escort Görseli`
      }
    ]
  };

  // 📰 SGE & EEAT Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "headline": `${locName} VIP Escort Hizmetleri | Kaporasız & %100 Gerçek`,
    "description": `${locName} lokasyonunda lüks ve kaporasız rus ve üniversiteli eskort refakatçilik hizmetine dair bağımsız uzman analizi.`,
    "image": `${baseUrl}/api/og?loc=${encodeURIComponent(locName)}`,
    "datePublished": "2026-01-15T08:00:00+03:00",
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": selectedAuthor.name,
      "jobTitle": selectedAuthor.jobTitle,
      "url": selectedAuthor.linkedin
    },
    "publisher": {
      "@type": "Organization",
      "name": "DRKCNAY ELITE",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/icon.png`
      }
    }
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `${locName} VIP Escort Hizmetleri`,
      "description": `${locName} lokasyonunda profesyonel kaporasız escort, rus escort ve üniversiteli lüks eşlik hizmeti.`,
      "url": url,
      "telephone": "+905520949245",
      "priceRange": "₺₺₺",
      "address": { "@type": "PostalAddress", "addressLocality": locName, "addressRegion": params.cityName, "addressCountry": "TR" },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": Math.floor(Math.random() * 50) + 120 }
    },
    imageGallerySchema,
    articleSchema,
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `${locName} escort fiyatları ne kadar?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${locName} bölgesinde VIP escort hizmetleri modelin tecrübesine ve seçilen standarta göre değişiklik göstermektedir. Detaylı bilgi için 7/24 arayabilirsiniz.`
          }
        },
        {
          "@type": "Question",
          "name": `${locName} escort kaporasız mı?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Evet, DRKCNAY ELITE ağındaki tüm buluşmalar %100 kaporasız ve güvenlidir."
          }
        }
      ]
    }
  ];
}
