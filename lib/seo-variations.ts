/**
 * Elit SYNTAX ENGINE v3.0 - "VIP"
 * Rastgele parçaları birleştirerek milyarlarca farklı cümle kombinasyonu üretir.
 * Dilbilgisel yapı: [KONSEP] + [SIFAT] + [ÖZNE] + [EYLEM] + [SONUÇ]
 */

import { getCityLandmarks, getCityVibe } from './semantic-entities';

export const syntaxPool = {
  concepts: [
    'Zamanın ötesindeki bu', 'Anın kutsallaştığı bu', 'Gerçekliğin yeniden kurgulandığı bu', 
    'Gizliliğin mutlaklaştığı bu', 'Lüksün sınırlarını zorlayan bu', 'Otoritenin hissedildiği bu',
    'İhtişamın vücut bulduğu bu', 'Arzunun mimariye büründüğü bu', 'Sessizliğin dile geldiği bu',
    'Elite standartların tanımlandığı bu', 'Huzurun ve tutkunun kesiştiği bu', 'Prestijin yeni adı olan bu',
    'Gizli kalmış hazların kapısını aralayan bu', 'Asaletin ve şeffaflığın mühürlendiği bu'
  ],
  adjectives: [
    'benzersiz', 'kusursuz', 'eşsiz', 'özel', 'lüks', 'premium', 'ayrıcalıklı', 'büyüleyici', 
    'baş döndürücü', 'gizemli', 'Elit-grade', 'Prestij', 'saf', 'safir', 'kristalize',
    'radikal', 'devrimsel', 'sofistike', 'asil', 'majestik'
  ],
  trustSignals: [
    '%100 gerçek profillerle', 'kesinlikle kaporasız ve ön ödemesiz', 'yüz yüze güven esasıyla',
    'sıfır risk barındıran şeffaflıkla', 'VIP teyitli ve onaylı profillerle', 'Elit Network güvencesi altında',
    'sadece yüz yüze nakit/ödemeli olarak', 'kesinlikle depozito talep etmeden', 'asla sahte profil barındırmadan',
    'tamamen onaylanmış gerçek bireylerle'
  ],
  qualitySignals: [
    'üniversite mezunu ve kültürlü', 'fiziksel olarak kusursuz', 'üst düzey elit ve vizyoner',
    'sizi hem fiziksel hem entelektüel olarak doyuracak', 'iletişim gücü yüksek', 'prezentabl ve son derece şık'
  ],
  subjects: [
    'deneyim', 'hizmet', 'ayrıcalık', 'atmosfer', 'ortam', 'protokol', 'anlar', 'concierge desteği',
    'yaşam stili', 'buluşma dinamiği', 'haz döngüsü', 'gizlilik kalkanı', 'elit vizyon', 'küresel standart',
    'estetik zemin', 'nörolojik uyarıcı', 'duyusal şölen', 'fiziksel şifreleme'
  ],
  verbs: [
    'tasarlanmıştır', 'hazırlanmıştır', 'sunulmaktadır', 'garanti edilir', 'şekillendirilir', 
    'hayata geçirilir', 'yapılandırılır', 'mühürlenir', 'kodlanır', 'integre edilir',
    'kurgulanır', 'manifeste edilir', 'yönetilir', 'optimize edilir'
  ],
  connectors: [
    've bu durum', 'çünkü burada', 'özellikle de', 'bu sayede', 'sonuç olarak', 
    'hem de en üst düzeyde', 'tamamen size özel olarak', 'sarsılmaz bir disiplinle'
  ],
  results: [
    'sınırlarınızı yeniden belirler', 'ruhunuzu özgürleştirir', 'beklentilerinizin ötesine geçer',
    'geleneksel anlayışı yıkar', 'size tam anonimlik sağlar', 'yaşam kalitenizi maksimize eder',
    'sıradanlığı tamamen ortadan kaldırır', 'en derin arzularınıza hitap eder',
    'zihninizi gündelik dertlerden arındırır', 'size hak ettiğiniz lüksü yaşatır',
    'unutulmaz bir anıya dönüşür', 'hayatınıza yeni bir renk katar'
  ]
};

export function getRandom<T>(arr: T[], seedFunc?: () => number): T {
  const rand = seedFunc ? seedFunc() : Math.random();
  return arr[Math.floor(rand * arr.length)];
}

/**
 * Belirli bir lokasyon için tamamen benzersiz bir cümle üretir.
 */
export function generateUniqueSentence(locName: string, citySlug: string, step: number, seedFunc?: () => number): string {
  const c = getRandom(syntaxPool.concepts, seedFunc);
  const a1 = getRandom(syntaxPool.adjectives, seedFunc);
  const a2 = getRandom(syntaxPool.adjectives, seedFunc);
  const t = getRandom(syntaxPool.trustSignals, seedFunc);
  const q = getRandom(syntaxPool.qualitySignals, seedFunc);
  const s = getRandom(syntaxPool.subjects, seedFunc);
  const v = getRandom(syntaxPool.verbs, seedFunc);
  const conn = getRandom(syntaxPool.connectors, seedFunc);
  const r = getRandom(syntaxPool.results, seedFunc);

  const landmarks = getCityLandmarks(citySlug);
  const l = landmarks[Math.floor((seedFunc ? seedFunc() : Math.random()) * landmarks.length)];
  const vibe = getCityVibe(citySlug);

  const structures = [
    `${locName} lokasyonunda ${q} escortlar ile ${a1} bir ${s} (${step}. Aşama): ${c} lüks ortamında ${a2} protokoller ${t} ${v}. ${conn} bu süreç ${r}.`,
    `${step}. Kısım : ${locName} Merkezli Elite Yaklaşım - ${t} kurguladığımız bu ekosistemde, ${l} civarının en ${q} profilleri yer alıyor. ${c} vizyoner atmosferde ${a1} ${s} ${v}.`,
    `${locName} ve Çevresi İçin ${a1} Protokol: ${c} alanda ${a2} bir ${s} ${conn} ${r}. Özellikle ${l} yakınlarında ${t} işlem yapılması ve hanımefendilerin ${q} olması, bölgenin ${vibe} dokusuna tam uyum sağlıyor.`,
    `Sarsılmaz Güven ve Lüksün Noktası ${locName}: Bizde her şey ${t} ilerler. ${q} yapıdaki eşlikçilerle ${v} bu dünya, ${c} ihtişamı ${a2} bir disiplinle harmanlıyor. ${conn} ${l} çevresindeki bu durum ${r}.`,
    `${locName} VİP Kaporasız Standartlar: Bölge içindeki bu ${a1} lokasyon, misafirlerine ${t} ve ${a2} bir ${s} sunmak için özellikle ${v}. ${c} vizyonla tasarlanan bu deneyim ${r}.`,
    `${l} bölgesinin ${vibe} atmosferinde, ${locName} için özel ${v} bu ${s}, ${t} ve ${q} partnerlerle ${a1} bir seviyeye ulaşıyor.`,
    `Geleceğin Elite Rehberliği ${locName} Sınırlarında: ${c} süreç, ${l} gibi prestijli noktalarda ${t} ${v} ve sonrasında ${conn} ${r}.`,
    `${locName} sakinleri ve ziyaretçileri için ${a2} bir ${s} vaat eden bu ${a1} protokol, ${q} eşlikçilerin ${t} katılımıyla ${v}.`
  ];

  return getRandom(structures, seedFunc);
}
