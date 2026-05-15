/**
 * İSTANBUL GERÇEK DÜNYA VERİ SİCİLİ (GOD MODE v2.0)
 * Kültür, Gastronomi ve Gece Hayatı verileriyle zenginleştirilmiş semantik veri seti.
 */

export interface DistrictData {
  streets: string[];
  hospitals: string[];
  transport: string[];
  landmarks: string[];
  culture?: string[];
  lifestyle?: string[];
  vibe: string;
}

export const istanbulData: Record<string, DistrictData> = {
  bakirkoy: {
    streets: ['İstanbul Caddesi', 'Ebuzziya Caddesi', 'İncirli Caddesi', 'Fişekhane Caddesi'],
    hospitals: ['Dr. Sadi Konuk Eğitim ve Araştırma Hastanesi', 'Acıbadem Bakırköy Hastanesi', 'Dünyagöz Hastanesi'],
    transport: ['Marmaray Bakırköy İstasyonu', 'M1A İncirli Metro', 'M3 Özgürlük Meydanı Metro', 'Bakırköy İDO'],
    landmarks: ['Özgürlük Meydanı', 'Bakırköy Sahil Parkı', 'Capacity AVM', 'Carousel AVM'],
    culture: ['Leyla Gencer Opera ve Sanat Merkezi', 'Bakırköy Belediye Tiyatroları', 'Fildamı Sarnıcı'],
    lifestyle: ['Yeşilköy Balıkçıları', 'Ataköy Marina Marina Park', 'Florya Sosyal Tesisleri'],
    vibe: 'köklü, sahil esintili ve alışveriş odaklı elit yaşam'
  },
  besiktas: {
    streets: ['Barbaros Bulvarı', 'Çırağan Caddesi', 'Nispetiye Caddesi', 'Şair Nedim Caddesi'],
    hospitals: ['Beşiktaş Sait Çiftçi Devlet Hastanesi', 'Acıbadem Fulya', 'American Hospital'],
    transport: ['Zincirlikuyu Metrobüs Aktarma', 'Beşiktaş İskelesi', 'M7 Yıldız Metro'],
    landmarks: ['Dolmabahçe Sarayı', 'Çırağan Sarayı', 'Bebek Sahili', 'Ortaköy Camii'],
    culture: ['Deniz Müzesi', 'Akaretler Sıraevler', 'Beşiktaş Kültür Merkezi (BKM)'],
    lifestyle: ['Ulus 29', 'Sunset Grill & Bar', 'Bebek Lucca', 'Sortie & Reina (Lokal Bilgi)'],
    vibe: 'boğazın kalbi, tarihi ihtişam ve ultra lüks gece hayatı'
  },
  sisli: {
    streets: ['Büyükdere Caddesi', 'Halaskargazi Caddesi', 'Abdi İpekçi Caddesi', 'Valikonağı Caddesi'],
    hospitals: ['Şişli Hamidiye Etfal', 'Prof. Dr. Cemil Taşçıoğlu Şehir Hastanesi', 'Florence Nightingale'],
    transport: ['Mecidiyeköy Metro & Metrobüs', 'Osmanbey Metro', 'Gayrettepe Metro'],
    landmarks: ['Cevahir AVM', 'Zorlu Center', 'Atatürk Evi Müzesi', 'Maçka Parkı'],
    culture: ['Lütfi Kırdar Kongre Merkezi', 'Harbiye Cemil Topuzlu Açık Hava Tiyatrosu', 'Bomontiada'],
    lifestyle: ['Nişantaşı Brasserie', 'Nusr-Et Sandal Bedesteni (yakın)', 'Park Şamdan'],
    vibe: 'modern iş dünyası, moda merkezi ve kozmopolit elitizmin zirvesi'
  },
  kadikoy: {
    streets: ['Bağdat Caddesi', 'Bahariye Caddesi', 'Moda Caddesi', 'Söğütlüçeşme Caddesi'],
    hospitals: ['Göztepe Şehir Hastanesi', 'Haydarpaşa Numune', 'Florence Nightingale Kadıköy'],
    transport: ['Söğütlüçeşme Metrobüs & Marmaray & YHT', 'Kadıköy Rıhtım İskelesi', 'M4 Kadıköy Metro'],
    landmarks: ['Moda Sahili', 'Boğa Heykeli', 'Kalamış Marina', 'Fenerbahçe Parkı'],
    culture: ['Süreyya Operası', 'Haldun Taner Sahnesi', 'Barış Manço Müzesi'],
    lifestyle: ['Moda Teras', 'Bağdat Caddesi Vakko L’Atelier', 'Kalamış Develi'],
    vibe: 'Anadolu yakasının entelektüel ruhu ve estetik sahil yaşamı'
  }
};
