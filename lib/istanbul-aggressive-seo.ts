/**
 * 💣 ISTANBUL NUCLEAR SEO ENGINE (BLACK HAT v1.0)
 * Specialized for dominating Istanbul and its districts.
 */

export const ISTANBUL_DISTRICTS = [
  "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", 
  "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", 
  "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", 
  "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye", 
  "Üsküdar", "Zeytinburnu"
];

export function generateIstanbulAggressiveMetadata(district: string = "İstanbul", neighborhood?: string) {
  const d = district.toUpperCase();
  const n = neighborhood ? `${neighborhood.toUpperCase()} | ` : "";
  const loc = neighborhood ? `${neighborhood}, ${district}` : district;
  
  // 🔥 STABLE TITLES (No Math.random to prevent hydration issues and maintain authority)
  const title = `🔞 ${n}${d} VIP ESCORT | %100 GERÇEK VE KAPORASIZ | DRKCNAY ELITE`;
  const description = `${loc} bölgesinde en seçkin VIP escort deneyimi ve elit escort bayanlar. %100 gerçek görselli rus escort, üniversiteli genç escort ve sınırsız hizmet seçenekleri. KAPORASIZ işlem ve tam dominasyon!`;
  
  const keywords = [
    `${loc} escort`, `${loc} vip escort`, `${loc} rus escort`, 
    `istanbul escort`, `istanbul vip escort`, `${loc} kaporasız escort`,
    `${district} escort`, `${neighborhood || district} üniversiteli escort`,
    `escort ${loc}`, `vip escort istanbul`, `escort ilanları`
  ];

  return {
    title,
    description,
    keywords: keywords.join(", ")
  };
}
