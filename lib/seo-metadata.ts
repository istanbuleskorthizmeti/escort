import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { dedupeEscort } from "./utils";

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
    `🔥 ${exactMatchLoc} ${categoryTitle} | %100 Gerçek Escortlar (${currentYear}) | DRKCNAY`,
    `💎 KAPORASIZ ${exactMatchLoc} ${categoryTitle} | Rus & Eve Gelen Escortlar | ${currentMonth}`,
    `👑 ${exactMatchLoc} ${categoryTitle} | VIP Rus & Üniversiteli Escort | DRKCNAY`,
    `🛡️ ${exactMatchLoc} ${categoryTitle} | %100 Doğrulanmış & Gerçek | ${currentYear} Elit`,
    `🔞 ${exactMatchLoc} En İyi ${categoryTitle} | Kaporasız & Güvenilir | DRKCNAY`,
    `✨ ${exactMatchLoc} VIP ${categoryTitle} | Lüks Otele Servis Escortlar | ${currentYear}`
  ] : [
    `🔞 ${exactMatchLoc.toUpperCase()} ESCORT BAYAN | %100 GERÇEK ESCORTLAR ${currentYear}`,
    `💎 ${exactMatchLoc.toUpperCase()} KAPORASIZ ESCORT | RUS & ÜNİVERSİTELİ | ${currentMonth}`,
    `👑 ${exactMatchLoc.toUpperCase()} EVE GELEN ESCORT | 7/24 VIP HİZMET | DRKCNAY`,
    `🔞 ${exactMatchLoc.toUpperCase()} RUS ESCORT | EVE & OTELE SERVİS | ${currentYear}`,
    `🔥 ${exactMatchLoc.toUpperCase()} EN İYİ ESCORT | LÜKS & KAPORASIZ | DRKCNAY`,
    `💎 ${exactMatchLoc.toUpperCase()} ESCORT AJANSI | RUS & UKRAYNALI MODELLER | ${currentMonth}`,
    `👑 ${exactMatchLoc.toUpperCase()} OTELE GELEN ESCORT | %100 GİZLİLİK | ${currentYear}`,
    `🔞 ${exactMatchLoc.toUpperCase()} ESCORT NUMARALARI | GERÇEK VİTRİN | DRKCNAY`,
    `✨ ${exactMatchLoc.toUpperCase()} VIP ESCORT | ELİT & SINIRSIZ DENEYİM | ${currentYear}`,
    `🔥 ${exactMatchLoc.toUpperCase()} REFAKATÇİ | LÜKS & PRESTİJLİ ESCORT | DRKCNAY`,
    `🔞 ${exactMatchLoc.toUpperCase()} BİREYSEL ESCORT | %100 DOĞAL & GERÇEK | ${currentYear}`,
    `💎 ${exactMatchLoc.toUpperCase()} MODEL ESCORT | İSTANBUL'UN EN HİDDETLİSİ | ${currentMonth}`,
    `👑 ${exactMatchLoc.toUpperCase()} GENÇ ESCORT | ÜNİVERSİTELİ & ÇITIR | DRKCNAY`,
    `🔥 ${exactMatchLoc.toUpperCase()} VIP ESCORT | ÖZEL ESCORT REHBERİ | ${currentYear}`,
    `💎 ${exactMatchLoc.toUpperCase()} RUS ESCORT | %100 GERÇEK GÖRSEL | ${currentYear}`,
    `👑 ${exactMatchLoc.toUpperCase()} ÜNİVERSİTELİ ESCORT | ÇITIR & GENÇ | DRKCNAY`
  ]);

  const descriptions = [
    `${fullLoc} bölgesinde en hiddetli VIP escort deneyimi için DRKCNAY farkıyla tanışın. %100 gerçek görselli kaporasız rus escort, eve gelen çıtır bayanlar ve otele servis modeller. ${currentMonth} ${currentYear} güncel rehber.`,
    `🔥 ${fullLoc} escort bayanlar: Kaporasız ve %100 gerçek görselli elit escortlar. Otele ve eve servis sağlayan en iyi escortlar. ${fullLoc} bölgesinin en seçkin ve hiddetli escort vitrini burada!`,
    `👑 DRKCNAY ${fullLoc} VIP escort ajansı: Bölgenin en kaliteli, kaporasız ve gizlilik odaklı escort modelleri. Seçkin etkinlikler için lüks rus escortlar ve üniversiteli VIP çıtır bayanlar.`,
    `💎 ${fullLoc} escort arayışınızda lüks ve güvenilirlik. Yüksek gizlilik, %100 gerçek fotoğraflı ve kaporasız ${fullLoc} elit escort deneyimi için hemen kataloğu incele ve 7/24 hiddetli modellerimizi ara.`,
    `🛡️ %100 Doğrulanmış ${fullLoc} escort profilleri. DRKCNAY güvencesiyle kaporasız, fotoğrafları onaylı ve yüksek gizlilik standartlı otele gelen escort hizmetleriyle ${currentYear} yılının en iyisi.`,
    `🔞 ${fullLoc} bölgesinde VIP concierge ve elit escort bayanlar. Rus, Ukraynalı ve yerli üniversiteli çıtırlarla prestijli buluşma. ${currentMonth} ayı özel kaporasız escort kataloğu şimdi yayında.`,
    `🔥 ${fullLoc} escort protokolü: Sadece elit beyefendilere özel kaporasız ve gizli eşlik hizmeti. ${fullLoc} bölgesinin en vizyoner, lüks ve hiddetli escort rehberiyle hemen tanışın.`,
    `👑 En iyi ${fullLoc} VIP escort deneyimi ve gece hayatı rehberliği. %100 teyitli profiller, gerçek görseller ve kaporasız elit hizmet anlayışıyla DRKCNAY ağında yerinizi alın.`
  ];

  const titleIdx = (rand(titles.length) + (neighborhood ? 1 : 0)) % titles.length;
  const descIdx = (rand(descriptions.length) + (district ? 2 : 0)) % descriptions.length;

  const keywords = [
    `${exactMatchLoc} escort`, `${exactMatchLoc} vip escort`, `${exactMatchLoc} escort bayan`,
    `${exactMatchLoc} rus escort`, `${cityName} escort`, `${exactMatchLoc} üniversiteli escort`,
    `${exactMatchLoc} eve servis escort`, `${exactMatchLoc} otel escort`, `${locName} escort numaraları`,
    `${exactMatchLoc} çıtır escort`, `${exactMatchLoc} kaporasız escort`, `${exactMatchLoc} elit escort`,
    `${exactMatchLoc} otele gelen escort`, `${exactMatchLoc} eve gelen escort`, `${exactMatchLoc} gerçek escort`,
    `${exactMatchLoc} lüks escort`, `${exactMatchLoc} seksi escort`, `${exactMatchLoc} vahşi escort`,
    `${exactMatchLoc} kamerasız ifşa`, `${exactMatchLoc} gizli çekim`
  ];

  const url = `${baseUrl}/${city}${district ? `/${district}` : ""}${neighborhood ? `/${neighborhood}` : ""}`;

  return {
    title: dedupeEscort(titles[titleIdx]),
    description: dedupeEscort(descriptions[descIdx]),
    keywords: keywords.join(', '),
    metadataBase: new URL(baseUrl),
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
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
    }
  };
}

