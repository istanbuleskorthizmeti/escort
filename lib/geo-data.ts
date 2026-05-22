/**
 * 🗺️ DRKCNAY: TURKEY GEO COORDINATES (VIP Elite)
 * 81 il için yaklaşık koordinatlar.
 * Schema.org GeoCoordinates + areaServed için kullanılır.
 */

export interface GeoPoint {
  lat: number;
  lng: number;
}

export const CITY_COORDINATES: Record<string, GeoPoint> = {
  'istanbul': { lat: 41.0082, lng: 28.9784 },
  'besiktas': { lat: 41.0428, lng: 29.0076 },
  'kadikoy': { lat: 40.9902, lng: 29.0206 },
  'atasehir': { lat: 40.9845, lng: 29.1067 },
  'maltepe': { lat: 40.9258, lng: 29.1504 },
  'sefakoy': { lat: 40.9996379, lng: 28.7986522 },
  'esenyurt': { lat: 41.0282, lng: 28.6735 },
  'avcilar': { lat: 40.9782, lng: 28.7214 },
  'beylikduzu': { lat: 40.9827, lng: 28.6405 },
  'florya': { lat: 40.9632, lng: 28.7915 },
  'karakoy': { lat: 41.0229, lng: 28.9760 },
  'sariyer': { lat: 41.1683, lng: 29.0560 },
  'sisli': { lat: 41.0601, lng: 28.9877 },
  'mecidiyekoy': { lat: 41.0678, lng: 28.9950 },
  'okmeydani': { lat: 41.0617, lng: 28.9644 },
  'levent': { lat: 41.0827, lng: 29.0140 },
  'tarabya': { lat: 41.1444, lng: 29.0522 },
  'arnavutkoy': { lat: 41.1856, lng: 28.7397 },
  'bebek': { lat: 41.0772, lng: 29.0435 },
  'taksim': { lat: 41.0370, lng: 28.9850 },
  'bakirkoy': { lat: 40.9830, lng: 28.8722 },
  'silivri': { lat: 41.0743, lng: 28.2465 },
  'kumburgaz': { lat: 41.0257, lng: 28.4552 },
  'buyukcekmece': { lat: 41.0210, lng: 28.5947 },
  'bagcilar': { lat: 41.0393, lng: 28.8219 },
  'gunesli': { lat: 41.0423, lng: 28.7967 },
  'kucukcekmece': { lat: 41.0024, lng: 28.7804 },
  'bahcelievler': { lat: 41.0000, lng: 28.8603 },
  'esenler': { lat: 41.0444, lng: 28.8765 },
  'sultangazi': { lat: 41.1052, lng: 28.8990 },
  'gaziosmanpasa': { lat: 41.0667, lng: 28.9167 },
  'basaksehir': { lat: 41.0899, lng: 28.8033 },

  'ankara': { lat: 39.9334, lng: 32.8597 },
  'izmir': { lat: 38.4237, lng: 27.1428 },
  'bursa': { lat: 40.1885, lng: 29.0610 },
  'antalya': { lat: 36.8969, lng: 30.7133 },
  'adana': { lat: 37.0000, lng: 35.3213 },
  'konya': { lat: 37.8746, lng: 32.4932 },
  'gaziantep': { lat: 37.0662, lng: 37.3833 },
  'mersin': { lat: 36.8000, lng: 34.6333 },
  'kayseri': { lat: 38.7225, lng: 35.4875 },
  'eskisehir': { lat: 39.7767, lng: 30.5206 },
  'diyarbakir': { lat: 37.9144, lng: 40.2306 },
  'samsun': { lat: 41.2867, lng: 36.3300 },
  'denizli': { lat: 37.7765, lng: 29.0864 },
  'sanliurfa': { lat: 37.1591, lng: 38.7969 },
  'adapazari': { lat: 40.7731, lng: 30.3946 },
  'sakarya': { lat: 40.7731, lng: 30.3946 },
  'malatya': { lat: 38.3552, lng: 38.3095 },
  'kahramanmaras': { lat: 37.5858, lng: 36.9371 },
  'erzurum': { lat: 39.9239, lng: 41.2671 },
  'van': { lat: 38.4891, lng: 43.4089 },
  'batman': { lat: 37.8812, lng: 41.1351 },
  'elazig': { lat: 38.6810, lng: 39.2264 },
  'manisa': { lat: 38.6191, lng: 27.4289 },
  'tekirdag': { lat: 40.9781, lng: 27.5115 },
  'balikesir': { lat: 39.6484, lng: 27.8826 },
  'hatay': { lat: 36.4018, lng: 36.3498 },
  'trabzon': { lat: 41.0015, lng: 39.7178 },
  'kocaeli': { lat: 40.8533, lng: 29.8815 },
  'izmit': { lat: 40.7654, lng: 29.9408 },
  'aydin': { lat: 37.8444, lng: 27.8458 },
  'ordu': { lat: 40.9862, lng: 37.8797 },
  'rize': { lat: 41.0201, lng: 40.5234 },
  'giresun': { lat: 40.9128, lng: 38.3895 },
  'afyonkarahisar': { lat: 38.7507, lng: 30.5567 },
  'aksaray': { lat: 38.3687, lng: 34.0370 },
  'amasya': { lat: 40.6499, lng: 35.8353 },
  'artvin': { lat: 41.1828, lng: 41.8183 },
  'bartin': { lat: 41.6344, lng: 32.3375 },
  'batman2': { lat: 37.8812, lng: 41.1351 },
  'bayburt': { lat: 40.2552, lng: 40.2249 },
  'bilecik': { lat: 40.1506, lng: 29.9792 },
  'bingol': { lat: 38.8854, lng: 40.4983 },
  'bitlis': { lat: 38.3938, lng: 42.1232 },
  'bolu': { lat: 40.7359, lng: 31.6061 },
  'burdur': { lat: 37.7215, lng: 30.2900 },
  'canakkale': { lat: 40.1553, lng: 26.4142 },
  'cankiri': { lat: 40.6013, lng: 33.6134 },
  'corum': { lat: 40.5506, lng: 34.9556 },
  'duzce': { lat: 40.8438, lng: 31.1565 },
  'edirne': { lat: 41.6818, lng: 26.5623 },
  'gumushane': { lat: 40.4608, lng: 39.4812 },
  'hakkari': { lat: 37.5744, lng: 43.7408 },
  'igdir': { lat: 39.9167, lng: 44.0333 },
  'isparta': { lat: 37.7648, lng: 30.5566 },
  'karabuk': { lat: 41.2061, lng: 32.6204 },
  'karaman': { lat: 37.1759, lng: 33.2287 },
  'kars': { lat: 40.6013, lng: 43.0975 },
  'kastamonu': { lat: 41.3887, lng: 33.7827 },
  'kirikkale': { lat: 39.8468, lng: 33.5153 },
  'kirklareli': { lat: 41.7333, lng: 27.2167 },
  'kirsehir': { lat: 39.1425, lng: 34.1709 },
  'kilis': { lat: 36.7184, lng: 37.1212 },
  'kutahya': { lat: 39.4242, lng: 29.9833 },
  'mardin': { lat: 37.3212, lng: 40.7245 },
  'mugla': { lat: 37.2153, lng: 28.3636 },
  'mus': { lat: 38.7432, lng: 41.4934 },
  'nevsehir': { lat: 38.6939, lng: 34.6857 },
  'nigde': { lat: 37.9667, lng: 34.6833 },
  'osmaniye': { lat: 37.0742, lng: 36.2478 },
  'siirt': { lat: 37.9333, lng: 41.9500 },
  'sinop': { lat: 42.0231, lng: 35.1531 },
  'sirnak': { lat: 37.5185, lng: 42.4616 },
  'sivas': { lat: 39.7477, lng: 37.0179 },
  'tokat': { lat: 40.3167, lng: 36.5544 },
  'tunceli': { lat: 39.1079, lng: 39.5401 },
  'usak': { lat: 38.6823, lng: 29.4082 },
  'yalova': { lat: 40.6550, lng: 29.2731 },
  'yozgat': { lat: 39.8181, lng: 34.8147 },
  'zonguldak': { lat: 41.4564, lng: 31.7987 },
  'adiyaman': { lat: 37.7648, lng: 38.2786 },
  'agri': { lat: 39.7191, lng: 43.0503 },
  'ardahan': { lat: 41.1105, lng: 42.7022 },
};

