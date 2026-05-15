/**
 * 🔞 NUCLEAR ADULT NICHE MATRIX (GOD MODE v3.0 - ULTRA)
 * 56 domain için eşsiz, sarsılmaz ve ultra-agresif SEO kombinasyonları.
 */

export const ADULT_RACES = [
  "Turkish", "Russian", "Asian", "Ebony", "Latina", "European", "Ukrainian", "Belarusian", "Arab", "Persian",
  "Uzbek", "Kazakh", "Romanian", "Moldovan", "Brazilian", "Thai", "Japanese", "Korean", "Italian", "Spanish",
  "French", "German", "Greek", "American", "British", "Australian", "Scandinavian", "Dutch", "Indian", "Moroccan",
  "Serbian", "Bulgarian", "Albanian", "Swedish", "Norwegian", "Colombian", "Venezuelan", "Argentine", "Mexican"
];

export const ADULT_CATEGORIES = [
  "Anal", "BDSM", "MILF", "Teen", "Threesome", "Orgy", "Gangbang", "Fetish", "Amateur", "Professional",
  "POV", "VR", "Hentai", "Hardcore", "Softcore", "Solo", "Lesbian", "Gay", "Trans", "Interracial",
  "Anal Fantezi", "Dominatrix", "Sınırsız Escort", "Kaporasız Escort", "Evli Escort", "Dul Escort", "Üniversiteli Escort",
  "Öğrenci Escort", "Manken Escort", "Model Escort", "Boutique Escort", "Slav Escort", "Kızıl Escort", "Sarışın Escort", "Esmer Escort", "Kumral Escort", "Çikolata Ten Escort",
  "Fetişist Escort", "Lateks", "Deri", "Cosplay", "Öğretmen", "Hemşire", "Hizmetçi", "Sekreter", "Ofis Fantezisi"
];

export const ADULT_NICHES = [
  "Outdoor", "Office", "Gym", "Hotel", "Hidden Cam", "Casting", "Step Mom", "Step Sister", "Doctor", "Teacher",
  "Massage", "Spa", "Beach", "Public", "Party", "Club", "Nightlife", "Luxury", "Elite", "VIP",
  "Lüks", "Gizli", "Kaçamak", "Otel", "Rezidans", "Evlere Servis", "Otele Servis", "Kaporasız", "Güvenilir",
  "Yat Partisi", "Villa", "Havuz Başı", "Asansör", "Otopark", "Kabin", "Sinema", "Restoran", "Penthouse"
];

export const ADULT_PROFILE_ADJECTIVES = [
  "Ateşli", "Sıcak", "Nefes Kesen", "Baştan Çıkarıcı", "Vahşi", "Doyumsuz", "Kışkırtıcı", "Egzotik",
  "Masum", "Utangaç", "Vezir", "Tanrıça", "Afet", "Bomba", "Pırlanta", "Elmas", "Elite", "VIP",
  "Sarsıcı", "Göz Alıcı", "Büyüleyici", "Mistik", "Bağımlılık Yapan", "Tehlikeli", "Efsanevi", "Eşsiz"
];

export const ADULT_QUALITIES = [
  "4K Ultra HD", "1080p Full HD", "60FPS", "VR 360", "Uncensored", "Sansürsüz", "Full Movie", "Scene",
  "Gerçek Görsel", "Videolu Onay", "Canlı Teyit", "Kaporasız", "Gerçek Fotoğraflı"
];

export function generateAggressiveKeywords(niche: string, location: string = "") {
  const loc = location || "İstanbul";
  return [
    `${loc} ${niche} escort bayanlar`,
    `kaporasız ${loc} escort ${niche}`,
    `${loc} vip escort ${niche} ajansı`,
    `gerçek fotoğraflı ${loc} ${niche} escort`,
    `${loc} eve gelen ${niche} escort`,
    `${loc} otele servis ${niche} escort`,
    `${loc} rus escort`,
    `${loc} eskort telefonları`,
    `${loc} escort numaraları`,
    `${loc} güvenilir escort bayanlar`
  ];
}

function getSeedFromHost(host: string): number {
  let hash = 0;
  for (let i = 0; i < host.length; i++) {
    hash = Math.imul(31, hash) + host.charCodeAt(i) | 0;
  }
  return Math.abs(hash);
}

export function getDeterministicNicheCombo(host: string) {
  const seed = getSeedFromHost(host);
  
  const race = ADULT_RACES[Math.abs(seed % ADULT_RACES.length)];
  const category = ADULT_CATEGORIES[Math.abs((seed * 7) % ADULT_CATEGORIES.length)];
  const niche = ADULT_NICHES[Math.abs((seed * 13) % ADULT_NICHES.length)];
  const adj = ADULT_PROFILE_ADJECTIVES[Math.abs((seed * 17) % ADULT_PROFILE_ADJECTIVES.length)];
  
  return { race, category, niche, adj, fullName: `${adj} ${race} ${category}` };
}

export function getRandomProfileName(host: string = "default") {
  const { fullName } = getDeterministicNicheCombo(host);
  return fullName;
}

export function getRandomNicheCombo(host: string = "default") {
  const { race, category, niche } = getDeterministicNicheCombo(host);
  return `${race} ${niche} ${category}`;
}
export const ADULT_TAGS = [
  "VIP", "Elite", "Luxury", "Anal", "BDSM", "MILF", "Teen", "Amateur", "POV", "VR",
  "Kaporasız", "Gerçek Fotoğraflı", "Doğrulanmış", "Sınırsız", "Evli", "Dul",
  "Üniversiteli", "Öğrenci", "Slav", "Rus", "Yabancı", "Yerli", "Esmer", "Sarışın"
];
