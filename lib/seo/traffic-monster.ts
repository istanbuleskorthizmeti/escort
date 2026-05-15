/**
 * 🧛‍♂️ DRKCNAY TRAFFIC MONSTER (GOD MODE)
 * Handles DOM Randomization, Image SEO, and Anti-Spam Logic.
 */

export const TRAFFIC_CONFIG = {
  districts: ["Beşiktaş", "Şişli", "Ataşehir", "Bakırköy", "Beylikdüzü", "Esenyurt", "Çerkezköy"],
  actions: ["Görüşme", "Randevu", "Tanışma", "VIP Hizmet"],
};

/**
 * 📸 GOLDEN ALT TAG GENERATOR
 * Generates SEO-rich, randomized ALT tags for images to dominate Image Search.
 */
export function generateGoldenAlt(location: string): string {
  const years = ["2025", "2026"];
  const prefixes = ["Gerçek", "VIP", "Elit", "Yeni", "Doğrulanmış", "Premium", "Özel", "Seçkin", "Lüks", "Kaporasız", "Garantili", "Şahane"];
  const suffixes = ["Resimleri", "Kataloğu", "Profilleri", "Numaraları", "İlanları", "Seçenekleri", "Görselleri", "Deneyimi", "Partnerleri"];
  const niches = ["Rus", "Sarışın", "Üniversiteli", "Olgun", "Model", "Manken", "Genç", "Ateşli"];
  
  const year = years[Math.floor(Math.random() * years.length)];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const niche = niches[Math.floor(Math.random() * niches.length)];
  
  return `${year} ${location} ${prefix} ${niche} Escort Bayan ${suffix} - DRKCNAY ELITE %100 GERÇEK`;
}

/**
 * 🎲 DOM SHUFFLE
 * Randomly shuffles an array to prevent "HTML Fingerprinting".
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 📝 CONTEXTUAL PADDING
 * Wraps aggressive keywords in "Safe" content to fool quality filters.
 */
export function wrapInSafety(keyword: string, location: string): string {
  const whiteText = [
    `${location} bölgesindeki konaklamanız sırasında`,
    `Şehrin en popüler noktalarına yakın konumda`,
    `Kalite ve güven arayanların ilk tercihi olarak`,
    `Günün stresini atmak ve keyifli vakit geçirmek için`
  ];
  const randomText = whiteText[Math.floor(Math.random() * whiteText.length)];
  return `${randomText} <strong>${keyword}</strong> arayışınıza en elit çözümü sunuyoruz.`;
}

/**
 * 🕸️ CONTEXTUAL IN-CONTENT SILO (Spider Web Generator)
 * Scans article content and injects internal links (Contextual Silo) with randomized probability.
 * This simulates organic backlinking behavior and heavily confuses SpamBrain.
 */
export function injectContextualLinks(content: string, currentHost: string): string {
  let modifiedContent = content;
  
  // Keyword mapping to our Satellite Network (Domain Matrix Subset)
  const linkTargets = [
    { keywords: ['beşiktaş escort', 'beşiktaş vip escort', 'beşiktaş elit partner'], url: 'https://besiktasescorthizmeti.shop' },
    { keywords: ['şişli escort', 'şişli kaporasız escort', 'şişli vip escort'], url: 'https://sisliescort.shop' },
    { keywords: ['kadıköy escort', 'kadıköy vip escort', 'kadıköy partner'], url: 'https://kadikoyescort.shop' },
    { keywords: ['beylikdüzü escort', 'beylikdüzü vip escort', 'beylikdüzü elit', 'beylikdüzü eskort'], url: 'https://beylikduzuescortlistesi.shop' },
    { keywords: ['avcılar escort', 'avcılar vip escort', 'avcılar partner'], url: 'https://avrupayakasiescort.shop' },
    { keywords: ['bağcılar escort', 'bağcılar vip escort', 'bağcılar partner'], url: 'https://bagcilarescort.shop' },
    { keywords: ['esenyurt escort', 'esenyurt vip escort', 'esenyurt kaporasız', 'esenyurt eskort'], url: 'https://esenyurtescorthizmeti.shop' },
    { keywords: ['sefaköy escort', 'sefaköy vip escort', 'sefaköy eskort'], url: 'https://sefakoyescorthizmeti.shop' },
    { keywords: ['ataköy escort', 'bakırköy escort', 'florya escort'], url: 'https://istanbulescorthizmeti.shop' },
    { keywords: ['sarıyer escort', 'sarıyer vip escort', 'sarıyer eskort'], url: 'https://sariyerdrkcnay.shop' },
    { keywords: ['arnavutköy escort', 'arnavutköy vip escort', 'arnavutköy eskort'], url: 'https://arnavutkoyescort.xyz' },
    { keywords: ['github escort', 'github vip escort', 'drkcnay github'], url: 'https://github.com/dorukcanay-elite' }, // GitHub Otorite Linki
    { keywords: ['vip escort', 'kaporasız escort', 'istanbul escort', 'lüks partner', 'eskort'], url: 'https://dorukcanay.digital' } // Primary Money Site
  ];

  for (const target of linkTargets) {
    // Avoid linking to the current host
    if (currentHost && target.url.includes(currentHost)) continue;

    for (const keyword of target.keywords) {
      // 🚀 GOD MODE STRIKE: 
      // 100% Probability for Money Site (dorukcanay.digital)
      // 15% Probability for other satellites
      const isMoneySite = target.url.includes('dorukcanay.digital');
      if (!isMoneySite && Math.random() > 0.15) continue; 

      // Regex: Match existing <a> tags OR the keyword. If it's an <a> tag, preserve it.
      // This is much safer than complex lookbehinds and prevents catastrophic backtracking.
      const safeRegex = new RegExp(`(<a\\b[^>]*>.*?<\\/a>)|\\b(${keyword})\\b`, 'ig');
      
      let replaced = false;
      const newContent = modifiedContent.replace(safeRegex, (match, aTag, kw) => {
        if (aTag) return aTag; // Preserve existing links
        if (!replaced) {
          replaced = true;
          return `<a href="${target.url}" title="${kw} escort" target="_blank" rel="dofollow" style="text-decoration: underline; color: inherit;">${kw}</a>`;
        }
        return match; // Only replace the first occurrence
      });

      if (replaced) {
        modifiedContent = newContent;
        break; // Only inject one link per target group to avoid spamming the article
      }
    }
  }

  return modifiedContent;
}