/** 🏙️ NEIGHBORHOOD DISCOVERY POIs (Local Authority Nodes) */
export const LOCAL_LANDMARKS: Record<string, Array<{name: string, lat: number, lng: number}>> = {
  'sefakoy': [
    { name: "ArmoniPark OutLet Center", lat: 41.0001, lng: 28.7991 },
    { name: "Sefaköy Kültür Merkezi", lat: 40.9992, lng: 28.7971 },
    { name: "Kartaltepe Parkı", lat: 41.0011, lng: 28.7981 },
    { name: "Küçükçekmece Adliyesi", lat: 40.9981, lng: 28.7961 },
    { name: "Starcity Outlet", lat: 41.0051, lng: 28.8051 },
    { name: "Kuyumcukent", lat: 41.0081, lng: 28.8251 },
    { name: "Sefaköy Metrobüs Durağı", lat: 40.9961, lng: 28.7911 }
  ],
  'beylikduzu': [
    { name: "Perla Vista AVM", lat: 41.0085, lng: 28.6258 },
    { name: "Beylikdüzü Yaşam Vadisi", lat: 40.9955, lng: 28.6455 },
    { name: "Beykent Üniversitesi", lat: 41.0075, lng: 28.6235 }
  ],
  'esenyurt': [
    { name: "Akbatı AVM", lat: 41.0585, lng: 28.6825 },
    { name: "Esenyurt Meydan", lat: 41.0345, lng: 28.6815 },
    { name: "City Center AVM", lat: 41.0285, lng: 28.6735 }
  ]
};

