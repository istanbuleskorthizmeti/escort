import React from 'react';

interface CatalogSchemaProps {
  locationName: string;
  nicheVariations?: string[];
}

export function CatalogSchema({ locationName, nicheVariations = ["VIP", "Sarışın", "Rus", "Kaporasız", "Üniversiteli"] }: CatalogSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${locationName} Escort ve Partner Kataloğu`,
    "description": `${locationName} bölgesindeki %100 onaylı, kaporasız ve seçkin partnerlerin tam listesi.`,
    "itemListElement": nicheVariations.map((niche, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": `${locationName} ${niche} Escort`,
        "description": `${locationName} merkezinde özel ve gizli ${niche.toLowerCase()} elit partner hizmeti.`,
        "provider": {
          "@type": "Organization",
          "name": "DRKCNAY Elite"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "TRY",
          "price": "5000.00",
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
