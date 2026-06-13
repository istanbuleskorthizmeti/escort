import fs from 'fs';
import path from 'path';

export interface AuthorityHub {
  name: string;
  url: string;
  keywords: string[];
}

const baseHubs: AuthorityHub[] = [
  {
    name: 'Beylikdüzü VIP Escort (Google Sites)',
    url: 'https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa',
    keywords: ['beylikdüzü escort', 'beylikdüzü vip escort', 'beylikdüzü kaporasız']
  },
  {
    name: 'Sefaköy VIP Escort (Google Sites)',
    url: 'https://sites.google.com/dorukcanay.digital/sefakoy-vip-escort/ana-sayfa',
    keywords: ['sefaköy escort', 'sefaköy vip escort', 'sefaköy kaporasız']
  },
  {
    name: 'Beşyol VIP Escort (Google Sites)',
    url: 'https://sites.google.com/dorukcanay.digital/besyol-vip-escort/ana-sayfa',
    keywords: ['beşyol escort', 'beşyol vip escort', 'beşyol kaporasız']
  },
  {
    name: 'DRKCNAY Elite (GitHub Pages)',
    url: 'https://dorukcanay-elite.github.io',
    keywords: ['istanbul escort', 'vip escort', 'kaporasız escort']
  },
  {
    name: 'İstanbul Escort Hizmetleri 2026 - DRKCNAY (Google Doc)',
    url: 'https://docs.google.com/document/d/1OdCxOIOs6v8Rvya2y-g6nT2epsIw688ZAbw9EZm-ka4/edit',
    keywords: ['istanbul escort', 'vip escort', 'kaporasız escort']
  }
];

// Dynamically load additional Google Sites from live_google_sites.json
function loadDynamicHubs(): AuthorityHub[] {
  const hubs = [...baseHubs];
  try {
    const filePath = path.join(process.cwd(), 'data', 'live_google_sites.json');
    if (fs.existsSync(filePath)) {
      const sites: string[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      sites.forEach(url => {
        // Avoid duplicate entries
        if (!hubs.some(h => h.url === url)) {
          // Extract name from URL slug
          const match = url.match(/sites\.google\.com\/[^\/]+\/([^\/]+)/i);
          const slug = match ? match[1] : 'Google Sites';
          const name = slug
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase()) + ' (Google Sites)';
            
          hubs.push({
            name,
            url,
            keywords: ['istanbul escort', 'vip escort', 'kaporasız escort']
          });
        }
      });
    }
  } catch (err) {
    console.warn('⚠️ [AUTHORITY-HUBS] Failed to load dynamic hubs:', err);
  }

  // Dynamically append Google AMP Cache URLs for all districts
  const districts = [
    "karakoy", "sisli", "besiktas", "kadikoy", "esenyurt", "beylikduzu", 
    "bakirkoy", "atasehir", "umraniye", "maltepe", "sariyer"
  ];
  
  districts.forEach(dist => {
    const url = `https://istanbulescort.blog/istanbul/${dist}`;
    hubs.push({
      name: `${dist.charAt(0).toUpperCase() + dist.slice(1)} Hub Target`,
      url,
      keywords: [`${dist} escort`, `${dist} vip escort`, `${dist} kaporasız`]
    });
  });

  return hubs;
}

export const AUTHORITY_HUBS = loadDynamicHubs();

export function getRandomAuthorityHub(): AuthorityHub {
  return AUTHORITY_HUBS[Math.floor(Math.random() * AUTHORITY_HUBS.length)];
}
