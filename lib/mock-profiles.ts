export interface ProfileLimits {
  included: string[]; // Serbest/Kapsama dahil olan özel hizmetler
  excluded: string[]; // Kesinlikle yasak olan sınırlar
}

export interface PartnerProfile {
  id: string;
  name: string;
  age: number;
  height: string; 
  weight: string; 
  tier: 'VIP' | 'Elite' | 'Supreme';
  features: string[]; // Karakteristik ve sosyal özellikler
  adultBoundaries: ProfileLimits; // Cinsel özgürlük ve hizmet sınırları
  status: 'available' | 'busy' | 'reserved';
  image: string; 
  districtSlug?: string; 
}

// Vitrin (Glassmorphism Grid) için ekranda görünecek elit (sahte) profiller ve detaylı sınırları.
export const mockProfiles: PartnerProfile[] = [
  {
    id: "p_101",
    name: "Almira",
    age: 19,
    height: "1.74",
    weight: "54",
    tier: 'Supreme',
    features: ["+18 Çıtır", "Üniversiteli", "Konumuna En Yakın"],
    adultBoundaries: {
      included: ["Fransız (Oral) Öpüşme", "Masaj ve Happy Ending", "Sınırsız Zevk", "Anal (Ekstra)"],
      excluded: ["Korunmasız İlişki", "BDSM / Sert Fantaziler"]
    },
    status: 'available',
    image: "/vitrin/vip-profil-1.webp" 
  },
  {
    id: "p_102",
    name: "Ilgın",
    age: 22,
    height: "1.68",
    weight: "50",
    tier: 'Elite',
    features: ["Kızıl Saçlı", "Kapalı/Başörtülü Fantezi", "Çok Ateşli"],
    adultBoundaries: {
      included: ["Oral (Doğal)", "Grup / Çift Eşliği", "Roleplay (Rol Yapma)"],
      excluded: ["Korunmasız İlişki", "Anal", "Özel Hayat İhlali"]
    },
    status: 'busy',
    image: "/vitrin/vip-profil-2.webp"
  },
  {
    id: "p_103",
    name: "Melisa",
    age: 26,
    height: "1.77",
    weight: "58",
    tier: 'VIP',
    features: ["Rus ve Sarışın", "İş Toplantıları", "Dominant"],
    adultBoundaries: {
      included: ["BDSM (Soft)", "Fetiş Oyunları", "Anal & Oral Limitsiz", "Sınır Tanımayan Geceler"],
      excluded: ["Açık Alan Fantazileri", "Saygısız Üslup"]
    },
    status: 'available',
    image: "/vitrin/vip-profil-3.webp"
  },
  {
    id: "p_104",
    name: "Derin",
    age: 20,
    height: "1.70",
    weight: "52",
    tier: 'Elite',
    features: ["Üniversiteli Genç", "Esmer Esneklik", "GFE (Sevgili)"],
    adultBoundaries: {
      included: ["Romantik Eşlik", "Sevgili Statüsü (GFE)", "Öpüşme & Oral", "Keşfe Açık"],
      excluded: ["Şiddet İçeren Fanteziler", "Kameralı Çekim"]
    },
    status: 'reserved',
    image: "/vitrin/vip-profil-4.webp"
  }
];

export const getProfilesByDistrict = () => {
  return mockProfiles; 
};
