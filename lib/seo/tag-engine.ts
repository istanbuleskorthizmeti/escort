import { getDeterministicNicheCombo } from '../niche-matrix';

/**
 * 💣 NUCLEAR TAG ENGINE
 * Her domain için saniyeler içinde binlerce semantik etiket üretir.
 */
export function generateNuclearTags(host: string, city: string = "İstanbul") {
  const { race, category, niche } = getDeterministicNicheCombo(host);
  
  const baseTags = [
    `${city} escort`, `${city} eskort`, `${city} esrot`,
    `vip ${city} partner`, `elit ${city} escort`,
    `kaporasız ${city} escort`, `güvenilir ${city} ajans`,
    `${race} escort ${city}`, `${category} ${city}`, `${niche} ${city}`
  ];

  const longTailSuffixes = [
    "fiyatları", "yorumları", "numaraları", "ilanları", "resimleri",
    "otel servisi", "eve servis", "gecelik", "saatlik", "vip katalog",
    "gerçek fotoğraflı", "video teyitli", "kaporasız", "en iyisi"
  ];

  const nuclearTags: string[] = [...baseTags];

  // Kombinasyon Bombardımanı
  baseTags.forEach(base => {
    longTailSuffixes.forEach(suffix => {
      nuclearTags.push(`${base} ${suffix}`);
    });
  });

  // Karıştır ve döndür (Deterministik Shuffle)
  return nuclearTags.sort(() => host.length % 2 === 0 ? 1 : -1).slice(0, 150);
}

/**
 * 📂 VIRTUAL DIRECTORY LINKS
 * Google'a "Rehber Sitesi" imajı vermek için sanal URL'ler üretir.
 */
export function getVirtualHubs(city: string = "İstanbul") {
  return [
    { title: `En İyi ${city} Escort Ajansları`, slug: 'en-iyi-ajanslar' },
    { title: `Güvenilir ${city} Partner Rehberi`, slug: 'guvenilir-rehber' },
    { title: `Kaporasız ${city} Escort Listesi`, slug: 'kaporasiz-liste' },
    { title: `VIP ${city} Konaklama ve Refakat`, slug: 'vip-konaklama' }
  ];
}
