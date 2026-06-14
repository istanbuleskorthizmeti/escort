import React from 'react';
import { getDomainConfig } from '@/config/domains';

interface VirtualEntitySchemaProps {
  currentHost: string;
}

// 🗺️ VIRTUAL ENTITY GENERATOR: 
// Creates fake but mathematically valid GPS coordinates for target districts to trick Google Maps/LocalBusiness.
function getVirtualCoordinates(district: string) {
  const baseCoords: Record<string, { lat: number, lng: number }> = {
    'besiktas': { lat: 41.0422, lng: 29.0083 },
    'sisli': { lat: 41.0610, lng: 28.9878 },
    'kadikoy': { lat: 40.9819, lng: 29.0277 },
    'beylikduzu': { lat: 41.0028, lng: 28.6416 },
    'esenyurt': { lat: 41.0343, lng: 28.6801 },
    'buca': { lat: 38.3845, lng: 27.1729 },
    'istanbul': { lat: 41.0082, lng: 28.9784 }
  };

  const base = baseCoords[district.toLowerCase()] || baseCoords['istanbul'];
  
  // Add a slight random offset (approx 10-100 meters) so each satellite looks like a different physical branch
  const offsetLat = (Math.random() - 0.5) * 0.005;
  const offsetLng = (Math.random() - 0.5) * 0.005;

  return {
    latitude: (Number(base?.lat || 41.0082) + offsetLat).toFixed(6),
    longitude: (Number(base?.lng || 28.9784) + offsetLng).toFixed(6)
  };
}

export function VirtualEntitySchema({ currentHost }: VirtualEntitySchemaProps) {
  const config = getDomainConfig(currentHost);
  const targetCity = config?.targetCity || 'istanbul';
  const targetDistrict = config?.targetDistrict || targetCity;
  
  const coords = getVirtualCoordinates(targetDistrict);
  
  // Seeded fake phone number generation to stay consistent per domain
  const seed = currentHost.length + targetDistrict.length;
  const fakePhone = `+90 53${seed % 10} ${Math.floor(100 + (seed * 13) % 900)} ${Math.floor(10 + (seed * 7) % 90)} ${Math.floor(10 + (seed * 3) % 90)}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${targetDistrict.charAt(0).toUpperCase() + targetDistrict.slice(1)} VIP Escort Agency`,
    "image": `https://${currentHost}/dorukcanay-favicon.png`,
    "@id": `https://${currentHost}`,
    "url": `https://${currentHost}`,
    "telephone": fakePhone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "VIP Cad. No:1",
      "addressLocality": targetDistrict,
      "addressRegion": targetCity,
      "postalCode": "34000",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": coords.latitude,
      "longitude": coords.longitude
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "$$$",
    "sameAs": [
      "https://www.pinterest.com/istanbulescorthizmeti",
      "https://t.me/istanbulescorthizmeti",
      "https://wa.me/12495448982"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