export function generateStructuredData(params: MetaParams) {
  const locName = params.landmarkName || params.neighborhoodName || params.districtName || params.cityName;
  const targetDomain = params.domain || siteConfig.domain;
  const baseUrl = targetDomain.startsWith('http') ? targetDomain : `https://${targetDomain}`;
  const url = `${baseUrl}/${params.city}${params.district ? `/${params.district}` : ""}`;
  
  // 🖼️ [HYDRA-VISUAL] Image Gallery Schema for Aggressive Image SEO
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
        "caption": `${locName} VIP Escort Tanıtım Görseli`
      },
      {
        "@type": "ImageObject",
        "url": `${baseUrl}/_media/vitrin/seo_1_vip-1.jpg`,
        "caption": `${locName} Elit Model - DRKCNAY`
      },
      {
        "@type": "ImageObject",
        "url": `${baseUrl}/_media/vitrin/seo_2_vip-16.jpg`,
        "caption": `${locName} Rus Escort Görseli`
      }
    ]
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `${locName} VIP Escort Ajansı`,
      "description": `${locName} lokasyonunda profesyonel kaporasız escort, rus escort ve üniversiteli lüks eşlik hizmeti.`,
      "url": url,
      "telephone": "+905520949245",
      "priceRange": "₺₺₺",
      "address": { "@type": "PostalAddress", "addressLocality": locName, "addressRegion": params.cityName, "addressCountry": "TR" },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": Math.floor(Math.random() * 50) + 120 }
    },
    imageGallerySchema,
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `${locName} escort fiyatları ne kadar?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${locName} bölgesinde VIP escort hizmetleri modelin tecrübesine ve seçilen protokole göre değişiklik göstermektedir. Detaylı bilgi için 7/24 arayabilirsiniz.`
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
