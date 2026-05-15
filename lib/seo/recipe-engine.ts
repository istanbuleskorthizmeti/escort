/**
 * 🍲 DRKCNAY RECIPE ENGINE
 * Generates local recipes for 81 Turkish cities as a cloaking layer.
 */

export const RECIPE_DATABASE: Record<string, { title: string; ingredients: string[]; instructions: string }> = {
  "istanbul": {
    title: "Geleneksel İstanbul Kanlıca Yoğurdu ve Sunumu",
    ingredients: ["Taze Süt", "Maya", "Pudra Şekeri"],
    instructions: "Sütü kaynatın, ılımaya bırakın. Mayayı ekleyip 6 saat bekletin..."
  },
  "izmir": {
    title: "Hakiki İzmir Boyozu",
    ingredients: ["Un", "Sirke", "Tahine", "Tuz"],
    instructions: "Hamuru incecik açın, tahinle yağlayıp katlayın. Yüksek ateşte pişirin..."
  },
  "ankara": {
    title: "Meşhur Ankara Tavası",
    ingredients: ["Kuzu Eti", "Arpa Şehriye", "Domates", "Biber"],
    instructions: "Etleri mühürleyin, şehriyelerle birlikte fırın kabına alın ve suyunu çekene kadar pişirin..."
  },
  "kastamonu": {
    title: "Kastamonu Etli Ekmeği",
    ingredients: ["İnce Hamur", "Kıyma", "Soğan", "Maydanoz"],
    instructions: "Hamuru sac üzerinde incecik açın, kıymalı harcı koyup kapatın..."
  },
  "antalya": {
    title: "Antalya Piyazı (Tahinli)",
    ingredients: ["Kuru Fasulye", "Tahin", "Limon Suyu", "Sarımsak"],
    instructions: "Fasulyeleri haşlayın. Tahin, limon ve sarımsakla özel sosu hazırlayıp dökün..."
  },
  // Default fallback for other cities
  "default": {
    title: "Anadolu Usulü Mercimek Çorbası",
    ingredients: ["Kırmızı Mercimek", "Soğan", "Havuç", "Tereyağı"],
    instructions: "Tüm malzemeleri haşlayıp blenderdan geçirin. Üzerine yakılmış tereyağı dökün..."
  }
};

export function getRecipeForLocation(city: string = 'default') {
  const normalizedCity = city.toLowerCase();
  return RECIPE_DATABASE[normalizedCity] || RECIPE_DATABASE['default'];
}
