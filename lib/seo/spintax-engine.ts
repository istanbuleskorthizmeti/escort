/**
 * ☠️ DRKCNAY HYDRA: ZERO-COST SPINTAX ENGINE (v6.2)
 * Sıfır maliyetle, sınırsız API limitsiz, 3000+ kelimelik devasa SEO ansiklopedileri üretir.
 * Googlebot'u kendi LSI ağımızda boğmak için tasarlanmıştır.
 */

export class SpintaxEngine {
  // --- 1. SPINTAX DICTIONARIES (LSI & NIŞ KELİMELER) ---
  private static readonly INTRO_SPINS = [
    "Nefes kesici. Sadece bir saniye. {location} sokaklarında sıradanlığı reddeden o seçkin zümre için DRKCNAY ELITE, mahremiyetin ipeklere sarılı dünyasını sunuyor. Kaporasız. Ve tamamen kusursuz.",
    "Zamanın durduğu an. Biliyoruz. {location} silüeti altında lüksün doruklarına tırmanırken yanınızda sadece bir partner değil, gecenin ritmini dikte eden bir kraliçe arıyorsunuz. Ön ödeme yok. Sadece saf tutku.",
    "Bir dokunuş. Sadece bir dokunuş yeterlidir her şeyi değiştirmeye. {location} bölgesindeki VIP beyler, sıradanlıktan sıyrılıp ruhlarını teslim edebilecekleri o nadide eşlikçiyi arıyor. Biz tam da buradayız. Gizli. Kusursuz.",
    "Bayağılığa tahammülünüz yok. Olmamalı da. {location} gecelerinde %100 gizlilik ve görsel bir şölen arayışınızda, DRKCNAY ELITE o görünmez kalkanı inşa ediyor. Sahte profillerin karanlık dehlizlerinden uzakta. Sadece zirve.",
    "Otel odasının sessizliği. Ve kapı çalınır. {location} civarında profesyonelliği bir sanat eseri gibi işleyen nadide partnerler... Kesinlikle kaporasız. Kesinlikle nefes kesici.",
    "Gecenin nabzı. {location} sınırları içerisinde elit beylere kesintisiz bir güç gösterisi sunuyoruz. İtaat eden, sınırları eriten partnerler. Ön ödemenin o zehirli şüphesine yer bırakmadan."
  ];

  private static readonly FEATURES = [
    "Sıfır İz (Tam Gizlilik) Garantisi",
    "Özel Konut ve Otel Refakati",
    "Onaylı ve Gerçek Görseller",
    "Kaporasız Doğrudan Ödeme",
    "Özel Şoförlü VIP Transfer",
    "BDSM & Dominatrix Seçenekleri",
    "GFE (Sevgili Deneyimi)",
    "Uluslararası Dil Bilen Mankenler"
  ];

