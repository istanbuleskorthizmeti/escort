import { cities } from './locations';

/**
 * SMART CONTENT FALLBACK ENGINE
 * Generates reliable, context-aware strings for any location, ensuring zero 5xx or missing content.
 */

export function generateFallbackLandmarks(city: string, district?: string): string[] {
  const cityObj = cities[city];
  const cityName = cityObj?.name || city;
  const dName = district || '';

  // Base fallback set
  const generic = [
    `${cityName} Merkez Rezidansları`,
    "VIP Protokol Noktaları",
    "Lüks Konaklama Alanları",
    "Özel Transfer Güzergahları"
  ];

  if (dName) {
    return [
      `${dName} Modern Yaşam Alanları`,
      `${cityName} Elite Sınır Hattı`,
      ...generic.slice(0, 2)
    ];
  }

  return generic;
}

export function generateFallbackTransport(city: string, district?: string): string {
  const cityObj = cities[city];
  const cityName = cityObj?.name || city;
  const dName = district || '';

  if (dName) {
    return `${dName} lokasyonu, ${cityName} genelindeki tüm VIP transfer ağlarına ve ana ulaşım arterlerine tam entegre bir mobilite sunmaktadır.`;
  }

  return `${cityName} şehri, uluslararası standartlarda lüks ulaşım ve gizli transfer protokolleri için gelişmiş bir altyapıya sahiptir.`;
}

export function generateFallbackVibe(city: string): string[] {
  return [
    "Sessiz ve sarsılmaz bir gizlilik",
    "Elite standartlarda lüks yaşam",
    "Kesintisiz profesyonel concierge desteği",
    "Yüksek güvenlikli VIP sığınak atmosferi"
  ];
}
