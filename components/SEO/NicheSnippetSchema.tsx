import React from 'react';

interface NicheSnippetSchemaProps {
  locationName: string;
}

export function NicheSnippetSchema({ locationName }: NicheSnippetSchemaProps) {
  let hash = 0;
  for (let i = 0; i < locationName.length; i++) {
    hash = locationName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);
  const ratingValue = (4.8 + (absHash % 3) / 10).toFixed(1);
  const reviewCount = 350 + (absHash % 150);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${locationName} VIP Escort ve Elit Partner Hizmetleri`,
    "description": `${locationName} bölgesindeki en seçkin ve lüks escort hizmet ağı. %100 onaylı kaporasız randevu.`,
    "image": "https://istanbulescort.blog/dorukcanay-favicon.png",
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
