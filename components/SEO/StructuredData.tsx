
import React from 'react';

type SchemaType = 'LocalBusiness' | 'FAQPage' | 'BreadcrumbList' | 'Product' | 'Organization';

interface StructuredDataProps {
  type: SchemaType;
  data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * DRKCNAY SEO UTILITIES
 */

export const generateLocalBusinessSchema = (locationName: string, description: string, url: string) => ({
  name: `ESCORTVIP ${locationName} | Resmi VIP Rehberi`,
  description: description,
  url: url,
  image: "https://istanbulescort.blog/og-premium.png",
  address: {
    "@type": "PostalAddress",
    "addressLocality": locationName,
    "addressCountry": "TR"
  },
  priceRange: "$$$",
  telephone: "+90"
});

export const generateProductSchema = (name: string, description: string, rating: number, reviewCount: number) => ({
  name: name,
  description: description,
  image: "https://istanbulescort.blog/og-premium.png",
  aggregateRating: {
    "@type": "AggregateRating",
    "ratingValue": rating,
    "reviewCount": reviewCount,
    "bestRating": "5",
    "worstRating": "1"
  },
  offers: {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "TRY",
    "price": "1000"
  }
});
