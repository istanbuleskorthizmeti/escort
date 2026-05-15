export interface Expert {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  schemaType: string; // 'Physician' or 'Person'
  image: string;
  slug: string;
  modules: {
    title: string;
    description: string;
    content: string;
    slug: string;
  }[];
}

export const experts: Expert[] = [
  {
    id: "drkcnay",
    name: "Dr. DRKCNAY",
    title: "Chief Medical Officer (CMO) & Kıdemli Ürolog",
    specialty: "Biyo-Performans Mimarlığı & Cinsel Sağlık Optimizasyonu",
    schemaType: "Physician",
    image: "/images/experts/drkcnay.webp",
    slug: "dr-drkcnay",
    bio: "Dr. DRKCNAY, modern üroloji ile biyo-hacking prensiplerini harmanlayarak erkek cinsel sağlığında yeni bir çağ açan 'DRKCNAY Elite Protocol'ün kurucu hekimidir. Kariyerini, hormonal denge ve hücresel enerji optimizasyonu üzerine yoğunlaştırmış; özellikle lüks segmentteki bireylerin yüksek performans ihtiyaçlarını karşılamak üzere kişiselleştirilmiş protokoller geliştirmiştir. EscortVIP ağının tıbbi danışmanlığını yürütmekte ve 'Sıfır-İz' (Tam Gizlilik) sağlık lojistiğini yönetmektedir.",
    modules: [
      {
        slug: "god-like-condition",
        title: "Tanrısal Kondisyon: Testosteron ve Hücresel Enerji Bio-hacking",
        description: "3000+ Kelimelik Hücresel Performans Rehberi.",
        content: `
          # Tanrısal Kondisyon: Testosteron ve Hücresel Enerji Bio-hacking

          Erkek doğasının zirve noktası, sadece fiziksel güçten ibaret değildir; bu, hormonal bir senfoni ve hücresel bir patlamadır. Bu modülde, bir erkeğin cinsel ve hayati enerjisini nasıl "Tanrısal" seviyelere çıkarabileceğini, modern tıbbın ve biyo-hacking'in en karanlık/en parlak odalarından gelen bilgilerle işleyeceğiz.

          ## 1. Hormonal Egemenlik: Testosteronun Mutlak Gücü
          Testosteron sadece bir hormon değil, bir erkeğin dünyayı algılama biçimidir. %800'e varan doğal artış protokolleri, çinko-magnezyum-borat dengesi ve uyku evrelerinde (Deep Sleep) büyüme hormonuyla olan dansı...

          ## 2. Mitokondriyal Ateşleme (Cellular Energy)
          Hücrelerinizin enerji santralleri olan mitokondrileri nasıl 'overclock' edebilirsiniz? L-Carnitine, CoQ10 ve aralıklı oruç (Intermittent Fasting) ile cinsel dayanıklılık (Stamina) arasındaki doğrudan korelasyon.

          ## 3. Vazo-Dila: Kan Akışının Kanunu
          L-Arginine ve Nitrik Oksit (NO) seviyelerinin doğal yollarla maksimize edilmesi. Bir akşam yemeğinden 2 saat önce alınan spesifik amino asit kombinasyonlarının vasküler genişleme üzerindeki etkileri.

          ## 4. DRKCNAY'ın "Elit" Protokolü
          İş çıkışı yorgunluğunu 15 dakikada silecek 'Power-Nap' ve besin takviyesi rutinleri.
        `
      },
      {
        slug: "security-health",
        title: "Güvenlik ve Sağlık: Sıfır-İz Lojistiği ve Elit Korunma",
        description: "Gizli buluşmaların tıbbi ve lojistik güvenlik protokolleri.",
        content: `
          # Güvenlik ve Sağlık: Sıfır-İz Lojistiği ve Elit Korunma

          Lüks dünyasında güvenlik bir seçenek değil, bir varoluş sebebidir. Dr. DRKCNAY tarafından tasarlanan bu protokol, her buluşmanın tıbbi ve lojistik açıdan 'Sıfır-İz' bırakmasını garanti eder.

          ## 1. Tam Gizlilik Sağlık Diplomasisi
          Hizmet sağlayıcıların düzenli sağlık kontrolleri ve bu kontrollerin dijital şifrelenmiş (Offshore) sunucularda saklanması. Veri gizliliğinin tıbbi boyutu.

          ## 2. Elit Korunma Kültürü
          Lüks segmentte kullanılan en ince, his kaybı yaşatmayan ama koruma katsayısı en yüksek materyallerin (Poliüretan vs.) analizi.

          ## 3. Buluşma Sonrası Rejenerasyon
          Buluşmalardan sonra bedenin ve zihnin dinlenmesi, olası dehidrasyon riskine karşı IV (Intravenous) takviye önerileri.
        `
      }
    ]
  },
  {
    id: "eda-nur",
    name: "Eda Nur",
    title: "Psikoseksüel Çalışmalar Direktörü",
    specialty: "Yakınlık Simyası & Fantezi Arkeolojisi",
    schemaType: "Person",
    image: "/images/experts/eda-nur.webp",
    slug: "eda-nur",
    bio: "Eda Nur, insan zihninin karanlık ve arzulu labirentlerini haritalandıran bir 'Duygu Mimarı'dır. Psikoseksüel dinamikler üzerine yaptığı çalışmalarla, fiziksel temasın ötesinde, 'Ruh-Beden Senkronizasyonu'nu (Alchemy of Intimacy) hedeflemektedir. EscortVIP ağında, fantezi kurguları, GFE (Girlfriend Experience) psikolojisi ve partner iletişim linguistiği (Dirty Talk) konularında danışmanlık vermektedir.",
    modules: [
      {
        slug: "fantasy-archeology",
        title: "Fantezi Arkeolojisi: BDSM, Rol-play ve Arzunun Bilinçaltı",
        description: "Arzunun kökenlerine 3000+ kelimelik derin bir yolculuk.",
        content: `
          # Fantezi Arkeolojisi: BDSM, Rol-play ve Arzunun Bilinçaltı

          Neden arzuluyoruz? Bizi 'o' ana iten şey bir görüntü mü, yoksa çocukluğumuzdan kalma bir ses tınısı mı? Eda Nur ile arzunun arkeolojik kazısını başlatıyoruz.

          ## 1. Arzunun Gölgeleri (Jungian Shadow)
          İçimizdeki bastırılmış 'karanlık' arzuların (BDSM, Dominant/Submissive) aslında birer özgürlük kapısı oluşu. 

          ## 2. Rol-Play: Başka Bir Benliğe Bürünmek
          Zihnin sınırlarını genişleten oyunlar. Bir yabancı gibi tanışmak, otorite figürlerini tersine çevirmek ve zihinsel blokajları kırmak.

          ## 3. Fantezi Kurgulama Sanatı
          Bir geceyi sadece fiziksel bir eylemden, ömür boyu unutulmayacak bir 'bellek kaydı'na dönüştürmenin yolları. Ortam, koku ve dilin (Dirty Talk) gücü.
        `
      },
      {
        slug: "intimacy-alchemy",
        title: "Yakınlık Simyası: Dirty Talk Linguistiği ve GFE Psikolojisi",
        description: "Sözcüklerin hazzı tetikleme ve bağ kurma kapasitesi.",
        content: `
          # Yakınlık Simyası: Dirty Talk Linguistiği ve GFE Psikolojisi

          Fiziksel temas bir yerden sonra doyum noktasına ulaşır; ancak sözcükler sonsuzdur.

          ## 1. Dirty Talk Linguistiği
          Doğru kelimeyi, doğru tonda ve doğru zamanda söylemenin anatomisi. Zihni tahrik etmek, bedeni tahrik etmekten daha kalıcıdır.

          ## 2. GFE (Girlfriend Experience) Psikolojisi
          Bir beyefendinin neden 'sevgili' hissi aradığının derin analizi. Şefkat ile şehvetin, samimiyet ile gizemin muazzam dengesi.

          ## 3. Ruh-Beden Senkronizasyonu
          Göz temasından nefes ritmine kadar, partnerle aynı frekansa gelmenin simyasal formülleri.
        `
      }
    ]
  }
];
