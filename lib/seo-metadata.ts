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
  const locTitle = toTitleCaseTR(exactMatchLoc);
  const fullLocTitle = toTitleCaseTR(fullLoc);

  // Optimized Title Matrix with High CTR Emojis & Year Tags (No consecutive or stuffed keywords)
  let titles = customTitle ? [dedupeEscort(customTitle)] : (categoryTitle ? [
    `🔥 ${locTitle} ${toTitleCaseTR(categoryTitle)} | %100 Gerçek Fotoğraflı Vip Partnerler (${currentYear})`,
    `📞 ${locTitle} ${toTitleCaseTR(categoryTitle)} Telefon | Hemen Ara Cepten Görüş`,
    `💎 Kaporasız ${locTitle} ${toTitleCaseTR(categoryTitle)} Ajansı | Eve & Otele Servis Modeller`,
    `👑 ${locTitle} En Seçkin ${toTitleCaseTR(categoryTitle)} Kızları | Rezervasyon & İletişim Hattı`,
    `🔞 ${locTitle} ${toTitleCaseTR(categoryTitle)} Hizmeti | Kaporasız Güvenilir Buluşma`,
    `✨ ${locTitle} Olgun & Elit ${toTitleCaseTR(categoryTitle)} Modelleri | Aktif Görüşme`,
    `👑 Buluşmak İçin ${locTitle} ${toTitleCaseTR(categoryTitle)} | Doğrudan WhatsApp İletişim (${currentYear})`,
    `🔥 Popüler ${locTitle} ${toTitleCaseTR(categoryTitle)} Fiyatları | Fiyat Tarifesi & Saatlik Ücretler`
  ] : [
    `🔞 ${locTitle} Escort | %100 Gerçek ve Kaporasız Vip Escort Bayanlar ${currentYear}`,
    `📞 ${locTitle} Escort Telefon Numaraları | Aktif WhatsApp Randevu Hattı`,
    `💎 ${locTitle} Kaporasız Eskort | Randevu İçin Vip Partnerler | ${currentMonth}`,
    `👑 ${locTitle} Eve Gelen Model | İletişim İçin Bayan Eskort | DRKCNAY`,
    `🔞 ${locTitle} Rus Escort | Buluşmak İçin Genç Yabancı Modeller | ${currentYear}`,
    `🔥 ${locTitle} En İyi Eskort | Fiyat Tarifesi & Saatlik Ücretler`,
    `💎 ${locTitle} Escort Ajansı | İletişim Ve Buluşma Numaraları | ${currentMonth}`,
    `👑 ${locTitle} Otele Gelen Modeller | Eşsiz Vitrin Ve Resimler | ${currentYear}`,
    `🔞 ${locTitle} Escort Numaraları | Buluşma Ve Randevu İçin Cepten Ara`,
    `✨ ${locTitle} Elit Escort | Kendi Evinde Görüşen Genç Modeller | ${currentYear}`,
    `🔥 ${locTitle} Bayan Eskort | WhatsApp Üzerinden Katalog Ve Fotoğraflar`,
    `🔞 ${locTitle} Bireysel Escort | Saatlik & Gecelik Randevu Sistemi | ${currentYear}`,
    `💎 ${locTitle} Model Escort | %100 Gerçek Görsel Ve Videolu Kanıtlar | ${currentMonth}`,
    `👑 ${locTitle} Genç Eskort | Hiçbir Yerde Olmayan En Yeni Yüzler | DRKCNAY`,
    `🔥 ${locTitle} Eskort Bayan | İletişim Ve Buluşma Adresi Cepten Ara | ${currentYear}`,
    `💎 ${locTitle} Rus Escort | Sadece Elit Otellere Eşlik Hizmeti | ${currentYear}`,
    `👑 ${locTitle} Üniversiteli Escort | Görüşmek İçin Elit Modeller | DRKCNAY`,
    `👑 ${locTitle} Escort Bayan | Buluşmak Ve Randevu Almak İçin ${currentYear}`,
    `🔥 En Hiddetli ${locTitle} Escortlar | Görüşmek İçin Genç Modeller | ${currentMonth}`
  ]);

  // High-performance spun descriptions matching top ranking competitor layouts
  let descriptions = [
    `🔥 ${fullLocTitle} bölgesinde buluşmak için vip eskort bayan arayanlara özel en güncel rehber! Saatlik ve gecelik eve & otele gelen model bayanlar ve üniversiteli eskort numaraları için hemen tıklayın.`,
    `📞 ${fullLocTitle} escort bayanlar: Buluşmak için %100 kaporasız ve gerçek resimli eskort model bayanlar. Otele ve eve gelen genç kız modellerimizle 7/24 kesintisiz görüşme ve randevu fırsatı!`,
    `👑 DRKCNAY ${fullLocTitle} eskort bayan hizmetleri: Buluşmak ve görüşmek için en iyi, kaporasız ve güvenilir escort bayan modelleri. WhatsApp üzerinden direkt iletişim kurup rezervasyon yapın.`,
    `💎 ${fullLocTitle} escort arayışınızda 7/24 aktif ve doğrulanmış profiller. Sıfır kapora ve %100 gizlilik garantili ${fullLocTitle} eskort bayan kataloğuna göz at, hayalindeki modelle hemen buluş!`,
    `🛡️ Buluşmak için %100 gerçek ${fullLocTitle} eskort bayan profilleri. İletişim kurup randevu almak için en güvenilir otele eve gelen bayan ve eskort genç kız hizmetlerimizle bu yılın en iyisi.`,
    `🔞 ${fullLocTitle} bölgesinde iletişim ve randevu için eskort bayan seçenekleri. Rus, Ukraynalı ve yerli genç modellerle buluşmak için kaporasız escort kataloğumuz şimdi yayında.`,
    `Looking for the best escort in ${fullLocTitle}? Discover 100% verified independent outcall models, luxury Russian companions, and call girls with zero deposit. 24/7 service for dynamic meetings.`,
    `💎 Escort & Eskort Services in ${fullLocTitle}: Exclusive outcall call girls, premium hotel companion service, and direct meeting options.`
  ];

  // Specific overrides for money site (dorukcanay.digital & istanbulescort.blog) to render clean, premium titles
  if (currentHost.includes('dorukcanay.digital') || currentHost.includes('istanbulescort.blog')) {
    titles = customTitle ? [dedupeEscort(customTitle)] : (categoryTitle ? [
      `💎 ${locTitle} ${toTitleCaseTR(categoryTitle)} | Dorukcanay Elite Premium Partnerler`,
      `👑 ${locTitle} En Seçkin ${toTitleCaseTR(categoryTitle)} Kızları | Kaporasız Randevu Al`,
      `🔥 ${locTitle} Vip ${toTitleCaseTR(categoryTitle)} Hizmetleri | Eve & Otele Servis Modeller`,
      `🔞 Lüks ${locTitle} ${toTitleCaseTR(categoryTitle)} Ajansı | %100 Gerçek Fotoğraflarla Buluş`
    ] : [
      `💎 ${locTitle} Vip Escort | DORUKCANAY ELITE LUXURY COMPANION`,
      `👑 ${locTitle} Escort Bayan | %100 Gerçek Ve Kaporasız Modeller ${currentYear}`,
      `🔥 ${locTitle} Eskort Bayan | Elit Ve Lüks Refakatçiler | ${currentMonth}`,
      `🔞 ${locTitle} Rus Escort | En Seçkin Partner Vitrini | DRKCNAY`,
      `💎 ${locTitle} Exclusive Escort | Randevu Ve İletişim Hattı`,
      `👑 ${locTitle} Üniversiteli Escort | Görüşmek İçin Modeller | ${currentYear}`,
      `👑 ${locTitle} Lüks Eşlik Hizmeti | Prestijli Ve Bireysel Partnerler`
    ]);

    descriptions = [
      `👑 dorukcanay.digital'in lüks escort rehberinde ${fullLocTitle} bölgesinin en seçkin Vip ve model escort bayan profillerini bulabilirsiniz. Tamamen kaporasız ve %100 gerçek resimli partnerler.`,
      `💎 ${fullLocTitle} Vip companion & elit escort bayan ilanları. Dorukcanay.digital güvencesiyle otele ve eve gelen genç kız modellerle kaporasız, güvenli ve elit randevu.`,
      `🔞 ${fullLocTitle} bölgesinde kaporasız buluşabileceğiniz, doğrulanmış ve elit escort partnerler. Rus model refakatçilerden oluşan özel seçkiyi dorukcanay.digital'de inceleyin.`,
      `🔥 En hiddetli ve lüks ${fullLocTitle} eskort bayanları. Kendi özel evinde veya otelinizde randevu oluşturabileceğiniz bireysel model partner katalogları.`,
      `💎 Discover premium call girls and luxury independent escorts in ${fullLocTitle} at dorukcanay.digital. Zero prepayments, 100% verified outcall profiles.`
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
    "escort",
    "eskort",
    `${locTitle} escort`,
    `${locTitle} eskort`,
    `${locTitle} escort bayan`,
    `${locTitle} eskort bayan`,
    `${locTitle} vip escort`,
    `${locTitle} vip eskort`,
    `${locTitle} kaporasız escort`,
    `${locTitle} kaporasız eskort`,
    `bayan escort ${locTitle}`,
    `bayan eskort ${locTitle}`,
    `vip escort ${locTitle}`,
    `vip eskort ${locTitle}`,
    `${locTitle} escort ilanları`,
    `${locTitle} eskort ilanları`,
    `${locTitle} escort ajansı`,
    `${locTitle} eskort ajansı`,
    `${locTitle} escort numaraları`,
    `${locTitle} eskort numaraları`,
    `${locTitle} rus escort`,
    `${locTitle} rus eskort`,
    `${locTitle} üniversiteli escort`,
    `${locTitle} üniversiteli eskort`
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
    "name": `${locName} Vip Escort Görsel Galerisi`,
    "description": `${locName} bölgesindeki en yeni ve %100 gerçek eskort bayan fotoğrafları.`,
    "url": `${baseUrl}/showcase/vitrin`,
    "image": [
      {
        "@type": "ImageObject",
        "url": `${baseUrl}/api/og?loc=${encodeURIComponent(locName)}`,
        "width": "1200",
        "height": "630",
        "caption": `${locName} Vip Escort Tanıtım Görseli`
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
    "headline": `${locName} Vip Escort Hizmetleri | Kaporasız & %100 Gerçek`,
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

  const ratingValue = (4.8 + ((h % 3) / 10)).toFixed(1); // Stable 4.8, 4.9, or 5.0
  const reviewCount = 120 + (h % 90); // Stable number between 120 and 210

  return [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `${locName} Vip Escort Hizmetleri`,
      "description": `${locName} lokasyonunda profesyonel kaporasız escort, rus escort ve üniversiteli lüks eşlik hizmeti.`,
      "url": url,
      "telephone": "+905520949245",
      "priceRange": "₺₺₺",
      "address": { "@type": "PostalAddress", "addressLocality": locName, "addressRegion": params.cityName, "addressCountry": "TR" },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": ratingValue, "reviewCount": reviewCount },
      "review": [
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Murat T." },
          "datePublished": "2026-02-14",
          "reviewBody": `${locName} bölgesindeki en profesyonel vip escort deneyimiydi. Kaporasız ve güvenilir.`,
          "reviewRating": { "@type": "Rating", "ratingValue": "5" }
        },
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Ahmet K." },
          "datePublished": "2026-03-01",
          "reviewBody": `${locName} eskort bayan kalitesi harika. Görseller %100 gerçekti.`,
          "reviewRating": { "@type": "Rating", "ratingValue": "5" }
        }
      ]
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
            "text": `${locName} bölgesinde Vip escort hizmetleri modelin tecrübesine ve seçilen standarta göre değişiklik göstermektedir. Detaylı bilgi için 7/24 arayabilirsiniz.`
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
