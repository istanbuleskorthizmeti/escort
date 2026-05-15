import Link from 'next/link';
import { DOMAIN_MATRIX, DomainConfig } from '@/config/domains';

interface LinkWheelProps {
  currentHost: string;
}

// Simple hash function for stable but randomized link distribution
// Simple hash function for stable but randomized link distribution
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; 
  }
  return Math.abs(hash);
}

export function LinkWheel({ currentHost }: LinkWheelProps) {
  // 🕸️ TIERED PBN MESH (God Mode Asymmetric Graph)
  const currentDomainInfo = DOMAIN_MATRIX.find(d => currentHost.includes(d.host));
  
  // TIER 1 (Money Sites) MUST NOT LEAK LINK JUICE!
  // If we are on a MONEY_SITE, we do not render outbound footer links to satellites.
  // We only hoard the authority.
  if (currentDomainInfo?.role === 'MONEY_SITE') {
    return null; 
  }

  const targetCity = currentDomainInfo?.targetCity || 'istanbul';
  const seed = hashString(currentHost);

  // Determine available target domains based on Tier strategy
  let availableTargets: DomainConfig[] = [];

  if (currentDomainInfo?.targetDistrict) {
    // TIER 3 (District Satellites like besiktasescort.blog)
    // Rule: Link to Tier 2 (City Level) OR Tier 1 (Money Sites)
    availableTargets = DOMAIN_MATRIX.filter(d => 
      d.host !== currentHost && 
      d.role !== 'CLOAKER' &&
      ((d.role === 'SATELLITE' && !d.targetDistrict && d.targetCity === targetCity) || // Link to City Level
       d.role === 'MONEY_SITE') // Or link to Money Site
    );
  } else if (currentDomainInfo?.targetCity) {
    // TIER 2 (City Satellites like istanbulescort.blog)
    // Rule: Link ONLY to Tier 1 (Money Sites)
    availableTargets = DOMAIN_MATRIX.filter(d => 
      d.role === 'MONEY_SITE' && d.host !== currentHost
    );
  } else {
    // Fallback
    availableTargets = DOMAIN_MATRIX.filter(d => d.role === 'MONEY_SITE' && d.host !== currentHost);
  }

  // Filter out the current host just in case
  availableTargets = availableTargets.filter(d => !currentHost.includes(d.host));

  if (availableTargets.length === 0) return null;

  // Pick 2 to 4 domains using the stable hash seed
  const numLinks = (seed % 3) + 2; // Returns 2, 3, or 4
  const pickedDomains: DomainConfig[] = [];
  
  for(let i = 0; i < numLinks; i++) {
    const idx = (seed + (i * 13)) % availableTargets.length;
    if (!pickedDomains.includes(availableTargets[idx])) {
        pickedDomains.push(availableTargets[idx]);
    } else {
        const next = availableTargets.find(d => !pickedDomains.includes(d));
        if (next) pickedDomains.push(next);
    }
  }

  // 🎭 FOOTPRINT OBFUSCATION: Randomized Headers
  const headers = [
    "Bölgesel Lüks Partner Ajansları",
    "Yakın Çevredeki VIP Ajanslar",
    "Önerilen Seçkin Servisler",
    "Elit Yaşam Rehberi",
    "VIP Escort Ağı",
    "Bölgenin En İyi Escort Platformları"
  ];
  const dynamicHeader = headers[seed % headers.length];

  // 🎭 FOOTPRINT OBFUSCATION: Randomized CSS Layouts
  const layoutStyle = seed % 2 === 0 ? "flex flex-wrap gap-4 justify-center" : "grid grid-cols-2 md:grid-cols-4 gap-3";

  return (
    <section className="mt-16 pt-8 border-t border-zinc-900/50 bg-gradient-to-t from-black to-transparent">
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 opacity-70">
        {dynamicHeader}
      </h3>
      <div className={layoutStyle} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        {pickedDomains.map((domain, index) => {
          const location = domain.targetDistrict 
            ? `${domain.targetDistrict.charAt(0).toUpperCase() + domain.targetDistrict.slice(1)}` 
            : domain.targetCity 
              ? `${domain.targetCity.charAt(0).toUpperCase() + domain.targetCity.slice(1)}` 
              : 'Elite';
              
          // Aggressive & Exact Match Anchor Texts (SEO Ranking Dominance)
          const anchorPrefixes = [
            "VIP Escort", 
            "Eskort Bayan", 
            "Kaporasız Escort", 
            "Eve Gelen Escort", 
            "Otele Gelen Escort", 
            "Rus Eskort", 
            "Gerçek Escort İlanları",
            "Üniversiteli Escort"
          ];
          const prefix = anchorPrefixes[(seed + index) % anchorPrefixes.length];
          const anchorText = `${location} ${prefix}`.trim();
          
          return (
            <Link 
              key={domain.host} 
              href={`https://${domain.host}`}
              className="text-[11px] text-zinc-400 hover:text-white transition-all duration-300 border border-zinc-800 hover:border-rose-800 px-4 py-2 rounded bg-zinc-950/30 hover:bg-rose-950/20 text-center shadow-sm"
              title={anchorText}
              style={{ textDecoration: 'none', color: '#a1a1aa', display: 'inline-block' }}
            >
              {anchorText}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
