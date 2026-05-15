/**
 * 🗺️ DRKCNAY HYDRA: GEO-LOGIC ENGINE
 * Maps districts to their neighboring regions for ultra-local SEO siloing.
 */

export const ISTANBUL_NEIGHBORS: Record<string, string[]> = {
  "sisli": ["nişantaşı", "mecidiyeköy", "bomonti", "beşiktaş", "kağıthane", "fulya", "osmanbey"],
  "besiktas": ["levent", "etiler", "bebek", "ortaköy", "şişli", "sarıyer", "dikilitaş"],
  "kadikoy": ["moda", "caddebostan", "suadiye", "bostancı", "üsküdar", "ataşehir", "kalamış"],
  "beylikduzu": ["yakuplu", "kavaklı", "esenyurt", "avcılar", "büyükçekmece", "gürpınar"],
  "esenyurt": ["beylikdüzü", "avcılar", "kıraç", "bahçeşehir", "başakşehir", "esenkent"],
  "bakirkoy": ["ataköy", "florya", "yeşilköy", "zeytinburnu", "bahçelievler", "incirli"],
  "atasehir": ["kadıköy", "ümraniye", "maltepe", "batı ataşehir", "içerenköy", "küçükbakkalköy"],
  "uskudar": ["kadıköy", "beykoz", "ümraniye", "kuzguncuk", "çengelköy", "beylerbeyi"],
  "beyoglu": ["taksim", "cihangir", "karaköy", "galata", "kasımpaşa", "şişhane", "istiklal"],
  "sariyer": ["istinye", "tarabya", "yeniköy", "maslak", "zekeriyaköy", "emirgan", "beşiktaş"],
  "bagcilar": ["güneşli", "mahmutbey", "esenler", "bahçelievler", "küçükçekmece", "kirazlı"],
  "kucukcekmece": ["sefaköy", "halkalı", "cennet mahallesi", "ikiteki", "florya", "avcılar"],
  "pendik": ["kartal", "tuzla", "kaynarca", "kurtköy", "sabiha gökçen", "güzelyalı"]
};

// Top tier money site locations
export const GLOBAL_VIP_LOCATIONS = [
  "istanbul", "ankara", "izmir", "antalya", "bursa", "adana", "muğla", "eskişehir", "kocaeli", "mersin", "gaziantep", "kayseri",
  // Elit semtler
  "şişli", "beşiktaş", "kadıköy", "beylikdüzü", "esenyurt", "bağcılar", "bakırköy", "ataşehir", "üsküdar", "ümraniye", "pendik",
  "fatih", "zeytinburnu", "beyoğlu", "sarıyer", "başakşehir", "avcılar", "kağıthane", "tuzla", "kartal", "maltepe",
  // VIP Lojistik
  "istanbul havalimanı", "sabiha gökçen vip", "galataport", "ataköy marina", "kalamış marina", "zorlu center"
];

// Sosyete ve Elit Bölgeler (İfşa/Cloaker domainleri için özel)
export const HIGH_SOCIETY_LOCATIONS = [
  "istanbul", "çerkezköy", "göktürk", "kemerburgaz", "zekeriyaköy", "tarabya", 
  "istinye", "bebek", "etiler", "nişantaşı", "suadiye", "caddebostan", "kalamış"
];

export const GeoLogicService = {
  /**
   * Returns a localized list of districts based on the target district and domain role.
   * If role is CLOAKER, returns elite high-society locations.
   */
  getLocalLocations(targetDistrict?: string, role?: string): string[] {
    if (role === 'CLOAKER') return HIGH_SOCIETY_LOCATIONS;
    if (!targetDistrict) return GLOBAL_VIP_LOCATIONS;
    
    const districtKey = targetDistrict.toLowerCase();
    const neighbors = ISTANBUL_NEIGHBORS[districtKey];
    
    if (!neighbors) return GLOBAL_VIP_LOCATIONS;
    
    // Always include the main district itself in the cluster
    return [targetDistrict, ...neighbors];
  }
};
