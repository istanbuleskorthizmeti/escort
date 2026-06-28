import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { dedupeEscort, toTitleCaseTR } from "./utils";
import { getDomainConfig } from "@/config/domains";
import { getSeededRandom, hashString, parseSpintax } from "./seo/spintax";
import {
  STANDARD_TITLES,
  MONEY_SITE_TITLES,
  STANDARD_DESCRIPTIONS,
  MONEY_SITE_DESCRIPTIONS
} from "./seo/templates";

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
  alternates?: any;
  domain?: string;
  isHome?: boolean;
}

/**
 * Next.js SEO METADATA & SCHEMA GENERATOR ENGINE (V4.0 - Ultra Spintax)
 * Optimized using deep semantic patterns, LCG seeded randomizer, and automatic canonical mapping.
 */
export function generateLocationMetadata({
  city,
  cityName,
  district,
  districtName,
  neighborhood,
  neighborhoodName,
  categoryTitle,
  customTitle,
  alternates,
  domain = siteConfig.domain,
  isHome = false,
}: MetaParams): Metadata {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('tr-TR', { month: 'long' }).format(new Date());
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  
  const currentHost = domain.replace(/^www\./, '').toLowerCase();
  const currentDomainConfig = getDomainConfig(currentHost);
  const isMoneySite = currentDomainConfig?.role === 'MONEY_SITE' || currentHost.includes('dorukcanay.digital') || currentHost.includes('istanbulescort.blog');
  
  const targetBaseUrl = baseUrl;
  const shouldIndex = true;

  const locName = (neighborhoodName || districtName || cityName)
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

  const locTitle = toTitleCaseTR(exactMatchLoc);
  const fullLocTitle = toTitleCaseTR(fullLoc);

  // Deterministic seed generation based on host and location to ensure stability per URL
  const seed = hashString(fullLoc + city + currentHost);
  const randomFn = getSeededRandom(seed);

  // Select Spintax Arrays
  const titleTemplates = isMoneySite ? MONEY_SITE_TITLES : STANDARD_TITLES;
  const descTemplates = isMoneySite ? MONEY_SITE_DESCRIPTIONS : STANDARD_DESCRIPTIONS;

  // Pick one template using seeded random
  const selectedTitleTemplate = customTitle 
    ? customTitle 
    : (categoryTitle 
        ? `{🔞|🔥|💎|👑|✨} {locTitle} ${toTitleCaseTR(categoryTitle)} | {%100 Gerçek|Kaporasız|Ön Ödemesiz} Vip Partnerler (${currentYear})`
        : titleTemplates[randomFn() % titleTemplates.length] ?? titleTemplates[0]
      );

  const selectedDescTemplate = descTemplates[randomFn() % descTemplates.length] ?? descTemplates[0];

  // Parse spintax and inject location variables
  const formatSpintax = (template: string): string => {
    // Replace custom tokens manually before spintax parsing
    const prepared = template
      .split("{locTitle}").join(locTitle)
      .split("{fullLocTitle}").join(fullLocTitle)
      .split("{currentYear}").join(currentYear.toString())
      .split("{currentMonth}").join(currentMonth)
      .split("{host}").join(currentHost);
    return parseSpintax(prepared, randomFn);
  };

  let finalTitle = dedupeEscort(formatSpintax(selectedTitleTemplate));
  let finalDesc = dedupeEscort(formatSpintax(selectedDescTemplate));

  if (currentHost.includes('istanbulescort.blog')) {
    const customTitles = [
      `🔥 ${locTitle} Escort Bayan | ${locTitle} VIP Ateşli Eskort ❤️🔥`,
      `👑 ${locTitle} Eskort Kraliçe Randevu | %100 Gerçek & Lüks Partner 💋`,
      `✨ ${locTitle} VIP Ateşli Eskort | Muhteşem Ve Unutulmaz Geceler 😈`,
      `💎 ${locTitle} Escort Bayan | Sultan Sınıfı Gizli Ve Lüks Randevu 🌹`,
      `👑 ${locTitle} Eskort Kraliçe Randevu | Muhteşem VIP Eşlik Hizmeti ✨`,
      `❤️🔥 ${locTitle} VIP Ateşli Eskort | Unutulmaz Sultan Randevusu 💋`,
      `😈 ${locTitle} Escort Bayan | Gizli & Ateşli VIP Deneyimi 👑`,
      `🌹 ${locTitle} Eskort Kraliçe Randevu | %100 Gerçek VIP Sultanlar 💎`
    ];

    const customDescs = [
      `❤️ ${fullLocTitle} escort bayan rehberi: Ateşli, gizli ve lüks %100 gerçek VIP kraliçe partnerler. Unutulmaz ve muhteşem bir sultan randevusu için hemen arayın! 🔥`,
      `👑 ${fullLocTitle} eskort kraliçe randevu: Lüks ve gizli VIP eskortlar ile muhteşem bir deneyim. %100 gerçek ve ateşli sultanlar ile unutulmaz geceler sizi bekliyor! 💋`,
      `✨ ${fullLocTitle} VIP ateşli eskort ilanları: Gizli, lüks ve %100 gerçek kraliçe partnerler. Muhteşem eskort bayanlar ile unutulmaz anlar yaşamak için hemen tıklayın! 😈`,
      `💎 ${fullLocTitle} escort bayan: Ateşli ve gizli buluşmalar için lüks VIP kraliçeler. %100 gerçek ve muhteşem sultan randevuları ile unutulmaz dakikalar! 🌹`
    ];

    finalTitle = customTitles[seed % customTitles.length];
    finalDesc = customDescs[seed % customDescs.length];
  }

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
    `${locTitle} eskort numaraları`
  ];

  const url = isHome ? `${targetBaseUrl}/` : `${targetBaseUrl}/${city}${district ? `/${district}` : ""}${neighborhood ? `/${neighborhood}` : ""}`;

  return {
    title: finalTitle,
    description: finalDesc,
    keywords: keywords.join(', '),
    metadataBase: new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`),
    alternates: { 
      canonical: url, 
      languages: {
        'tr-TR': url,
        'en-US': `${url}?lang=en`,
        'ru-RU': `${url}?lang=ru`,
        'de-DE': `${url}?lang=de`,
        'ar-AE': `${url}?lang=ar`,
        'x-default': url,
        ...alternates?.languages
      },
      ...alternates 
    },
    openGraph: {
      title: finalTitle,
      description: finalDesc,
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
          url: `${baseUrl}/_media/vitrin/vip-profil-${((seed % 58) + 1)}.webp`,
          width: 800,
          height: 1200,
          alt: `${toTitleCaseTR(locName)} Elit Escort Görseli`
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDesc,
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
 * Generates Structured Schema Markup conforming to Google Guidelines
 */
export function generateStructuredData(params: MetaParams) {
  const locName = toTitleCaseTR(params.landmarkName || params.neighborhoodName || params.districtName || params.cityName);
  const targetDomain = params.domain || siteConfig.domain;
  const baseUrl = targetDomain.startsWith('http') ? targetDomain : `https://${targetDomain}`;
  const url = `${baseUrl}/${params.city}${params.district ? `/${params.district}` : ""}`;
  
  const authors = [
    { name: "Dr. Dorukcan Ay", jobTitle: "Kıdemli Dijital İletişim Uzmanı", alumni: "Stanford University", linkedin: `${baseUrl}/go/linkedin-dorukcan` },
    { name: "Prof. Dr. Eda Nur", jobTitle: "Kentsel Sosyoloji Analisti", alumni: "Harvard Medical School", linkedin: `${baseUrl}/go/linkedin-edanur` }
  ];
  
  const h = hashString(locName + targetDomain);
  const selectedAuthor = authors[h % authors.length] ?? authors[0];

  const ratingValue = (4.8 + ((h % 3) / 10)).toFixed(1);
  const reviewCount = 120 + (h % 90);

  return [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `${locName} VIP Escort Hizmetleri`,
      "description": `${locName} lokasyonunda profesyonel kaporasız escort, rus escort ve üniversiteli lüks eşlik hizmeti.`,
      "url": url,
      "telephone": "+90 501 635 50 53",
      "priceRange": "₺₺₺",
      "address": { "@type": "PostalAddress", "addressLocality": locName, "addressRegion": params.cityName, "addressCountry": "TR" },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": ratingValue, "reviewCount": reviewCount },
      "review": [
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Murat T." },
          "datePublished": "2026-02-14",
          "reviewBody": `${locName} bölgesindeki en profesyonel VIP escort deneyimiydi. Kaporasız ve güvenilir.`,
          "reviewRating": { "@type": "Rating", "ratingValue": "5" }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `${locName} escort fiyatları ne kadar?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${locName} bölgesinde VIP escort hizmetleri escortun tecrübesine ve seçilen standarta göre değişiklik göstermektedir. Detaylı bilgi için 7/24 arayabilirsiniz.`
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
