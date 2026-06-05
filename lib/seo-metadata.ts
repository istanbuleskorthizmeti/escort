import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { dedupeEscort } from "./utils";
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
}

/**
 * DRKCNAY Elite SEO METADATA GENERATOR v2.1
 * Updated with Custom Title support for deep-tail SEO.
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
    const targetDistrict = currentDomainConfig.targetDistrict?.toLowerCase();
    const currentDistrict = district?.toLowerCase();
    
    if (currentDistrict) {
      if (targetDistrict && currentDistrict !== targetDistrict) {
        shouldIndex = false;
        
        // Find dedicated domain for current district
        const dedicatedDomain = DOMAIN_MATRIX.find(d => 
          d.role === 'SATELLITE' && 
          d.targetDistrict?.toLowerCase() === currentDistrict
        );
        
        if (dedicatedDomain) {
          targetBaseUrl = `https://${dedicatedDomain.host}`;
        } else {
          targetBaseUrl = 'https://istanbulescdrkcn.com';
        }
      }
    } else {
      // If city page (e.g. /istanbul) is visited on a district-specific satellite, canonicalize to money site to avoid duplicate content
      if (targetDistrict) {
        shouldIndex = false;
        targetBaseUrl = 'https://istanbulescdrkcn.com';
      }
    }
  }

  const locName = (landmarkName || neighborhoodName || districtName || cityName).replace(/escort|eskort/gi, '').replace(/[-\u2013\u2014]/g, ' ').replace(/\s+/g, ' ').trim();
  const exactMatchLoc = (neighborhoodName || districtName || cityName).replace(/escort|eskort/gi, '').replace(/[-\u2013\u2014]/g, ' ').replace(/\s+/g, ' ').trim();
  const fullLoc = neighborhoodName ? `${cityName} ${districtName} ${neighborhoodName}`.replace(/[-\u2013\u2014]/g, ' ') : (districtName ? `${cityName} ${districtName}`.replace(/[-\u2013\u2014]/g, ' ') : cityName.replace(/[-\u2013\u2014]/g, ' '));

  const hashStr = fullLoc + city + domain;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < hashStr.length; i++) {
    h = Math.imul(h ^ hashStr.charCodeAt(i), 16777619);
  }
  const rand = (limit: number) => (h >>> 0) % limit;

  // Use custom title if provided, otherwise pick from aggressive matrix
  const titles = customTitle ? [dedupeEscort(customTitle)] : (categoryTitle ? [
    `🔥 ${exactMatchLoc} ${categoryTitle} | Buluşmak İçin Çıtır Escortlar (${currentYear}) | DRKCNAY`,
    `💎 KAPORASIZ ${exactMatchLoc} ${categoryTitle} | Randevu İçin Bayan Eskort Gacılar | ${currentMonth}`,
    `👑 ${exactMatchLoc} ${categoryTitle} | İletişim İçin Genç Kız & Kadın Escort | DRKCNAY`,
    `🛡️ ${exactMatchLoc} ${categoryTitle} | Buluşmak İçin %100 Gerçek Bayanlar | ${currentYear}`,
    `🔞 ${exactMatchLoc} En İyi ${categoryTitle} | Randevu İçin Eskort Çıtırlar | DRKCNAY`,
    `✨ ${exactMatchLoc} Çıtır Gacılar | İletişim İçin Bayan Escortlar | ${currentYear}`,
    `👑 Buluşmak İçin ${exactMatchLoc} Escort | Çıtır Gacı & Bayan Randevu (${currentYear})`,
    `🔥 En Hiddetli ${exactMatchLoc} Eskortlar | İletişim ve Randevu İçin`
  ] : [
    `🔞 ${exactMatchLoc.toUpperCase()} ESCORT BAYAN | BULUŞMAK İÇİN ESKORTLAR ${currentYear}`,
    `💎 ${exactMatchLoc.toUpperCase()} KAPORASIZ ESCORT | RANDEVU İÇİN ÇITIR GACI | ${currentMonth}`,
    `👑 ${exactMatchLoc.toUpperCase()} EVE GELEN ESCORT | İLETİŞİM İÇİN BAYAN ESKORT | DRKCNAY`,
    `🔞 ${exactMatchLoc.toUpperCase()} RUS ESCORT | BULUŞMAK İÇİN GENÇ KIZLAR | ${currentYear}`,
    `🔥 ${exactMatchLoc.toUpperCase()} EN İYİ ESKORT | RANDEVU İÇİN ÇITIR GACILAR | DRKCNAY`,
    `💎 ${exactMatchLoc.toUpperCase()} ESCORT AJANSI | İLETİŞİM VE BULUŞMA NUMARALARI | ${currentMonth}`,
    `👑 ${exactMatchLoc.toUpperCase()} OTELE GELEN ESCORT | GENÇ KIZ VE BAYAN | ${currentYear}`,
    `🔞 ${exactMatchLoc.toUpperCase()} ESCORT NUMARALARI | RANDEVU VE BULUŞMA İÇİN | DRKCNAY`,
    `✨ ${exactMatchLoc.toUpperCase()} ÇITIR GACI | BULUŞMAK İÇİN GENÇ KIZLAR | ${currentYear}`,
    `🔥 ${exactMatchLoc.toUpperCase()} BAYAN ESKORT | İLETİŞİM İÇİN ÇITIR GACI | DRKCNAY`,
    `🔞 ${exactMatchLoc.toUpperCase()} BİREYSEL ESCORT | BULUŞMAK İÇİN SEKSİ BAYAN | ${currentYear}`,
    `💎 ${exactMatchLoc.toUpperCase()} MODEL ESCORT | RANDEVU İÇİN GENÇ KIZ ESKORT | ${currentMonth}`,
    `👑 ${exactMatchLoc.toUpperCase()} GENÇ ESKORT | BULUŞMAK VE GÖRÜŞMEK İÇİN | DRKCNAY`,
    `🔥 ${exactMatchLoc.toUpperCase()} ÇITIR GACI | İLETİŞİM VE BULUŞMA ADRESİ | ${currentYear}`,
    `💎 ${exactMatchLoc.toUpperCase()} RUS ESCORT | RANDEVU İÇİN BAYAN ESKORTLAR | ${currentYear}`,
    `👑 ${exactMatchLoc.toUpperCase()} ÜNİVERSİTELİ ESCORT | GÖRÜŞMEK İÇİN GACILAR | DRKCNAY`,
    `👑 ${exactMatchLoc.toUpperCase()} ESCORT BAYAN | BULUŞMAK VE RANDEVU ALMAK İÇİN ${currentYear}`,
    `🔥 EN HİDDETLİ ${exactMatchLoc.toUpperCase()} ESCORTS | GÖRÜŞMEK İÇİN GENÇ KIZLAR | ${currentMonth}`
  ]);

  const descriptions = [
    `${fullLoc} bölgesinde buluşmak için eskort gacı arayanlara özel en güncel rehber! İletişim ve randevu için eve gelen çıtır bayanlar, otele gelen rus escortlar ve üniversiteli genç kız seçenekleri burada.`,
    `🔥 ${fullLoc} escort bayanlar: Buluşmak için kaporasız ve %100 gerçek fotoğraflı eskort çıtırlar. Otele eve gelen en seksi genç kızlar. Randevu ve iletişim için 7/24 hiddetli gacı modellerimiz yayında!`,
    `👑 DRKCNAY ${fullLoc} eskort gacı hizmetleri: Buluşmak ve görüşmek için en iyi, kaporasız ve güvenilir escort bayan modelleri. Randevu almak için çıtır genç kızlar ve olgun kadın alternatifleri.`,
    `💎 ${fullLoc} escort arayışınızda iletişim ve buluşma kolaylığı. %100 gerçek görselli ve kaporasız ${fullLoc} eskort gacı deneyimi için hemen kataloğu incele, randevu için 7/24 modellerimizi ara.`,
    `🛡️ Buluşmak için %100 gerçek ${fullLoc} eskort gacı profilleri. İletişim kurup randevu almak için en güvenilir otele eve gelen çıtır bayan ve eskort genç kız hizmetlerimizle bu yılın en iyisi.`,
    `🔞 ${fullLoc} bölgesinde iletişim ve randevu için eskort gacı bayan seçenekleri. Rus, Ukraynalı ve yerli çıtır genç kızlarla buluşmak için kaporasız escort kataloğumuz şimdi yayında.`,
    `Looking for the best escort in ${fullLoc}? Discover 100% verified independent outcall models, luxury Russian companions, and call girls with zero deposit. 24/7 service for dynamic meetings.`,
    `💎 Escort & Eskort Services in ${fullLoc}: Exclusive outcall call girls, premium hotel companion service, and direct meeting options.`
  ];

  // FNV-1a Hash to get unique deterministic variant based on host
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
    `${exactMatchLoc} eve servis eskort`, `${exactMatchLoc} otel escort`, `${locName} eskort numaraları`,
    `${exactMatchLoc} çıtır gacı`, `${exactMatchLoc} kaporasız eskort`, `${exactMatchLoc} bayan eskort`,
    `${exactMatchLoc} otele gelen gacı`, `${exactMatchLoc} eve gelen bayan`, `${exactMatchLoc} gerçek eskort`,
    `${exactMatchLoc} lüks escort`, `${exactMatchLoc} seksi bayan`, `${exactMatchLoc} çıtır eskort`,
    `${exactMatchLoc} buluşmak için escort`, `${exactMatchLoc} randevu için eskort`, `${exactMatchLoc} iletişim için eskort`,
    `escort bayan ${exactMatchLoc}`, `eskort gacı ${exactMatchLoc}`, `bayan eskort ${exactMatchLoc}`,
    `no deposit escort ${exactMatchLoc}`, `call girls in ${exactMatchLoc}`, `çıtır gacı ${exactMatchLoc}`,
    `best escort ${exactMatchLoc}`, `hotel eskort ${exactMatchLoc}`, `bayan escort ${exactMatchLoc}`,
    `çıtır eskort ${exactMatchLoc}`, `escort service ${exactMatchLoc}`, `görüşmek için eskort`,
    `${exactMatchLoc} kamerasız ifşa`, `${exactMatchLoc} gizli çekim`
  ];

  const url = `${targetBaseUrl}/${city}${district ? `/${district}` : ""}${neighborhood ? `/${neighborhood}` : ""}`;

  return {
    title: dedupeEscort(titles[titleIdx]),
    description: dedupeEscort(descriptions[descIdx]),
    keywords: keywords.join(', '),
    metadataBase: new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`),
    alternates: { canonical: url, ...alternates },
    openGraph: {
      title: titles[titleIdx],
      description: descriptions[descIdx],
      url: url,
      siteName: domain.toUpperCase(),
      locale: "tr_TR",
      type: "website",
      images: [
        { 
          url: `${baseUrl}/api/og?loc=${encodeURIComponent(locName)}`, 
          width: 1200, 
          height: 630, 
          alt: `${locName} VIP Escort Vahşi Vitrin ${currentYear}` 
        },
        {
          url: `${baseUrl}/_media/vitrin/vip-profil-${(rand(58) + 1)}.webp`,
          width: 800,
          height: 1200,
          alt: `${locName} Elit Model Görseli - DRKCNAY`
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[titleIdx],
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

export function generateStructuredData(params: MetaParams) {
  const locName = params.landmarkName || params.neighborhoodName || params.districtName || params.cityName;
  const targetDomain = params.domain || siteConfig.domain;
  const baseUrl = targetDomain.startsWith('http') ? targetDomain : `https://${targetDomain}`;
  const url = `${baseUrl}/${params.city}${params.district ? `/${params.district}` : ""}`;
  
  // 📚 Dynamic High-EEAT Expert Authors (Black Hat/Gray Hat EEAT Spoofing)
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

  // 🖼️ [HYDRA-VISUAL] Image Gallery Schema (1200px compliant for Discover)
  const imageGallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": `${locName} VIP Escort Görsel Galerisi`,
    "description": `${locName} bölgesindeki en yeni ve %100 gerçek escort bayan fotoğrafları.`,
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
        "caption": `${locName} Elit Model - DRKCNAY`
      },
      {
        "@type": "ImageObject",
        "url": `${baseUrl}/_media/vitrin/vip-profil-24.webp`,
        "width": "1200",
        "height": "1800",
        "caption": `${locName} Rus Escort Görseli`
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
    "description": `${locName} lokasyonunda lüks ve kaporasız rus ve üniversiteli escort refakatçilik hizmetine dair bağımsız uzman analizi.`,
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
            "text": `${locName} bölgesinde VIP escort hizmetleri modelin tecrübesine ve seçilen standarte göre değişiklik göstermektedir. Detaylı bilgi için 7/24 arayabilirsiniz.`
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