export function getCityGeo(citySlug: string): GeoPoint {
  const normalized = citySlug.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ı/g, 'i')
    .replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ç/g, 'c');
  return CITY_COORDINATES[normalized] || { lat: 39.0, lng: 35.0 }; // TR merkezi fallback
}

/** Schema.org LocalBusiness için service area markup */
export function buildServiceAreaSchema(cityName: string, districtName?: string) {
  return {
    "@type": "Service",
    "serviceType": "Mobil Özel Hizmet",
    "areaServed": districtName
      ? [
        { "@type": "City", "name": cityName, "addressCountry": "TR" },
        { "@type": "AdministrativeArea", "name": districtName, "addressCountry": "TR" }
      ]
      : [{ "@type": "City", "name": cityName, "addressCountry": "TR" }],
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://istanbulescdrkcn.com",
      "availableLanguage": "Turkish"
    }
  };
}

/** 24/7 opening hours */
export const OPENING_HOURS_24_7 = [
  "Mo-Su 00:00-23:59"
];

export const OPENING_HOURS_SPEC = {
  "@type": "OpeningHoursSpecification",
  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  "opens": "00:00",
  "closes": "23:59"
};

/** 📍 VERIFIED GOOGLE BUSINESS PROFILES (NAP SIGNAL) */
const SEFAKOY_MAP = {
  streetAddress: "Kartaltepe, Süvari Cd. No:10",
  postalCode: "34295",
  addressLocality: "Küçükçekmece",
  addressRegion: "İstanbul",
  addressCountry: "TR",
  status: "Verified",
  lat: 40.9996379,
  lng: 28.7986522,
  iframeSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.365022408911!2d28.7986522!3d40.9996379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa3287014e54b%3A0xd9a1fa1065901c1!2sSefak%C3%B6y%20Escort!5e0!3m2!1sen!2str!4v1777261493559!5m2!1sen!2str",
  mapsUrl: "https://maps.app.goo.gl/Tt2JhQ3hvmWQtAVJ7"
};

