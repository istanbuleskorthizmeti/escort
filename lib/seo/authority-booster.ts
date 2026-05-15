/**
 * 🚀 DRKCNAY AUTHORITY BOOSTER
 * Maximizes DA/PA by establishing high-authority entity signals and tiered linking.
 */

import { DOMAIN_MATRIX } from '@/config/domains';

/**
 * 🏛️ SCHEMA.ORG ENTITY GENERATOR
 * Tells Google we are a "Real Brand" to boost Domain Authority.
 */
export function generateDrkcnaySchema(domain: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Drkcnay Elite Network",
    "url": `https://${domain}`,
    "logo": `https://${domain}/logo.webp`,
    "description": "Türkiye'nin en seçkin VIP protokolü ve elit rehberi.",
    "sameAs": [
      "https://twitter.com/drkcnay_elite",
      "https://drkcnay-elite.tumblr.com"
    ],
    "brand": {
      "@type": "Brand",
      "name": "Drkcnay Elite"
    }
  };
}

/**
 * 🕸️ LINK JUICE ROTATOR
 * Generates a "Tiered" link matrix across the 24 domains.
 * Each domain links to its "Neighbors" to distribute PA (Page Authority).
 */
export function getInternalMatrixLinks(currentDomain: string) {
  const allDomains = DOMAIN_MATRIX.map(d => d.host);
  const currentIndex = allDomains.indexOf(currentDomain);
  
  if (currentIndex === -1) return [];

  // Get 3 random neighbors to pass link juice without creating a "Loop" footprint
  const neighbors = [
    allDomains[(currentIndex + 1) % allDomains.length],
    allDomains[(currentIndex + 3) % allDomains.length],
    allDomains[(currentIndex + 5) % allDomains.length]
  ];

  return neighbors;
}