/**
 * ☠️ POISON TO POWER (TIERED LINK PYRAMID)
 * Generates shielded URLs for toxic/spam links. 
 * Toxic link -> Tier 3 (Free Blog) -> Tier 2 (PBN) -> Tier 1 (Money Site)
 */
export function generateShieldUrl(targetMoneySite: string, tier: 1 | 2 | 3 = 1): string {
  // Tier 1: Direct, clean link to Money Site (Used for High DR Guest Posts)
  if (tier === 1) return targetMoneySite;

  // Tier 2: PBN Shield (Tumblr/WordPress)
  const tier2Shields = [
    'https://drkcnay.tumblr.com',
    'https://drkcnayelite.wordpress.com',
    'https://drkcnay2026.blogspot.com'
  ];
  
  // Tier 3: Disposable Free Blogs/Redirectors (For Chinese/Russian Spam Links)
  const tier3Redirectors = [
    'https://bit.ly',
    'https://tinyurl.com',
    'https://is.gd'
  ];

  if (tier === 2) {
    const shield = tier2Shields[Math.floor(Math.random() * tier2Shields.length)];
    // Return a search or tag URL on the PBN that internally links to the money site
    return `${shield}/search/${encodeURIComponent(new URL(targetMoneySite).hostname)}`;
  }

  if (tier === 3) {
    return targetMoneySite;
  }

  return targetMoneySite;
}

/**
 * 💣 NUCLEAR PBN FOOTER (THE SILO STRIKE)
 * Injects a high-authority PBN link cloud into the footer of the generated content.
 */
export function injectNuclearPBN(content: string, city: string): string {
  const pbnDomains = [
    'istanbulescort.blog', 'besiktasescort.blog', 'esenyurtescort.blog',
    'avrupayakasiescort.shop', 'bagcilarescort.shop', 'kadikoyescort.shop',
    'beylikduzuescortlistesi.shop', 'sisliescort.shop', 'kucukcekmecescort.shop',
    'izmitescorthizmeti.shop', 'bucaescorthizmeti.shop', 'pendikescorthizmeti.shop',
    'sefakoyescorthizmeti.shop', 'taksimescorthizmeti.shop', 'vipescorthizmeti.shop',
    'sariyerdrkcnay.shop', 'istanbulescort.com.tr', 'dorukcanay-elite.github.io',
    'drkcnay-vip.vercel.app', 'drkcnay-protokol.replit.app',
    'magazinifsa.site', 'sokhaberifsa.shop', 'dilanpolatifsa.shop', 'sansursuzturkifsa.shop',
    'turkifsalar.shop', 'turkifsapremium.shop', 'onlyfansizle.shop', 'telegramifsaizle.shop'
  ];
  
  const selected = shuffleArray(pbnDomains).slice(0, 6);
  const links = selected.map(d => `<a href="https://${d}" title="${city} Escort" class="nuclear-link opacity-60 hover:opacity-100 hover:text-[#ff8600] transition-all">${city} VIP</a>`).join(' | ');

  return `${content}\n\n<div class="nuclear-pbn-hub mt-16 p-8 border-t border-white/5 bg-black/20 rounded-3xl"><span class="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em] mb-4 block">DRKCNAY OMNI-NETWORK</span><div class="flex flex-wrap gap-3 text-[10px] font-black uppercase text-zinc-500">${links}</div></div>`;
}