export const GBP_LOCATIONS: Record<string, any> = {
  'sefakoy': {
    name: "Sefaköy Escort",
    storeCode: "00516711916953368610",
    streetAddress: "Kartaltepe, Süvari Cd. No:10",
    postalCode: "34295",
    addressLocality: "Sefaköy",
    addressRegion: "İstanbul",
    addressCountry: "TR",
    status: "Verified",
    lat: 40.9996379,
    lng: 28.7986522,
    iframeSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.365022408911!2d28.7986522!3d40.9996379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa3287014e54b%3A0xd9a1fa1065901c1!2sSefak%C3%B6y%20Escort!5e0!3m2!1sen!2str!4v1777261493559!5m2!1sen!2str",
    mapsUrl: "https://maps.app.goo.gl/Tt2JhQ3hvmWQtAVJ7"
  },
  'kucukcekmece': { name: "Küçükçekmece Escort", ...SEFAKOY_MAP },
  'avcilar': { name: "Avcılar Escort", ...SEFAKOY_MAP },
  'florya': { name: "Florya Escort", ...SEFAKOY_MAP },
  'bakirkoy': { name: "Bakırköy Escort", ...SEFAKOY_MAP },
  'bagcilar': {
    name: "Bağcılar Escort",
    streetAddress: "Yavuz Selim, 34203",
    postalCode: "34203",
    addressLocality: "Bağcılar",
    addressRegion: "İstanbul",
    addressCountry: "TR",
    status: "Verified",
    lat: 41.022224,
    lng: 28.8245218,
    iframeSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d752.5346449616482!2d28.82452176965388!3d41.02222401001265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa5487769deef%3A0x3137c60490d55d66!2zQmHEn2PEsWxhciBFc2NvcnQ!5e0!3m2!1str!2str!4v1778895660463!5m2!1str!2str",
    mapsUrl: "https://maps.app.goo.gl/MTACMhiPJ3khup2d9"
  },
  'basaksehir': { name: "Başakşehir Escort", ...SEFAKOY_MAP },
  'bahcelievler': { name: "Bahçelievler Escort", ...SEFAKOY_MAP },
  'halkali': { name: "Halkalı Escort", ...SEFAKOY_MAP },
  'sirinevler': { name: "Şirinevler Escort", ...SEFAKOY_MAP },
  'yenibosna': { name: "Yenibosna Escort", ...SEFAKOY_MAP },
  'beylikduzu': {
    name: "Beylikdüzü VIP Taşımacılık - Dorukcan Ay",
    storeCode: "17961878632650398254",
    streetAddress: "Beylikdüzü VIP Hizmet Alanı",
    postalCode: "34520",
    addressLocality: "Beylikdüzü",
    addressRegion: "İstanbul",
    addressCountry: "TR",
    status: "Processing",
    lat: 40.9827,
    lng: 28.6405
  },
  'esenyurt_safe': {
    name: "Dorukcan Ay - Elite VIP Asistanlık & Rehberlik",
    storeCode: "DRK-ESN-SAFE-01",
    streetAddress: "Mehmet Akif Ersoy, 1856 sk. No:15 Daire:4",
    postalCode: "34515",
    addressLocality: "Esenyurt",
    addressRegion: "İstanbul",
    addressCountry: "TR",
    status: "New",
    lat: 41.0165,
    lng: 28.6651
  },
  'gunesli': {
    name: "Güneşli Escort",
    streetAddress: "Güneşli, Fevzi Çakmak Cd No:6",
    postalCode: "34212",
    addressLocality: "Bağcılar",
    addressRegion: "İstanbul",
    addressCountry: "TR",
    status: "Processing",
    lat: 41.0371,
    lng: 28.8164
  }
};