  private static readonly PARAGRAPH_TEMPLATES = [
    "Kaos. Günümüz metropolünün o sağır edici kaosu. {location} bölgesinin gri duvarları arasında sıkışmış VIP beyler, aslında etten ve kemikten ziyade bir statü sembolü, bir nefes alanı arıyor. {keyword}. Bizim ajansımız, sıradanlığın o zehirli döngüsünü kırıp atıyor. Asla bir tesadüfe yer yok.",
    "Bir düşünün. Sadece saniyeler süren bir bakışma. {location} lokasyonunun en gözde ve izole mekanlarına giriş yaparken, kolunuzdaki o zarafet abidesi her şeyi anlatır. Sözlere gerek kalmaz. Sadece {keyword} arayanlar için değil. Zekanın ve estetiğin o nadir çarpışmasını isteyenler için. Üst düzey. Emsalsiz.",
    "Mahremiyet. Bu bizim en keskin kılıcımız. {location} bölgesinde fısıltıyla konuşulan isimlerin güvendiği o görünmez kalkan. {keyword} standartlarında bir gecenin anatomisini çizerken, amatörlüğe asla tahammülümüz yok. Asla. Güvenlik protokollerimiz sizi her nefeste korur.",
    "Google'ın dipsiz çöplüğü. {location} VIP partner araması yaptığınızda karşınıza çıkan o bayağı ve ucuz vizyonları tamamen unutun. Sisteme dahil ettiğimiz her bir kraliçe, entelektüel bir elekten geçer. {keyword} normlarını paramparça eden bir aurayla odaya girer.",
    "Asfaltın fısıltısı. Havalimanı ve özel marinalardan başlayan o izole yolculuğunuzda, lüks araçlarımız devrededir. {location} bölgesinin en gizli kapıları size açılırken, otele intikaliniz gölgelerin arasından yapılır. Yanınızda ise {keyword} standartlarının dahi ötesinde, size tapan bir eşlikçi.",
    "Kalabalık. Etrafınızdaki o gürültülü yığın. {location} trafiğinden tamamen soyutlanmış, deri koltukların kokusuna karışan bir ihtiras. {keyword} arayan konuklarımız için biz sadece bir ajans değiliz. Biz devasa, sessiz ve kusursuz çalışan bir lojistik dehasıyız."
  ];

  private static readonly KEYWORDS = [
    "VIP Escort", "Elit Escort", "Kaporasız Escort", "Lüks Partner",
    "Sınırsız Hizmet", "Anal Yapan Escort", "Öpüşen Escort", "Grup Escort",
    "Gece Hayatı", "Masaj Yapan Escort", "Yabancı Escort",
    "Rus Escort", "Üniversiteli Escort", "Olgun Escort", "Evlere Servis Escort",
    "Anal Uzmanı", "Talebe Çıtır", "Kolejli Escort", "Öğrenci Escort",
    "Bireysel Escort", "Kendi Evinde Escort", "Otele Gelen Escort", "Zenci Escort",
    "Sarışın Escort", "Esmer Escort", "Minyon Escort", "Balıketli Escort",
    "Fetiş Escort", "Dominant Escort", "BDSM Partner", "Köle Arayan Escort",
    "Tesettürlü Escort", "Türbanlı Escort", "Muhafazakar Escort", "Gizli Görüşme",
    "Sefaköy Escort", "Cennet Mahallesi Escort", "Halkalı Escort", "İkitelli Escort",
    "Bağcılar Escort", "Güneşli Escort", "Kirazlı Escort", "Mahmutbey Escort",
    "Beylikdüzü Escort", "Esenyurt Escort", "Avcılar Escort", "Büyükçekmece Escort",
    "Beşiktaş Escort", "Levent Escort", "Etiler Escort", "Bebek Escort",
    "Şişli Escort", "Mecidiyeköy Escort", "Nişantaşı Escort", "Fulya Escort",
    "Bakırköy Escort", "Florya Escort", "Yeşilköy Escort", "Ataköy Escort",
    "Kadıköy Escort", "Ataşehir Escort", "Maltepe Escort", "Kartal Escort",
    "Ümraniye Escort", "Üsküdar Escort", "Beykoz Escort", "Çekmeköy Escort",
    "Sarıyer Escort", "Tarabya Escort", "Zekeriyaköy Escort", "İstinye Escort",
    // 🚘 Premium & VIP Transfer Layer (Elit Odaklı)
    "vip escort transfer", "lüks transfer escort", "istanbul vip transfer", "özel şoförlü escort", "premium eşlik",
    "şişli vip transfer", "beşiktaş lüks escort", "avcılar vip escort transfer", "beylikdüzü elit lojistik",
    "kaporasız vip transfer", "elit eşlik", "lüks lojistik", "rus escort",
    "vip escortlar", "elit escortlar", "premium partnerler", "escortlar", "vip bayanlar", "seçkin partnerler"
  ];

  // --- 2. ENGINE LOGIC ---

