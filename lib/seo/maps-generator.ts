
/**
 * 🗺️ DRKCNAY MAPS & GHOST ADDRESS GENERATOR (Black Hat v3.0)
 * Objective: Create fake but realistic local presence signals for Googlebot.
 */

export const ISTANBUL_DISTRICTS_DATA: Record<string, { lat: number, lng: number, postal: string }> = {
  "Besiktas": { lat: 41.0422, lng: 29.0074, postal: "34330" },
  "Sisli": { lat: 41.0600, lng: 28.9870, postal: "34360" },
  "Atasehir": { lat: 40.9928, lng: 29.1244, postal: "34750" },
  "Bakirkoy": { lat: 40.9781, lng: 28.8744, postal: "34140" },
  "Beylikduzu": { lat: 41.0011, lng: 28.6419, postal: "34520" },
  "Esenyurt": { lat: 41.0343, lng: 28.6801, postal: "34510" },
  "Kadikoy": { lat: 40.9901, lng: 29.0289, postal: "34710" },
  "Beyoglu": { lat: 41.0370, lng: 28.9747, postal: "34433" },
  "Karakoy": { lat: 41.0229, lng: 28.9754, postal: "34421" },
  "Atakoy": { lat: 40.9796, lng: 28.8516, postal: "34158" },
  "Etiler": { lat: 41.0831, lng: 29.0342, postal: "34337" },
  "Bebek": { lat: 41.0767, lng: 29.0435, postal: "34342" },
  "Bagcilar": { lat: 41.0343, lng: 28.8329, postal: "34200" },
  "Bahcelievler": { lat: 40.9923, lng: 28.8617, postal: "34180" },
  "Basaksehir": { lat: 41.0805, lng: 28.8020, postal: "34480" },
  "Bayrampasa": { lat: 41.0343, lng: 28.9130, postal: "34030" },
  "Beykoz": { lat: 41.1322, lng: 29.1023, postal: "34820" },
  "Cekmekoy": { lat: 41.0343, lng: 29.3000, postal: "34782" },
  "Eyupsultan": { lat: 41.0422, lng: 28.9300, postal: "34050" },
  "Fatih": { lat: 41.0082, lng: 28.9339, postal: "34080" },
  "Gaziosmanpasa": { lat: 41.0600, lng: 28.9000, postal: "34245" },
  "Gungoren": { lat: 41.0232, lng: 28.8712, postal: "34160" },
  "Kagithane": { lat: 41.0811, lng: 28.9734, postal: "34400" },
  "Kartal": { lat: 40.8887, lng: 29.1852, postal: "34860" },
  "Maltepe": { lat: 40.9238, lng: 29.1311, postal: "34840" },
  "Pendik": { lat: 40.8765, lng: 29.2342, postal: "34890" },
  "Sancaktepe": { lat: 41.0050, lng: 29.2400, postal: "34885" },
  "Sariyer": { lat: 41.1667, lng: 29.0500, postal: "34450" },
  "Sultanbeyli": { lat: 40.9650, lng: 29.2700, postal: "34920" },
  "Sultangazi": { lat: 41.1000, lng: 28.8800, postal: "34260" },
  "Tuzla": { lat: 40.8167, lng: 29.3000, postal: "34940" },
  "Umraniye": { lat: 41.0322, lng: 29.1000, postal: "34760" },
  "Uskudar": { lat: 41.0300, lng: 29.0200, postal: "34660" },
  "Zeytinburnu": { lat: 40.9900, lng: 28.9000, postal: "34020" }
};

export function generateGhostSchema(city: string, district: string) {
  const data = ISTANBUL_DISTRICTS_DATA[district] || ISTANBUL_DISTRICTS_DATA["Besiktas"];
  
  // 🛡️ [BLACK-HAT] Generate realistic looking fake address
  const streets = ["Cumhuriyet Caddesi", "Atatürk Bulvarı", "İstiklal Sokak", "Gül Sokak", "Barbaros Bulvarı", "Bağdat Caddesi"];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const buildingNo = Math.floor(Math.random() * 150) + 1;
  
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `DRKCNAY ELITE VIP - ${district}`,
    "image": "https://dorukcanay.digital/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": `${street} No:${buildingNo}`,
      "addressLocality": district,
      "addressRegion": city,
      "postalCode": data.postal,
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": data.lat,
      "longitude": data.lng
    },
    "url": `https://dorukcanay.digital/${district.toLowerCase()}`,
    "telephone": "+905520949245",
    "priceRange": "$$$",
    "openingHours": "Mo,Tu,We,Th,Fr,Sa,Su 24h"
  };
}

export function getDistrictMapEmbedUrl(district: string): string {
  const data = ISTANBUL_DISTRICTS_DATA[district] || ISTANBUL_DISTRICTS_DATA["Besiktas"];
  // Use a slightly randomized lat/lng to avoid footprint detection
  const jitterLat = data.lat + (Math.random() - 0.5) * 0.002;
  const jitterLng = data.lng + (Math.random() - 0.5) * 0.002;
  
  return `https://www.google.com/maps/embed/v1/place?q=${jitterLat},${jitterLng}&zoom=14&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`;
}
