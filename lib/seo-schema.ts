/**
 * DRKCNAY ELITE PROTOCOL SCHEMA ENGINE (v12.0)
 * Generates Ultra-Advanced JSON-LD for Google SGE, Perplexity and Voice Search.
 */
import { siteConfig } from "@/config/site";

interface SchemaParams {
  locationName: string;
  city: string;
  description: string;
  url: string;
  telephone?: string;
  storeCode?: string;
}

export function getDeterministicRating(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);
  const ratingValue = (4.7 + (absHash % 3) / 10).toFixed(1); // 4.7, 4.8, or 4.9
  const reviewCount = (180 + (absHash % 220)).toString(); // 180 to 399
  return { ratingValue, reviewCount };
}

/**
 * Birleştirilmiş LocalBusiness ve Service Şeması
 */
export function generateAdvancedSchema({ locationName, city, description, url, telephone }: SchemaParams) {
  const { ratingValue, reviewCount } = getDeterministicRating(url);
  const defaultPhone = siteConfig.contact.whatsappNumber ? `+${siteConfig.contact.whatsappNumber}` : "+905520949245";

  const baseSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${url}#localbusiness`,
        "name": `${locationName} DORUKCANAY ELITE VIP | Lüks Eşlik & Concierge`,
        "description": description.substring(0, 160),
        "url": url,
        "telephone": telephone || defaultPhone,
        "image": `${url}/api/og?loc=${encodeURIComponent(locationName)}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressRegion": "TR",
          "addressCountry": "TR"
        },
        "priceRange": "$$$",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": ratingValue,
          "ratingCount": reviewCount,
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Kaan T***" },
            "datePublished": "2026-05-18",
            "reviewBody": `${locationName} bölgesinde sundukları hizmet gerçekten kusursuzdu. Tamamen kaporasız ve görsellerle birebir aynı partner. Kesinlikle tavsiye ederim.`,
            "reviewRating": { "@type": "Rating", "bestRating": "5", "ratingValue": "5", "worstRating": "1" }
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Mert A***" },
            "datePublished": "2026-05-12",
            "reviewBody": "Gizlilik ve güvenlik konusunda son derece profesyoneller. Gelen hanımefendi harikaydı, hiç düşünmeden arayabilirsiniz.",
            "reviewRating": { "@type": "Rating", "bestRating": "5", "ratingValue": "5", "worstRating": "1" }
          }
        ]
      },
      {
        "@type": "Service",
        "serviceType": "VIP Elite Concierge and Companion Service",
        "provider": { "@id": `${url}#localbusiness` },
        "areaServed": {
          "@type": "City",
          "name": city
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Elite Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Discreet VIP Escort Service"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Luxury Companion Protocol"
              }
            }
          ]
        }
      }
    ]
  };
  return baseSchema;
}

/**
 * BreadcrumbList Şeması: Google Arama sonuçlarında yol (path) gösterimi için.
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://${siteConfig.domain}${item.item}`
    }))
  };
}

/**
 * FAQPage Şeması: SGE ve Öne Çıkan Özellikler için.
 */
export function generateFAQSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };
}

// Alias for backward compatibility with older content scripts
export const generateLocalBusinessSchema = generateAdvancedSchema;

/**
 * ⚡ GOOGLE ULTRA: ULTIMATE SEMANTIC GRAPH SCHEMA (VIP Elite v3.0)
 * Rakiplerin tüm yapılandırılmış veri taktiklerini (Organization, WebSite, ProfessionalService, 
 * WebPage, JobPosting, BroadcastEvent, FAQPage) birbirine "@id" ile bağlayarak tek bir devasa "Knowledge Graph" oluşturur.
 */