  /**
   * Spintax metni çözer: {A|B|C} formatını rastgele seçer
   */
  private static spin(text: string): string {
    return text.replace(/\{([^{}]*)\}/g, (match, contents) => {
      const parts = contents.split('|');
      return parts[Math.floor(Math.random() * parts.length)];
    });
  }

  private static getRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private static readonly AGGRESSIVE_SUFFIXES = [
    "Kusursuzluğun İmzası - Gerçek Zirve",
    "Gecenin Mimarisi - Kaporasız Elit",
    "İhtirasın Sınırlarında - Sınırsız Fantezi",
    "Gençliğin o Yırtıcı Ateşi - Üniversiteli",
    "Deneyimin Keskin Kılıcı - Olgun Elit",
    "Podyumdan Yatağınıza - Lüks Deneyim",
    "Nefessiz Bırakan Detaylar - Dar & Oral Uzmanı",
    "Soğuk İklimin Sıcak Teması - Slav Partner",
    "Maskesiz. Saf. Gerçek."
  ];

  /**
   * Verilen lokasyon için devasa (2000-3500 kelime) bir SEO makalesi üretir.
   */
  public static generateMonsterContent(location: string, titleCategory: string = "VIP Escort"): string {
    const locName = location.charAt(0).toUpperCase() + location.slice(1);
    const suffix = this.getRandom(this.AGGRESSIVE_SUFFIXES);

    const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

    const htmlParts: string[] = [];
    htmlParts.push(`
      <header class="mb-10">
        <h2 class="text-3xl md:text-5xl font-black mb-6 text-[#ff8600] uppercase italic tracking-tighter leading-tight">${locName} ${suffix}</h2>

        <!-- HUMAN SIGNATURE: E-E-A-T Yazar Bloğu -->
        <div class="flex items-center gap-4 py-4 border-y border-zinc-900/50 mb-8">
           <div class="w-12 h-12 rounded-full bg-zinc-900 border border-[#ff8600]/30 flex items-center justify-center overflow-hidden">
              <span class="text-xl">👩🏼‍💼</span>
           </div>
           <div>
             <p class="text-white font-bold text-sm">Yazar: <span class="text-[#ff8600] italic">Eda Nur (Saha Koordinatörü)</span></p>
             <p class="text-zinc-500 text-xs">Son Güncelleme: <time datetime="${new Date().toISOString()}">${today}</time> — 12 Dakika Okuma Süresi</p>
           </div>
        </div>

        <!-- HUMAN SIGNATURE: Editörün Notu -->
        <div class="bg-zinc-950/50 border-l-4 border-rose-600 p-6 rounded-r-2xl mb-8">
           <p class="text-zinc-300 text-sm italic font-medium leading-relaxed">
             <strong>Editörün Notu:</strong> Aşağıdaki rehber, ${locName} bölgesinde faaliyet gösteren saha asistanlarımız ve VIP konuklarımızın gerçek geri bildirimleriyle derlenmiştir. Amacımız, bölgedeki lüks ve güvenlik standartlarını şeffaf bir şekilde ortaya koymaktır.
           </p>
        </div>

        <p class="lead font-bold text-xl mb-8 text-zinc-100">${this.getRandom(this.INTRO_SPINS).replace(/\{location\}/g, locName)}</p>
      </header>
    `);

    // 1. Ana Paragraf Döngüsü (Yaklaşık 10-15 uzun paragraf üretelim)
    for (let i = 0; i < 15; i++) {
      let para = this.getRandom(this.PARAGRAPH_TEMPLATES)
        .replace(/\{location\}/g, locName)
        .replace(/\{keyword\}/g, this.getRandom(this.KEYWORDS));

      htmlParts.push(`<p class="mb-6 leading-relaxed text-zinc-400">${para}</p>`);

      // Araya LSI Başlıklar ve İnsan Dokunuşları (Human Breaks) Serpiştir
      if (i % 3 === 0) {
        htmlParts.push(`
          <div class="my-10 border-t border-zinc-900/50 pt-8">
            <h3 class="text-2xl font-bold mb-4 text-white italic">Sahadan Gerçek Gözlemler: ${locName} Farkı</h3>
            <p class="text-sm text-zinc-500 mb-4">Bizim yıllara dayanan tecrübemize göre, bu bölgedeki konuklarımızın en çok dikkat ettiği detaylar şunlardır:</p>
            <ul class="list-disc pl-6 mb-6 space-y-3 text-zinc-400">
        `);
        for (let j = 0; j < 4; j++) {
          htmlParts.push(`<li><span class="text-[#ff8600] font-bold">Öncelik:</span> ${this.getRandom(this.FEATURES)}</li>`);
        }
        htmlParts.push(`</ul></div>`);
      }
    }

    // 2. SEO Agresif Katmanı (Gizlenmiş ama doğal yedirilmiş LSI yığını)
    htmlParts.push(`
      <div class="mt-16 p-8 bg-zinc-950/30 border border-zinc-900 rounded-3xl">
        <!-- SEO DID YOU MEAN BLOCK (Semantic LSI) -->
        <div class="text-xs text-zinc-500 mb-6 text-center border-b border-zinc-900/50 pb-4">
           Sıkça Arananlar: ${locName} vip escort, ${locName} elit escort, güvenilir partnerler.
        </div>

        <!-- PROMOTIONAL LAYER (Conversion Booster) -->
        <div class="my-10 bg-linear-to-r from-zinc-900 to-black p-10 rounded-[2.5rem] border border-zinc-800 flex flex-col md:flex-row items-center gap-8 group/promo overflow-hidden relative">
           <div class="absolute -top-10 -right-10 w-40 h-40 bg-rose-600/10 blur-3xl rounded-full group-hover/promo:scale-150 transition-transform duration-1000"></div>
           <div class="w-24 h-24 bg-zinc-800 rounded-3xl flex items-center justify-center text-5xl shadow-glow-sm">
              💊
           </div>
           <div class="flex-1">
              <h4 class="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Geceyi Uzat: Elite Destek</h4>
              <p class="text-zinc-400 font-medium">Geciktirici & Afrodizyak Parfümlerde <span class="text-rose-600 font-black">%70 Özel İndirim</span> ile enerjinizi koruyun. Elit partnerlerimizin tercihi.</p>
           </div>
           <a href="http://dorukcanay.digital/go" class="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all">
              İNDİRİMİ YAKALA →
           </a>
        </div>

        <h4 class="text-lg font-bold text-zinc-600 mb-4 uppercase flex items-center gap-2">
          <span class="w-2 h-2 bg-zinc-600 rounded-full"></span> Teknik Hizmet Matrisi
        </h4>
        <p class="text-sm text-zinc-600 leading-relaxed text-justify opacity-70">
    `);

    // Kelime yığınını mantıklı cümleler içinde sonsuz bir döngüyle uzatalım.
    // Human Signature: Yüksek Burstiness, anlık geçişler
    const humanTransitions = ["Dürüst olmak gerekirse... Evet. ", "Ve şunu anladık ki: ", "Olay tam da bu. ", "Bize inanın; "];

    for (let k = 0; k < 5; k++) {
      const lsi = this.getRandom(this.KEYWORDS);
      const trans = this.getRandom(humanTransitions);
      const sentence = `${trans} ${locName} bölgesindeki müşterilerimizin en çok tercih ettiği ${lsi} hizmetleri, gizlilik politikamız çerçevesinde %100 memnuniyet garantisiyle sunulmaktadır. Özel zaman dilimlerinde ${locName} vip konaklama alanlarında lüksün doruklarına ulaşabilirsiniz. `;
      htmlParts.push(sentence);
    }

    htmlParts.push(`
        </p>
      </div>
    `);

    return this.spin(htmlParts.join(''));
  }
}
