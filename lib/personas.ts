export interface Persona {
  title: string;
  slug: string;
  category: string;
  painPoints: string[]; // What do they care about? (Privacy, Status, etc.)
  jargon: string[]; // Specific keywords for their world
  themeColor: string;
  description: string;
  icon: string;
}

export const personas: Persona[] = [
  {
    title: "İş Dünyası & İnşaat Dünyası",
    slug: "is-dunyasi-ve-insaat-dunyasi",
    category: "Professional",
    painPoints: ["Prestij", "Yorgunluk Atma", "Gizli Şantiye Ziyaretleri", "Network"],
    jargon: ["Proje", "Maliyet", "Temel", "Zirve", "Sözleşme"],
    themeColor: "from-amber-600 to-zinc-900",
    description: "Büyük projelerin ve ağır sorumlulukların ardından, zihninizi ve bedeninizi dinlendirecek, statünüze uygun elit bir mola.",
    icon: "Building"
  },
  {
    title: "Otomobil Tutkunları & Galericiler",
    slug: "galerici-ve-otomobil-tutkunlari",
    category: "Lifestyle",
    painPoints: ["Hız", "Adrenalin", "Lüks İç Tasarım", "Hızlı Buluşma"],
    jargon: ["Segment", "Performans", "Kadran", "Sürüş Keyfi", "Vites"],
    themeColor: "from-blue-600 to-zinc-900",
    description: "Hızlı yaşamayı sevenler için yüksek performanslı ve dinamik partner eşleşmeleri. Yolların ve hazların hakimi olun.",
    icon: "Car"
  },
  {
    title: "Aile Babaları & Gizli Kaçamakçılar",
    slug: "gizli-kacamak-yapan-beyefendiler",
    category: "Discreet",
    painPoints: ["Sıfır-İz", "Kusursuz Alibi", "Eve Temiz Dönüş", "Psikolojik Rahatlama"],
    jargon: ["Mesai", "Gizlilik", "Alibi", "Sessiz Liman", "Anonim"],
    themeColor: "from-rose-900 to-black",
    description: "Hayatın rutininden ve ev içi sorumluluklardan kısa bir süreliğine, hiçbir iz bırakmadan uzaklaşın. Güvenliğiniz bizim anayasamızdır.",
    icon: "Shield"
  },
  {
    title: "Pırlantıcılar & Mücevher Sektörü",
    slug: "pirlanticilar-ve-kuyumculuk-dunyasi",
    category: "High-End",
    painPoints: ["Nadir Estetik", "Hassas İşçilik", "Yüksek Bütçeli Lüks", "Gizli Zarafet"],
    jargon: ["Karat", "Işıltı", "Berraklık", "Faset", "Asalet"],
    themeColor: "from-zinc-100/20 to-zinc-900",
    description: "Göz alıcı bir berraklık ve nadir bulunan bir estetik arayanlar için; mücevher değerindeki en seçkin Elit partnerler.",
    icon: "Gem"
  },
  {
    title: "Akademik & Genç Vizyoner",
    slug: "ogrenciler-ve-genc-vizyonerler",
    category: "Dynamic",
    painPoints: ["Keşif", "Zihinsel Uyum", "Dinamizm", "Eğlence"],
    jargon: ["Kampüs", "Vizyon", "Enerji", "Trend", "Akademik"],
    themeColor: "from-green-600 to-zinc-900",
    description: "Hayatı ve tutkuyu yeni keşfeden, zihinsel uyum ve fiziksel enerjiyi bir arada arayan modern ve genç vizyonerler için.",
    icon: "GraduationCap"
  }
];