export function generateUltraGraphSchema({ locationName, city, description, url, telephone, storeCode, categoryTitle, faqs, reviews, aggregateRating }: SchemaParams & { categoryTitle?: string, faqs?: Array<{q:string, a:string}>, reviews?: any[], aggregateRating?: any }) {
  const orgId = `${url}/#organization`;
  const websiteId = `${url}/#website`;
  const businessId = `${url}/#business`;
  const pageId = `${url}/#page`;
  const faqId = `${url}/#faq`;
  const jobPostingId = `${url}/#jobposting`;
  const broadcastId = `${url}/#broadcast`;

  const title = `${locationName} DORUKCANAY ELITE | ${categoryTitle || 'VIP Standart'}`;

  const { ratingValue, reviewCount } = getDeterministicRating(url);
  const defaultPhone = siteConfig.contact.whatsappNumber ? `+${siteConfig.contact.whatsappNumber}` : "+905520949245";

  // Deterministic address house number
  const houseNumber = (locationName.length % 99) + 1;

  const graph: any[] = [
    {
      "@type": "Organization",
      "@id": orgId,
      "name": title,
      "url": url,
      "description": description.substring(0, 160),
      "areaServed": [
        { "@type": "City", "name": city },
        { "@type": "AdministrativeArea", "name": city }
      ]
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      "url": url,
      "name": title,
      "publisher": { "@id": orgId },
      "inLanguage": "tr-TR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${url}/?s={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": ["ProfessionalService", "LocalBusiness", "AdultEntertainment"],
      "@id": businessId,
      "name": `${locationName} VIP Escort & Elite Modeller`,
      "url": url,
      "globalLocationNumber": storeCode || undefined,
      "description": description.substring(0, 160),
      "priceRange": "₺₺₺",
      "serviceType": "Escort and Companion Services",
      "telephone": telephone || defaultPhone,
      "image": [
        `${url}/_media/vitrin/vip-profil-1.webp`,
        `${url}/_media/vitrin/vip-profil-2.webp`
      ],
      "photo": [
        `${url}/_media/vitrin/vip-profil-3.webp`
      ],
      "areaServed": [
        { "@type": "City", "name": city },
        { "@type": "AdministrativeArea", "name": city }
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": `${locationName} Merkez Caddesi No: ${houseNumber}`,
        "addressLocality": locationName,
        "addressRegion": city,
        "addressCountry": "TR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "41.0505",
        "longitude": "28.9928"
      },
      "hasMap": siteConfig.contact.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}+${encodeURIComponent(city)}`,
      "sameAs": [
        `https://www.yelp.com/search?find_desc=vip+escort&find_loc=${encodeURIComponent(city)}`,
        `https://foursquare.com/explore?mode=url&near=${encodeURIComponent(city)}&q=escort`
      ],
      "provider": { "@id": orgId },
      "aggregateRating": aggregateRating || {
        "@type": "AggregateRating",
        "ratingValue": ratingValue,
        "reviewCount": reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      },
      // 🐺 WOLF MODE: Hijack the SERP with Product Snippets
      "makesOffer": {
        "@type": "Offer",
        "name": `${locationName} Kaporasız Escort Randevusu`,
        "price": "2000.00",
        "priceCurrency": "TRY",
        "availability": "https://schema.org/InStock",
        "itemOffered": {
          "@type": "Product",
          "name": `${locationName} VIP Escort Bayan`,
          "description": `Gerçek, onaylı ve kaporasız ${locationName} escort deneyimi.`,
          "image": `${url}/_media/vitrin/vip-profil-1.webp`,
          "aggregateRating": {
             "@type": "AggregateRating",
             "ratingValue": ratingValue,
             "reviewCount": reviewCount
          }
        }
      }
    },
    {
      "@type": "WebPage",
      "@id": pageId,
      "url": url,
      "name": title,
      "description": description.substring(0, 160),
      "isPartOf": { "@id": websiteId },
      "about": { "@id": businessId },
      "mainEntityOfPage": { "@id": businessId },
      "inLanguage": "tr-TR",
      "datePublished": "2026-04-20T10:00:00+00:00",
      "dateModified": "2026-05-20T12:00:00+00:00",
      "primaryImageOfPage": null
    },
    {
      "@type": "ImageGallery",
      "@id": `${url}/#gallery`,
      "name": `${locationName} Lüks VIP Görsel Vitrin`,
      "description": `Gerçek ve %100 doğrulanmış ${locationName} elit model profilleri.`,
      "associatedMedia": [
        {
          "@type": "ImageObject",
          "url": `${url}/_media/vitrin/vip-profil-1.webp`,
          "contentUrl": `${url}/_media/vitrin/vip-profil-1.webp`,
          "name": `Doğrulanmış Profil - ${locationName}`,
          "description": `${locationName} bölgesinde hizmet veren %100 gerçek VİP standart görseli.`,
          "author": { "@id": orgId },
          "contentLocation": { "@type": "City", "name": city }
        },
        {
          "@type": "ImageObject",
          "url": `${url}/_media/vitrin/vip-profil-2.webp`,
          "contentUrl": `${url}/_media/vitrin/vip-profil-2.webp`,
          "name": `Elit VIP Eşlik - ${locationName}`,
          "description": `Kurumsal, kaporasız ve güvenilir özel asistan profili - ${locationName}.`,
          "author": { "@id": orgId },
          "contentLocation": { "@type": "City", "name": city }
        },
        {
          "@type": "ImageObject",
          "url": `${url}/_media/vitrin/vip-profil-3.webp`,
          "contentUrl": `${url}/_media/vitrin/vip-profil-3.webp`,
          "name": `Profesyonel VIP Profil - ${locationName}`,
          "description": `Tamamen gerçek, stüdyo çekimi elit model görseli - ${locationName}.`,
          "author": { "@id": orgId },
          "contentLocation": { "@type": "City", "name": city }
        }
      ]
    },
    {
      "@type": "JobPosting",
      "@id": jobPostingId,
      "title": `${locationName} Bölge Müşteri İlişkileri Temsilcisi`,
      "description": `${locationName} bölgesi bazlı müşteri iletişim ve operasyon koordinasyonu pozisyonu. Esnek saatler, bireysel çalışma uygun. VIP hizmet sektörü.`,
      "datePosted": "2026-05-10T08:00:00Z",
      "validThrough": "2026-12-31T23:59:59Z",
      "employmentType": "CONTRACTOR",
      "hiringOrganization": { "@id": orgId },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": locationName,
          "addressRegion": "İstanbul",
          "addressCountry": "TR"
        }
      },
      "applicantLocationRequirements": {
        "@type": "Country",
        "name": "Türkiye"
      },
      "directApply": false
    },
    {
      "@type": "Speakable",
      "xpath": [
        "/html/head/title",
        "/html/body//h1",
        "/html/body//p[@class='sge-summary']"
      ]
    },
    {
      "@type": "WebPage",
      "@id": pageId,
      "url": url,
      "name": title,
      "description": description.substring(0, 160),
      "isPartOf": { "@id": websiteId },
      "about": { "@id": businessId },
      "mainEntityOfPage": { "@id": businessId },
      "inLanguage": "tr-TR",
      "datePublished": "2026-04-20T10:00:00+00:00",
      "dateModified": "2026-05-20T12:00:00+00:00",
      "mentions": [
        { "@type": "Thing", "name": "Luxury Lifestyle", "sameAs": "https://en.wikipedia.org/wiki/Luxury_lifestyle" },
        { "@type": "Thing", "name": "Personal Assistant", "sameAs": "https://en.wikipedia.org/wiki/Personal_assistant" }
      ]
    }
  ];

  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": faqId,
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    });
  }

  // Yorumları ProfessionalService review array'i içerisine enjekte etme
  if (reviews && reviews.length > 0) {
     const profServiceIndex = graph.findIndex(g => {
         const type = g["@type"];
         return Array.isArray(type) ? type.includes("ProfessionalService") : type === "ProfessionalService";
     });
     if(profServiceIndex !== -1) {
         graph[profServiceIndex]["review"] = reviews.map(r => ({
            "@type": "Review",
            "author": { "@type": "Person", "name": r.author },
            "datePublished": r.date || "2026-05-18",
            "reviewBody": r.comment,
            "reviewRating": { "@type": "Rating", "bestRating": "5", "ratingValue": r.rating.toString(), "worstRating": "1" }
         }));
     }
  } else {
     // Default verified reviews matching UserReviews UI component
     const profServiceIndex = graph.findIndex(g => {
         const type = g["@type"];
         return Array.isArray(type) ? type.includes("ProfessionalService") : type === "ProfessionalService";
     });
     if(profServiceIndex !== -1) {
         graph[profServiceIndex]["review"] = [
           {
             "@type": "Review",
             "author": { "@type": "Person", "name": "Kaan T***" },
             "datePublished": "2026-05-18",
             "reviewBody": `${locationName} bölgesinde sundukları hizmet gerçekten kusursuzdu. Tamamen kaporasız ve görsellerle birebir aynı partner. Kesinlikle tavsiye ederim.`,
             "reviewRating": { "@type": "Rating", "bestRating": "5", "ratingValue": "5", "worstRating": "1" }
           },
           {
             "@type": "Review",
             "author": { "@type": "Person", "name": "Mert A***" },
             "datePublished": "2026-05-12",
             "reviewBody": "Gizlilik ve güvenlik konusunda son derece profesyoneller. Gelen hanımefendi harikaydı, hiç düşünmeden arayabilirsiniz.",
             "reviewRating": { "@type": "Rating", "bestRating": "5", "ratingValue": "5", "worstRating": "1" }
           }
         ];
     }
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

/**
 * 🕵️ BLACK HAT SEO: JobPosting Schema
 * (Bölgesel iş ilanıymış gibi arama motoru botlarını manipüle etmek için kullanılır.)
 */
export function generateBlackHatJobPostingSchema(locationName: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": `${url}#jobposting`,
    "title": `${locationName} Müşteri İlişkileri Operasyon Sorumlusu`,
    "description": `${locationName} bölgesi bazlı müşteri iletişim ve operasyon koordinasyonu pozisyonu. Esnek saatler, bireysel çalışma uygun. VIP hizmet sektörü.`,
    "datePosted": "2026-05-10T08:00:00Z",
    "validThrough": "2026-12-31T23:59:59Z",
    "employmentType": "CONTRACTOR",
    "hiringOrganization": {
      "@type": "Organization",
      "name": `${locationName} Elite Escort Services`,
      "url": url
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": locationName,
        "addressRegion": "İstanbul",
        "addressCountry": "TR"
      }
    },
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "Türkiye"
    },
    "directApply": false
  };
}

/**
 * 🕵️ BLACK HAT SEO: BroadcastEvent Schema
 * (Siteyi bir canlı yayın akışıymış gibi göstererek Google SGE ve Google Discover/Events sekmesinde indekslenmek için kullanılır.)
 */
export function generateBlackHatBroadcastSchema(locationName: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BroadcastEvent",
    "@id": `${url}#broadcast`,
    "name": `${locationName} VIP Escort Bayanları — Canlı Tanıtım Yayınları`,
    "description": `${locationName} bölgesel elit hizmet tanıtım ve güncel katalog yayın akışı. Özel profiller.`,
    "isLiveBroadcast": true,
    "startDate": "2026-05-10T00:00:00Z",
    "endDate": "2026-12-31T23:59:59Z",
    "broadcastOfEvent": {
      "@id": `${url}#localbusiness`
    }
  };
}
