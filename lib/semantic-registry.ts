/**
 * ELITE SEMANTIC REGISTRY v2.0
 * Comprehensive landmarks and vibes for all 81 cities.
 */

export const semanticRegistry: Record<string, { landmarks: string[], vibe: string }> = {
  // Marmara
  istanbul: {
    landmarks: ['Zorlu Center', 'Galataport', 'Nişantaşı Abdi İpekçi', 'Bebek Sahili', 'Çırağan Sarayı', 'İstinye Park'],
    vibe: 'kozmopolit ve hiç uyumayan elitizm'
  },
  bursa: {
    landmarks: ['FSM Bulvarı', 'Nilüfer Villaları', 'Mudanya Yat Limanı', 'Uludağ Zirve', 'Korupark Premium'],
    vibe: 'sanayi ve modern lüksün harmanlandığı'
  },
  kocaeli: {
    landmarks: ['Yahya Kaptan', 'Kartepe Sky', 'Gebze Elite Center', 'Sekapark Marina'],
    vibe: 'endüstriyel güç ve konfor'
  },
  balikesir: {
    landmarks: ['Ayvalık Cunda', 'Edremit Altınoluk', 'Bandırma Limanı', 'Avşa Adası'],
    vibe: 'Ege rüzgarlı ve huzurlu'
  },
  canakkale: {
    landmarks: ['Kordon', 'Truva Atı', 'Bozcaada Kalesi', 'Gelibolu Yarımadası'],
    vibe: 'tarihi ve mistik'
  },
  tekirdag: {
    landmarks: ['Hürriyet Mahallesi', 'Tekira', 'Çorlu Orion', 'Kumbağ'],
    vibe: 'Trakya enerjisi ve sahil konforu'
  },
  sakarya: {
    landmarks: ['Sapanca Gölü', 'Serdivan Mavi Durak', 'Adapazarı Bulvarı', 'Karasu Sahili'],
    vibe: 'yeşil ve sakin lüks'
  },
  yalova: {
    landmarks: ['Termal Kaplıcaları', 'Çınarcık Sahili', 'Yalova Marina', 'Yürüyen Köşk'],
    vibe: 'huzurlu ve butik'
  },
  edirne: {
    landmarks: ['Selimiye Camii', 'Saraçlar Caddesi', 'Meriç Köprüsü', 'Margi'],
    vibe: 'tarihi ve Rumeli esintili'
  },
  kirklareli: {
    landmarks: ['İğneada Longoz', 'Kıyıköy', 'İstasyon Caddesi', 'Dupnisa Mağarası'],
    vibe: 'doğal ve samimi'
  },
  bilecik: {
    landmarks: ['Şeyh Edebali Türbesi', 'Bilecik Kalesi', 'Pazaryeri Göleti', 'Söğüt'],
    vibe: 'kuruluş ruhu ve sessiz'
  },

  // Ege
  izmir: {
    landmarks: ['Kordon Boyu', 'Mavişehir Kasaba', 'Alsancak Gül Sokak', 'Çeşme Marina', 'Alaçatı Taş Evleri'],
    vibe: 'özgür ruhlu ve ultra estetik'
  },
  aydin: {
    landmarks: ['Kuşadası Marina', 'Didim Apollon', 'Adnan Menderes Bulvarı', 'Forum Aydın'],
    vibe: 'Ege güneşi ve tatil ihtişamı'
  },
  mugla: {
    landmarks: ['Bodrum Yalıkavak Marina', 'Fethiye Ölüdeniz', 'Marmaris Yat Limanı', 'Akyaka Azmak'],
    vibe: 'dünya standartlarında turistik lüks'
  },
  manisa: {
    landmarks: ['Spil Dağı', 'Magnesia', 'Mesir Parkı', 'Muradiye'],
    vibe: 'şehzadeler şehri ve endüstriyel'
  },
  denizli: {
    landmarks: ['Pamukkale Travertenleri', 'Çamlık Bulvarı', 'Forum Çamlık', 'Teleferik'],
    vibe: 'ticaretin kalbi ve termal'
  },
  afyonkarahisar: {
    landmarks: ['Termal Oteller Bölgesi', 'Afyon Kalesi', 'Park Afyon', 'İkbal'],
    vibe: 'termal lüks ve lezzet'
  },
  kutahya: {
    landmarks: ['Sera AVM', 'Kütahya Kalesi', 'Çini Müzesi', 'Yoncalı'],
    vibe: 'sanat ve tarih'
  },
  usak: {
    landmarks: ['Ulubey Kanyonu', 'Atapark', 'Karun', 'Banaz'],
    vibe: 'doğal ve sakin'
  },

  // Akdeniz
  antalya: {
    landmarks: ['Lara Otelleri', 'Konyaaltı Prive', 'Belek Golf Club', 'Kaleiçi Marina', 'Kundu VIP'],
    vibe: 'akdeniz rivierası ve sonsuz lüks'
  },
  mersin: {
    landmarks: ['Mersin Marina', 'Pozcu VIP', 'Mezitli Sahil', 'Forum Mersin'],
    vibe: 'marina esintili ve Akdenizli'
  },
  adana: {
    landmarks: ['Ziyapaşa Elite', 'Turgut Özal Bulvarı', 'Göl Kenarı Villaları', 'Menderes'],
    vibe: 'enerjik, sıcak ve ihtişamlı'
  },
  hatay: {
    landmarks: ['Asi Nehri', 'İskenderun Sahili', 'Antakya Sokakları', 'Palladium'],
    vibe: 'gastronomi ve çok kültürlü'
  },
  isparta: {
    landmarks: ['Gül Heykeli', 'Iyaşpark', 'Eğirdir Gölü', 'Davraz'],
    vibe: 'çiçek kokulu ve sakin'
  },
  burdur: {
    landmarks: ['Salda Gölü', 'Sagalassos', 'Burdur Gölü', 'İnsuyu'],
    vibe: 'doğa harikası ve huzurlu'
  },
  osmaniye: {
    landmarks: ['Park 328', 'Korkut Ata Üniversitesi Camii', 'Zorkun Yaylası'],
    vibe: 'samimi ve merkezi'
  },
  kahramanmaras: {
    landmarks: ['Piazza', 'Başkonuş Yaylası', 'Tekir', 'Maraş Kalesi'],
    vibe: 'direniş ruhlu ve lezzetli'
  },

  // İç Anadolu
  ankara: {
    landmarks: ['Atakule', 'Arjantin Caddesi', 'İncek Kasaba', 'Çankaya Köşkü', 'Panora'],
    vibe: 'bürokratik elitizm ve modern güven'
  },
  konya: {
    landmarks: ['Mevlana Müzesi', 'Meram Bağları', 'M1 Konya', 'KuleSite'],
    vibe: 'manevi ve geniş bozkır'
  },
  kayseri: {
    landmarks: ['Erciyes Kayak Merkezi', 'Talas Bahçelievler', 'Forum Kayseri', 'Cumhuriyet Meydanı'],
    vibe: 'ticari güç ve kış lüksü'
  },
  eskisehir: {
    landmarks: ['Porsuk Adalar', 'Cassaba Modern', 'Sazova', 'Odunpazarı'],
    vibe: 'akademik, genç ve estetik'
  },
  sivas: {
    landmarks: ['Çifte Minareli Medrese', 'İstasyon Caddesi', 'Paşabahçe', 'Primemall'],
    vibe: 'vakur ve tarihi'
  },
  kirikkale: {
    landmarks: ['Podium', 'Millet Bahçesi', 'Yahşihan'],
    vibe: 'stratejik ve samimi'
  },
  aksaray: {
    landmarks: ['Ihlara Vadisi', 'Nora City', 'Eğri Minare'],
    vibe: 'tarihi kavşak ve doğa'
  },
  karaman: {
    landmarks: ['Karaman Kalesi', 'Aktekke Camii', 'Makro'],
    vibe: 'sessiz ve tarihi'
  },
  nevsehir: {
    landmarks: ['Kapadokya Peribacaları', 'Uçhisar Kalesi', 'Göreme', 'Ürgüp'],
    vibe: 'büyülü ve mistik lüks'
  },
  nigde: {
    landmarks: ['Saat Kulesi', 'Niğde Kalesi', 'Bor'],
    vibe: 'huzurlu Anadolu'
  },
  kirsehir: {
    landmarks: ['Cacabey Medresi', 'Ahi Evran', 'Kent Park'],
    vibe: 'kültürel ve sakin'
  },
  yozgat: {
    landmarks: ['Çamlık Milli Parkı', 'Novada', 'Saat Kulesi'],
    vibe: 'geleneksel ve doğal'
  },
  cankiri: {
    landmarks: ['Tuz Mağarası', 'Çankırı Kalesi', 'Ilgaz Dağı'],
    vibe: 'sessiz ve gizemli'
  },

  // Karadeniz
  trabzon: {
    landmarks: ['Sümela Manastırı', 'Uzungöl', 'Meydan', 'Forum Trabzon', 'Akyazı'],
    vibe: 'fırtınalı ve gururlu'
  },
  samsun: {
    landmarks: ['Atakum Sahili', 'Piazza Samsun', 'Bandırma Gemi Müzesi', 'Amisos Tepesi'],
    vibe: 'modern cumhuriyet ruhu ve deniz'
  },
  ordu: {
    landmarks: ['Boztepe Teleferik', 'Ordu Sahili', 'Novada', 'Yason Burnu'],
    vibe: 'fındık kokulu ve yemyeşil'
  },
  rize: {
    landmarks: ['Ayder Yaylası', 'Çay Çarşısı', 'Kaçkar Dağları', 'İyidere'],
    vibe: 'yeşil zirveler ve çay enerjisi'
  },
  giresun: {
    landmarks: ['Giresun Kalesi', 'Zeytinlik Semti', 'Giresun Adası', 'Kulakkaya'],
    vibe: 'fındığın ve denizin kucağında'
  },
  artvin: {
    landmarks: ['Atatepe', 'Borçka Karagöl', 'Kafkasör', 'Hopa Sahil'],
    vibe: 'sarp yamaçlar ve uçsuz bucaksız doğa'
  },
  bolu: {
    landmarks: ['Abant Gölü', 'Gölcük', 'Yedigöller', 'İzzet Baysal Caddesi'],
    vibe: 'doğa harikası ve dört mevsim'
  },
  duzce: {
    landmarks: ['Krempark', 'Akçakoca', 'Samandere Şelalesi', 'Güzeldere'],
    vibe: 'yeşil yol ve sahil'
  },
  zonguldak: {
    landmarks: ['Filyos Sahili', 'Ereğli Sahil Yolu', 'Maden Müzesi', '67 Burda'],
    vibe: 'emeğin başkenti ve hırçın deniz'
  },
  karabuk: {
    landmarks: ['Safranbolu Evleri', 'Kristal Teras', 'Karabük Center'],
    vibe: 'UNESCO tescilli tarih ve huzur'
  },
  bartin: {
    landmarks: ['Amasra Kalesi', 'İnkumu Sahili', 'Bartın Irmağı'],
    vibe: 'butik ve tarihi sahil'
  },
  kastamonu: {
    landmarks: ['Barutçuoğlu', 'Kastamonu Kalesi', 'Nasrullah Meydanı', 'Ilgaz'],
    vibe: 'evliyalar şehri ve kadim'
  },
  sinop: {
    landmarks: ['Tarihi Cezaevi', 'Hamsilos Koyu', 'İnceburun', 'Sinop Kalesi'],
    vibe: 'en kuzeyde en mutlu'
  },
  amasya: {
    landmarks: ['Kral Kaya Mezarları', 'Yeşilırmak Kenarı', 'Şehzadeler Gezisi'],
    vibe: 'tarih kokan bir tablo gibi'
  },
  tokat: {
    landmarks: ['Novada Tokat', 'Ballıca Mağarası', 'Tokat Kalesi'],
    vibe: 'Anadolu konukseverliği'
  },
  corum: {
    landmarks: ['Hattuşaş', 'Ahlapark', 'Saat Kulesi'],
    vibe: 'hitit mirası ve ticaret'
  },
  gumushane: {
    landmarks: ['Karaca Mağarası', 'Zigana', 'Tomara Şelalesi'],
    vibe: 'maden zengini ve doğal'
  },
  bayburt: {
    landmarks: ['Baksı Müzesi', 'Bayburt Kalesi', 'Çoruh Nehri'],
    vibe: 'sessiz sanat ve doğa'
  },

  // Doğu Anadolu
  erzurum: {
    landmarks: ['Palandöken Kayak Merkezi', 'Çifte Minareli Medrese', 'MNG AVM'],
    vibe: 'dadaş vakarı ve kış güneşi'
  },
  malatya: {
    landmarks: ['Kanalboyu', 'Fahri Kayahan', 'Malatya Park', 'Şire Pazarı'],
    vibe: 'kayısı diyarı ve gelişmiş'
  },
  elazig: {
    landmarks: ['Harput Kalesi', 'Gazi Caddesi', 'Park 23'],
    vibe: 'gakgoş ruhu ve göl'
  },
  van: {
    landmarks: ['Van Gölü', 'Akdamar Adası', 'Van Kalesi', 'Urartu'],
    vibe: 'göl esintili ve kadim'
  },
  erzincan: {
    landmarks: ['Bakırcılar Çarşısı', 'Girlevik Şelalesi', 'Ermağan'],
    vibe: 'depreme dirençli ve modern'
  },
  agri: {
    landmarks: ['İshak Paşa Sarayı', 'Ağrı Dağı', 'Merkez'],
    vibe: 'dağların gölgesinde görkem'
  },
  kars: {
    landmarks: ['Ani Harabeleri', 'Kars Kalesi', 'Katarina Sarayı'],
    vibe: 'kar ve Baltık mimarisi'
  },
  mus: {
    landmarks: ['Muş Ovası', 'Tarihi Murat Köprüsü', 'Kale'],
    vibe: 'geniş ovalar ve sessizlik'
  },
  bitlis: {
    landmarks: ['Nemrut Krater Gölü', 'Ahlat Selçuklu Mezarlığı', 'Beş Minare'],
    vibe: 'tarihin kadim izleri'
  },
  bingol: {
    landmarks: ['Yüzen Ada', 'Hesarek', 'Bingöl Üniversitesi'],
    vibe: 'doğal ve sarp'
  },
  tunceli: {
    landmarks: ['Munzur Vadisi', 'Ovacık', 'Pertek Kalesi'],
    vibe: 'asi ve doğal gerdanlık'
  },
  hakkari: {
    landmarks: ['Cilo Dağları', 'Zap Suyu', 'Seyir Tepesi'],
    vibe: 'zirvelerin şehri'
  },
  ardahan: {
    landmarks: ['Çıldır Gölü', 'Şeytan Kalesi', 'Ardahan Kalesi'],
    vibe: 'soğuk ama samimi'
  },
  igdir: {
    landmarks: ['Iğdır Ovası', 'Soykırım Anıtı', 'Tuzluca'],
    vibe: 'üç sınırın kesiştiği ovada'
  },

  // Güneydoğu Anadolu
  diyarbakir: {
    landmarks: ['Surlar', 'Hevsel Bahçeleri', 'On Gözlü Köprü', 'Forum Diyarbakır'],
    vibe: 'kadim ve dirençli elitizm'
  },
  sanliurfa: {
    landmarks: ['Balıklıgöl', 'Göbeklitepe', 'Harran', 'Urfa City'],
    vibe: 'peygamberler şehri ve mistik'
  },
  gaziantep: {
    landmarks: ['İbrahimli', 'Zeugma Müzesi', 'Sanko Park', 'Antep Kalesi'],
    vibe: 'gastronomi ve sanayinin başkenti'
  },
  mardin: {
    landmarks: ['Eski Mardin Sokakları', 'Dara Antik Kenti', 'Mova Park', 'Kasımiye'],
    vibe: 'gecesi gerdanlık gündüzü seyranlık'
  },
  adiyaman: {
    landmarks: ['Nemrut Dağı Heykelleri', 'Cendere Köprüsü', 'Adıyaman Park'],
    vibe: 'tarihi zirveler ve huzur'
  },
  batman: {
    landmarks: ['Hasankeyf', 'Batman Park', 'Turgut Özal Bulvarı'],
    vibe: 'petrol ve gelişen şehir'
  },
  siirt: {
    landmarks: ['Siirt Ulu Camii', 'Tillo', 'Andera'],
    vibe: 'ilim ve mistisizm'
  },
  sirnak: {
    landmarks: ['Cudi Dağı', 'Kasrik Boğazı', 'Cizre'],
    vibe: 'dirençli ve sarp'
  },
  kilis: {
    landmarks: ['Kilis Kalesi', 'Oylum Höyük', 'Merkez'],
    vibe: 'sınır ötesi esintili'
  }
};
