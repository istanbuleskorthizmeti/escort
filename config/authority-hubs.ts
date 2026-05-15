/**
 * 👑 DRKCNAY AUTHORITY HUBS (PARASITE SEO MATRIX)
 * High-DA satellite platforms that distribute authority to the money site.
 */

export const AUTHORITY_HUBS = [
  {
    name: 'Beylikdüzü VIP Escort (Google Sites)',
    url: 'https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa',
    keywords: ['beylikdüzü escort', 'beylikdüzü vip escort', 'beylikdüzü kaporasız']
  },
  {
    name: 'DRKCNAY Elite (GitHub Pages)',
    url: 'https://dorukcanay-elite.github.io',
    keywords: ['istanbul escort', 'vip escort', 'kaporasız escort']
  }
  // Kardocum yeni linklerin varsa buraya ekleyebilirsin, Sniper anında tarayıp basar.
];

export function getRandomAuthorityHub() {
  return AUTHORITY_HUBS[Math.floor(Math.random() * AUTHORITY_HUBS.length)];
}
