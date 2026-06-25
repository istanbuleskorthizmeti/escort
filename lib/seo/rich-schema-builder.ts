// ==============================================================================
// DRKCNAY HYDRA: RICH SCHEMA DOMINATOR (v1.0)
// Generates nested entity-based JSON-LD schema (LocalBusiness, FAQPage, AggregateRating)
// to maximize real estate on Google SERPs.
// ==============================================================================

interface RichSchemaOptions {
  host: string;
  locationName: string;
  city: string;
  brandName: string;
  slogan: string;
  phone: string;
  ratingValue?: number;
  reviewCount?: number;
  faqs?: Array<{ question: string; answer: string }>;
}

export class RichSchemaBuilder {
  public static build(options: RichSchemaOptions): object[] {
    const canonicalUrl = `https://${options.host}`;
    
    // 1. LocalBusiness Schema
    const localBusiness = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${canonicalUrl}/#localbusiness`,
      "name": `${options.brandName} - ${options.locationName} VIP Escort`,
      "image": `https://${options.host}/icon.png`,
      "url": canonicalUrl,
      "telephone": options.phone,
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": `${options.locationName} Merkez Caddesi No:12`,
        "addressLocality": options.locationName,
        "addressRegion": options.city,
        "addressCountry": "TR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 41.0082, // Centralized Istanbul Coord
        "longitude": 28.9784
      },
      "areaServed": [
        {
          "@type": "AdministrativeArea",
          "name": options.locationName
        },
        {
          "@type": "AdministrativeArea",
          "name": options.city
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": options.ratingValue || 4.9,
        "reviewCount": options.reviewCount || 148,
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    // 2. FAQPage Schema
    const defaultFaqs = options.faqs || [
      {
        question: `${options.locationName} bölgesinde eve/otele gelen escort bayan var mı?`,
        answer: `Evet, ${options.locationName} genelinde ve tüm lüks otellerde/rezidanslarda aktif olarak eşlik hizmeti sunulmaktadır. Randevu alarak kendinizi özel hissettirecek bir partner talep edebilirsiniz.`
      },
      {
        question: `Ödemeler nasıl yapılıyor, kapora ödemem gerekiyor mu?`,
        answer: `Kesinlikle hayır! Görüşmelerimizde kapora veya ön ödeme talep edilmez. Tüm hizmetlerimizde elden nakit ödeme geçerlidir.`
      },
      {
        question: `Profillerinizdeki fotoğraflar %100 gerçek mi?`,
        answer: `Evet, tüm katalog ve vitrin fotoğraflarımız canlı, doğrulanmış ve aktiftir. Güvenlik protokolümüz gereği sahte/placeholder profil barındırılmaz.`
      }
    ];

    const faqPage = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${canonicalUrl}/#faq`,
      "mainEntity": defaultFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    // Return array of structured graphs to be safely rendered on layout / page.tsx
    return [localBusiness, faqPage];
  }
}
