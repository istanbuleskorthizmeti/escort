export interface ElitEvent {
  title: string;
  slug: string;
  date: string; // ISO format or human readable
  city: string;
  category: "Sports" | "Concert" | "Festival" | "Summit" | "National";
  description: string;
  venue?: string;
  priority: number; // 1 (High) to 5 (Low)
}

export const ElitEvents: ElitEvent[] = [
  {
    title: "Andrea Bocelli İstanbul Konseri",
    slug: "andrea-bocelli-istanbul-konseri-2026",
    date: "2026-05-30",
    city: "istanbul",
    category: "Concert",
    venue: "Tüpraş Stadyumu",
    description: "Dünyaca ünlü tenor Andrea Bocelli, büyüleyici sesiyle İstanbul'da. Sanat ve lüksün buluştuğu bu özel gecede, ruhunuzu dinlendirecek elit bir eşlik deneyimi sizi bekliyor.",
    priority: 2
  },
  {
    title: "Kanye West (Ye) İstanbul Konseri",
    slug: "kanye-west-istanbul-konseri-2026",
    date: "2026-05-30",
    city: "istanbul",
    category: "Concert",
    venue: "Atatürk Olimpiyat Stadyumu",
    description: "Global hip-hop ikonu Kanye West, radikal vizyonuyla İstanbul sahnelerinde. Sınır tanımayan bir gece ve yüksek enerji için Elit VIP partner ağınız emrinizde.",
    priority: 1
  },
  {
    title: "Scorpions 'Love at First Sting' 40th Anniversary",
    slug: "scorpions-istanbul-konseri-2026",
    date: "2026-06-24",
    city: "istanbul",
    category: "Concert",
    venue: "Tüpraş Stadyumu",
    description: "Efsanevi rock grubu Scorpions, veda turnesi tadındaki 40. yıl konseriyle İstanbul'u sallamaya geliyor. Klasik rock ruhunu elit bir escort eşliğinde yaşayın.",
    priority: 2
  },
  {
    title: "664. Kırkpınar Yağlı Güreşleri",
    slug: "kirkpinar-yagli-guresleri-edirne-2026",
    date: "2026-06-29",
    city: "edirne",
    category: "Festival",
    description: "Geleneksel Türk sporunun zirvesi. Edirne'deki bu tarihi festivalde kültürel bir deneyim ve özel eşlik hizmetleri.",
    priority: 3
  },
  {
    title: "Antalya Altın Portakal Film Festivali",
    slug: "antalya-altin-portakal-film-festivali-2026",
    date: "2026-10-15",
    city: "antalya",
    category: "Festival",
    description: "Türk sinemasının kalbi Antalya'da atıyor. Kırmızı halı şıklığında, sinema dünyasının elitleri arasında size eşlik edecek asil partnerler Elit ağında.",
    priority: 2
  },
  {
    title: "Kapadokya Balon Festivali",
    slug: "kapadokya-balon-festivali-2026",
    date: "2026-08-03",
    city: "nevsehir",
    category: "Festival",
    description: "Peribacaları ve rengarenk balonlar arasında mistik bir atmosfer. Kapadokya'nın büyüsünü özel sessiz rehberlerimizle keşfedin.",
    priority: 3
  },
  {
    title: "İzmir Enternasyonal Fuarı",
    slug: "izmir-enternasyonal-fuari-2026",
    date: "2026-08-28",
    city: "izmir",
    category: "Festival",
    description: "Türkiye'nin en köklü ticaret ve eğlence fuarı. İzmir'in kordon boyunda, fuar yorgunluğunu atacağınız elit kaçamaklar için escortvip yanınızda.",
    priority: 3
  },
  {
    title: "Lamb of God İstanbul Konseri",
    slug: "lamb-of-god-istanbul-konseri-2026",
    date: "2026-07-24",
    city: "istanbul",
    category: "Concert",
    venue: "Parkorman",
    description: "Metal müziğin dev ismi Lamb of God ile sert ve adrenalin dolu bir gece. Sınırları zorlamayı sevenler için Elit-Grade fantezi dünyası.",
    priority: 3
  }
];
