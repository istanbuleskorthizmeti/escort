import React from 'react';

interface JsonLdProps {
  type: 'Organization' | 'LocalBusiness' | 'BreadcrumbList' | 'FAQPage';
  data: Record<string, unknown>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ type, data }) => {
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

export const OrganizationSchema = () => (
  <JsonLd
    type="Organization"
    data={{
      name: 'istanbulescort.blog Elit Network',
      url: 'https://istanbulescort.blog',
      logo: 'https://istanbulescort.blog/og-premium.png',
      sameAs: [
        'https://twitter.com/istanbulescort.blog',
        'https://instagram.com/istanbulescort.blog',
        'https://t.me/istanbulescort.blog',
      ],
      description: 'Türkiye\'nin en seçkin 14 şehrinde sarsılmaz gizlilik, %100 doğrulanmış profiller ve Prestij standartlarında elit yaşam concierge deneyimi.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Turkish', 'English'],
      },
    }}
  />
);

export const BreadcrumbSchema = ({ items }: { items: { name: string; item: string }[] }) => (
  <JsonLd
    type="BreadcrumbList"
    data={{
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.item,
      })),
    }}
  />
);

export const FAQSchema = ({ faqs }: { faqs: { q: string; a: string }[] }) => (
  <JsonLd
    type="FAQPage"
    data={{
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    }}
  />
);

export const LocalBusinessSchema = ({ 
  name, 
  city, 
  district, 
  image, 
  description,
  ratingValue,
  reviewCount
}: { 
  name: string; 
  city: string; 
  district?: string; 
  image?: string; 
  description?: string;
  ratingValue?: number;
  reviewCount?: number;
}) => (
  <JsonLd
    type="LocalBusiness"
    data={{
      name: `${name} | ${district ? district : city} Escort & Eskort VIP`,
      image: image || 'https://istanbulescort.blog/og-image.png',
      description: description || `${city} bölgesinin en seçkin VIP escort, eskort ve lifestyle rehberi.`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: district || city,
        addressRegion: city,
        addressCountry: 'TR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '39.9334', // Default Turkey center
        longitude: '32.8597',
      },
      priceRange: '₺₺₺',
      telephone: '+90 501 635 50 53',
      ...(ratingValue && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: ratingValue,
          reviewCount: reviewCount || ((name.length * 7) % 30) + 15,
        }
      })
    }}
  />
);
