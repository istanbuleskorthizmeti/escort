export interface AdminProfile {
  name: string;
  telegramHandle: string;
  professionalTitle: string;
  whatsappMessage: (location: string) => string;
}

// Her il için özel (City + Female Name) formatında tasarlanmış EscortVIP Admin/Concierge profilleri.
// Bu isimler hem yapay zeka jeneratöründe (içeriğin ağzından yazıldığı kişi), 
// hem de UI'daki iletişim butonlarında ("Alya ile Görüş") kullanılacaktır.
export const cityAdmins: Record<string, AdminProfile> = {
  istanbul: {
    name: "Mia",
    telegramHandle: "escortvip_ist_mia",
    professionalTitle: "İstanbul VIP Protokol Direktörü",
    whatsappMessage: (loc) => `Merhaba, ben Mia. ${loc} bölgesindeki seçkin buluşmalarınız için EscortVIP İstanbul iletişim hattındasınız. Nasıl yardımcı olabilirimŞ`
  },
  ankara: {
    name: "Alya",
    telegramHandle: "escortvip_ank_alya",
    professionalTitle: "Başkent Organizasyon ve Gizlilik Uzmanı",
    whatsappMessage: (loc) => `Hoş geldiniz, ben Alya. ${loc} bölgesindeki bürokratik ve elit talepleriniz için Ankara EscortVIP temsilcisiyim.`
  },
  izmir: {
    name: "Derin",
    telegramHandle: "escortvip_izm_derin",
    professionalTitle: "İzmir VIP Asistan ve Seçkin Etkinlik Yönetimi",
    whatsappMessage: (loc) => `İyi günler, ben Derin. ${loc} lokasyonundaki keyifli ve elit zamanlarınız için İzmir hattındasınız.`
  },
  antalya: {
    name: "Lara",
    telegramHandle: "escortvip_ant_lara",
    professionalTitle: "Antalya Turizm ve VIP Partner Danışmanı",
    whatsappMessage: (loc) => `Merhaba, ben Lara. ${loc} bölgesindeki lüks tatil ve eşlik protokollerinde size yardımcı olacağım.`
  },
  bursa: {
    name: "Beliz",
    telegramHandle: "escortvip_brs_beliz",
    professionalTitle: "Bursa Elit Hizmetler Koordinatörü",
    whatsappMessage: (loc) => `Hoş geldiniz, ben Beliz. ${loc} lokasyonundaki gizli ve lüks talepleriniz için EscortVIP Bursa hattındasınız.`
  },
  adana: {
    name: "Bade",
    telegramHandle: "escortvip_adn_bade",
    professionalTitle: "Adana Bölge VIP Menajeri",
    whatsappMessage: (loc) => `Merhaba, ben Bade. ${loc} civarındaki tüm elit görüşmelerinizi organize etmek için buradayım.`
  },
  mersin: {
    name: "Su",
    telegramHandle: "escortvip_mrs_su",
    professionalTitle: "Mersin VIP Profil ve Randevu Sorumlusu",
    whatsappMessage: (loc) => `İyi günler, ben Su. ${loc} bölgesi EscortVIP yetkilisiyim. Detayları paylaşabilir misinizŞ`
  },
  gaziantep: {
    name: "Lina",
    telegramHandle: "escortvip_antp_lina",
    professionalTitle: "Gaziantep Özel Müşteri Temsilcisi",
    whatsappMessage: (loc) => `Merhaba, ben Lina. ${loc} bölgesindeki seçkin profil taleplerinizi benimle paylaşabilirsiniz.`
  },
  eskisehir: {
    name: "Melis",
    telegramHandle: "escortvip_esk_melis",
    professionalTitle: "Eskişehir Genç ve Dinamik VIP Asistanı",
    whatsappMessage: (loc) => `Hoş geldiniz, Eskişehir ${loc} bölgesi operasyon yöneticisi Melis ben. Size nasıl eşlik edebilirizŞ`
  },
  denizli: {
    name: "İpek",
    telegramHandle: "escortvip_dnz_ipek",
    professionalTitle: "Denizli Ege Temsilcisi",
    whatsappMessage: (loc) => `Merhaba, ben İpek. ${loc} tarafındaki özel zamanlarınız için EscortVIP danışmanınızım.`
  },
  artvin: {
    name: "Kumsal",
    telegramHandle: "escortvip_art_kumsal",
    professionalTitle: "Artvin Sınır ve Karadeniz Kapsamı VIP Asistan",
    whatsappMessage: (loc) => `Karadeniz'in incisi Artvin ${loc} bölgesi için yetkili Kumsal ben. İletişim için buradayım.`
  },
  tekirdag: {
    name: "Selin",
    telegramHandle: "escortvip_tkr_selin",
    professionalTitle: "Trakya Bölgesi VIP Yönetmeni",
    whatsappMessage: (loc) => `Merhaba, Tekirdağ ${loc} lokasyonundaki elit talepleriniz için ben Selin.`
  },
  kocaeli: {
    name: "Simay",
    telegramHandle: "escortvip_kcl_simay",
    professionalTitle: "Kocaeli Sanayi ve Plaza Müşteri Asistanı",
    whatsappMessage: (loc) => `İyi günler, Kocaeli ${loc} VIP organizasyonlarından sorumlu Simay ben.`
  },
  bolu: {
    name: "Ece",
    telegramHandle: "escortvip_bol_ece",
    professionalTitle: "Bolu Dağ ve VIP Tesis Asistanı",
    whatsappMessage: (loc) => `Hoş geldiniz, Bolu ${loc} bölgesindeki gizli organizasyonlarınız için ben Ece, yetkili temsilcinizim.`
  }
};

// Varsayılan erişim kodu (Bilinmeyen veya yeni açılan iller için)
export const defaultAdmin: AdminProfile = {
  name: "Giselle",
  telegramHandle: "escortvip_merkez",
  professionalTitle: "Türkiye Operasyon ve Protokol Yöneticisi",
  whatsappMessage: (loc) => `Türkiye VIP Escort ağı, merkez yönetimden Giselle ben. ${loc} lokasyonu için talebinizi alabilirim.`
};
