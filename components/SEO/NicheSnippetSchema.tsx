import React from 'react';

interface NicheSnippetSchemaProps {
  locationName: string;
}

export function NicheSnippetSchema({ locationName }: NicheSnippetSchemaProps) {
  // Generate a realistic but extremely high rating between 4.8 and 5.0
  const ratingValue = (Number(Math.random() * (5.0 - 4.8) + 4.8) || 4.9).toFixed(1);
  // Generate a random high number of reviews to establish authority
  const reviewCount = Math.floor(Math.random() * (1250 - 350 + 1)) + 350;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${locationName} VIP Escort ve Elit Partner Hizmetleri`,
    "description": `${locationName} bölgesindeki en seçkin ve lüks escort hizmet ağı. %100 onaylı kaporasız randevu.`,
    "image": "https://vipescorthizmeti.com/dorukcanay-favicon.png",
    "brand": {
      "@type": "Brand",
      "name": "DRKCNAY Elite"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "AggregateOffer",
      "offerCount": "12",
      "lowPrice": "4000.00",
      "highPrice": "15000.00",
      "priceCurrency": "TRY"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
